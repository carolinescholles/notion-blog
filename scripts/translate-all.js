import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env.local') });

import { getDatabase, getBlocks } from '../lib/notion.js';
import { translateContent } from '../lib/translator.js';
import { createTranslatedPage, createNotionBlocks, checkTranslationsExist } from '../lib/notion-writer.js';

const databaseId = process.env.NOTION_DATABASE_ID;
const targetLocales = ['en', 'es', 'fr', 'it', 'ja'];

/**
 * Translate all posts that don't have translations yet
 */
async function translateAllPosts() {
  try {
    console.log('\n🔍 Fetching all Portuguese posts...\n');

    // Get all published Portuguese posts
    const posts = await getDatabase('pt-BR');

    if (!posts || posts.length === 0) {
      console.log('No Portuguese posts found.');
      return;
    }

    console.log(`Found ${posts.length} Portuguese posts\n`);

    let totalTranslated = 0;
    let totalSkipped = 0;
    let totalFailed = 0;

    // Process each post
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const title = post.properties['Property Name']?.title?.[0]?.plain_text;
      const slug = post.properties.Slug?.rich_text?.[0]?.text?.content;

      if (!title || !slug) {
        console.log(`⏭️  Skipping post ${i + 1}: Missing title or slug`);
        totalSkipped++;
        continue;
      }

      console.log(`\n${'='.repeat(60)}`);
      console.log(`📄 [${i + 1}/${posts.length}] ${title}`);
      console.log(`   Slug: ${slug}`);
      console.log(`${'='.repeat(60)}`);

      // Check which translations exist
      const existing = await checkTranslationsExist(databaseId, slug, targetLocales);
      const toTranslate = targetLocales.filter(locale => !existing[locale]);
      const alreadyExists = targetLocales.filter(locale => existing[locale]);

      if (alreadyExists.length > 0) {
        console.log(`   ✓ Already translated: ${alreadyExists.join(', ')}`);
      }

      if (toTranslate.length === 0) {
        console.log(`   ⏭️  All translations exist, skipping`);
        totalSkipped++;
        continue;
      }

      console.log(`   🌍 Will translate to: ${toTranslate.join(', ')}`);

      // Get blocks
      const blocks = await getBlocks(post.id);

      // Translate to each missing locale
      for (const targetLocale of toTranslate) {
        try {
          console.log(`\n   → Translating to ${targetLocale}...`);

          // Translate
          const { title: translatedTitle, blocks: translations } = await translateContent(
            title,
            blocks,
            targetLocale
          );

          // Create page
          const newPage = await createTranslatedPage(
            databaseId,
            post,
            translatedTitle,
            targetLocale
          );

          // Add blocks
          await createNotionBlocks(newPage.id, blocks, translations);

          console.log(`   ✅ ${targetLocale} created successfully`);
          totalTranslated++;

        } catch (error) {
          console.error(`   ❌ ${targetLocale} failed: ${error.message}`);
          totalFailed++;
        }
      }
    }

    // Final summary
    console.log(`\n\n${'='.repeat(60)}`);
    console.log('📊 Final Summary:');
    console.log(`   Total posts processed: ${posts.length}`);
    console.log(`   ✅ Translations created: ${totalTranslated}`);
    console.log(`   ⏭️  Posts skipped (already translated): ${totalSkipped}`);
    if (totalFailed > 0) {
      console.log(`   ❌ Failed translations: ${totalFailed}`);
    }
    console.log(`${'='.repeat(60)}\n`);

    if (totalTranslated > 0) {
      console.log('🎉 Done! All translations have been created in Notion.');
    } else {
      console.log('✓ Nothing to do - all posts are already translated!');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack && process.env.DEBUG) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

console.log(`
🌍 Batch Translate All Posts

This will translate all Portuguese posts in your Notion database
that don't have translations yet.

Target languages: English, Spanish, French, Italian, Japanese

Press Ctrl+C to cancel, or wait 3 seconds to continue...
`);

// Give user time to cancel
setTimeout(() => {
  translateAllPosts();
}, 3000);
