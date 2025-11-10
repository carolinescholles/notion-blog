import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Client } from '@notionhq/client';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env.local') });

import { translateContent } from '../lib/translator.js';
import { createTranslatedPage, createNotionBlocks, checkTranslationsExist } from '../lib/notion-writer.js';

// Create Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Standalone getBlocks function
async function getBlocks(blockId) {
  const cleanBlockId = blockId.replaceAll('-', '');

  const { results } = await notion.blocks.children.list({
    block_id: cleanBlockId,
    page_size: 100,
  });

  // Fetch child blocks recursively
  const childBlocks = await Promise.all(
    results.map(async (block) => {
      if (block.has_children) {
        const children = await getBlocks(block.id);
        return { ...block, children };
      }
      return block;
    })
  );

  return childBlocks;
}

// Standalone getPage function
async function getPage(pageId) {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
}

const databaseId = process.env.NOTION_DATABASE_ID;
const targetLocales = ['en', 'es', 'fr', 'it', 'ja'];

/**
 * Extract page ID from Notion URL or use direct ID
 */
function extractPageId(input) {
  // If it's already a clean ID, return it
  if (input.match(/^[a-f0-9]{32}$/i)) {
    return input;
  }

  // Extract from URL patterns
  const patterns = [
    /notion\.so\/.*-([a-f0-9]{32})/i,  // Standard URL
    /notion\.so\/([a-f0-9]{32})/i,      // Short URL
    /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i, // UUID format
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      return match[1].replace(/-/g, '');
    }
  }

  throw new Error('Could not extract page ID from input. Please provide a valid Notion page URL or ID.');
}

/**
 * Translate a single post to all target languages
 */
async function translatePost(pageIdOrUrl) {
  try {
    const pageId = extractPageId(pageIdOrUrl);
    console.log('\n📄 Fetching original post...');

    // Get original page and blocks
    const originalPage = await getPage(pageId);
    const originalBlocks = await getBlocks(pageId);

    if (!originalPage.properties) {
      throw new Error('Could not fetch page properties. Make sure the page ID is correct and you have access.');
    }

    // Extract page info
    const title = originalPage.properties['Property Name']?.title?.[0]?.plain_text;
    const slug = originalPage.properties.Slug?.rich_text?.[0]?.text?.content;
    const locale = originalPage.properties.Locale?.select?.name || 'pt-BR';

    if (!title) {
      throw new Error('Could not find page title. Make sure the page has a "Property Name" title field.');
    }

    if (!slug) {
      throw new Error('Could not find page slug. Make sure the page has a "Slug" field.');
    }

    console.log(`\n✓ Found: "${title}"`);
    console.log(`  Slug: ${slug}`);
    console.log(`  Locale: ${locale}`);
    console.log(`  Blocks: ${originalBlocks.length}`);

    // Check if this is a Portuguese post
    if (locale !== 'pt-BR') {
      console.log(`\n⚠️  Warning: This post is marked as "${locale}", not "pt-BR".`);
      console.log('  Translations will still be created, but the source is expected to be Portuguese.');
    }

    // Check which translations already exist
    console.log('\n🔍 Checking for existing translations...');
    const existing = await checkTranslationsExist(databaseId, slug, targetLocales);

    const toTranslate = targetLocales.filter(locale => !existing[locale]);
    const alreadyTranslated = targetLocales.filter(locale => existing[locale]);

    if (alreadyTranslated.length > 0) {
      console.log(`  ⏭️  Skipping (already exist): ${alreadyTranslated.join(', ')}`);
    }

    if (toTranslate.length === 0) {
      console.log('\n✅ All translations already exist! Nothing to do.');
      return;
    }

    console.log(`  🌍 Will translate to: ${toTranslate.join(', ')}`);

    // Translate to each target locale
    let successCount = 0;
    let failCount = 0;

    for (const targetLocale of toTranslate) {
      try {
        console.log(`\n🌐 Translating to ${targetLocale}...`);

        // Translate content
        const { title: translatedTitle, blocks: translations } = await translateContent(
          title,
          originalBlocks,
          targetLocale
        );

        console.log(`  ✓ Translation complete`);
        console.log(`  📝 Creating Notion page...`);

        // Create new page
        const newPage = await createTranslatedPage(
          databaseId,
          originalPage,
          translatedTitle,
          targetLocale
        );

        console.log(`  ✓ Page created: ${newPage.id}`);
        console.log(`  📦 Adding ${translations.length} blocks...`);

        // Add blocks to new page
        const blockCount = await createNotionBlocks(newPage.id, originalBlocks, translations);

        console.log(`  ✅ Success! Created ${targetLocale} version with ${blockCount} blocks`);
        successCount++;

      } catch (error) {
        console.error(`  ❌ Failed to create ${targetLocale} translation:`);
        console.error(`     ${error.message}`);
        failCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Translation Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    if (failCount > 0) {
      console.log(`   ❌ Failed: ${failCount}`);
    }
    if (alreadyTranslated.length > 0) {
      console.log(`   ⏭️  Skipped: ${alreadyTranslated.length}`);
    }
    console.log('='.repeat(60));

    if (successCount > 0) {
      console.log('\n🎉 Done! Your translated posts are now in Notion.');
      console.log(`   View them at: https://notion.so/${databaseId.replace(/-/g, '')}`);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack && process.env.DEBUG) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Get page ID from command line
const input = process.argv[2];

if (!input) {
  console.log(`
📝 Notion Post Translator

Usage:
  npm run translate <notion-page-url-or-id>

Examples:
  npm run translate https://notion.so/My-Post-abc123def456...
  npm run translate abc123def456...

This will translate your Portuguese post to English, Spanish, French, and Italian,
creating 4 new pages in your Notion database.

Environment variables needed:
  NOTION_TOKEN          - Your Notion integration token
  NOTION_DATABASE_ID    - Your blog database ID
  ANTHROPIC_API_KEY     - Your Anthropic API key for Claude
`);
  process.exit(1);
}

// Run translation
translatePost(input);
