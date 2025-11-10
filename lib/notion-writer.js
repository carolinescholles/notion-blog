import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

/**
 * Create a new Notion page with translated content
 */
export async function createTranslatedPage(databaseId, originalPage, translatedTitle, targetLocale) {
  const properties = originalPage.properties;

  // Build new page properties
  const newProperties = {
    'Property Name': {
      title: [{
        type: 'text',
        text: { content: translatedTitle },
      }],
    },
    Slug: properties.Slug,
    Date: properties.Date,
    Locale: {
      select: { name: targetLocale },
    },
    Published: {
      checkbox: true,
    },
  };

  // Copy cover image if exists
  if (properties.Cover && properties.Cover.files && properties.Cover.files.length > 0) {
    newProperties.Cover = properties.Cover;
  }

  try {
    const newPage = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: newProperties,
    });

    return newPage;
  } catch (error) {
    console.error('  Error creating Notion page:', error.message);
    throw error;
  }
}

/**
 * Convert Notion block to creation format
 */
function blockToCreationFormat(block, translatedText = null) {
  const type = block.type;
  const value = block[type];

  if (!value) return null;

  // Base block object
  const newBlock = {
    object: 'block',
    type,
  };

  // Handle different block types
  switch (type) {
    case 'paragraph':
    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
    case 'bulleted_list_item':
    case 'numbered_list_item':
    case 'quote':
    case 'callout':
    case 'toggle':
      newBlock[type] = {
        rich_text: translatedText ? [{
          type: 'text',
          text: { content: translatedText },
        }] : value.rich_text || [],
      };

      // Preserve callout icon and color
      if (type === 'callout') {
        newBlock[type].icon = value.icon || { type: 'emoji', emoji: '💡' };
        newBlock[type].color = value.color || 'gray_background';
      }

      // Preserve toggle color
      if (type === 'toggle') {
        newBlock[type].color = value.color;
      }
      break;

    case 'code':
      newBlock[type] = {
        rich_text: translatedText ? [{
          type: 'text',
          text: { content: translatedText },
        }] : value.rich_text || [],
        language: value.language || 'plain text',
      };
      break;

    case 'image':
    case 'video':
    case 'file':
    case 'pdf':
      // Copy file/external URL
      if (value.type === 'file') {
        newBlock[type] = {
          type: 'file',
          file: { url: value.file.url },
        };
      } else if (value.type === 'external') {
        newBlock[type] = {
          type: 'external',
          external: { url: value.external.url },
        };
      }

      // Copy caption if exists
      if (value.caption && value.caption.length > 0) {
        newBlock[type].caption = value.caption;
      }
      break;

    case 'bookmark':
    case 'embed':
    case 'link_preview':
      newBlock[type] = {
        url: value.url,
      };
      break;

    case 'divider':
      newBlock[type] = {};
      break;

    case 'table_of_contents':
      newBlock[type] = {
        color: value.color || 'default',
      };
      break;

    default:
      // For unsupported block types, try to preserve structure
      newBlock[type] = value;
  }

  return newBlock;
}

/**
 * Create Notion blocks with translated content
 */
export async function createNotionBlocks(pageId, blocks, translations) {
  const blocksToCreate = [];
  let translationIndex = 0;

  for (const block of blocks) {
    // Get translated text if available
    const translation = translations[translationIndex];
    const translatedText = translation?.translatedText;

    // Convert block to creation format
    const newBlock = blockToCreationFormat(block, translatedText);

    if (newBlock) {
      blocksToCreate.push(newBlock);

      // Only increment if this block had translatable text
      if (block[block.type]?.rich_text && block[block.type].rich_text.length > 0) {
        translationIndex++;
      }
    }
  }

  // Notion API allows max 100 blocks per request
  const batchSize = 100;
  for (let i = 0; i < blocksToCreate.length; i += batchSize) {
    const batch = blocksToCreate.slice(i, i + batchSize);

    try {
      await notion.blocks.children.append({
        block_id: pageId,
        children: batch,
      });
    } catch (error) {
      console.error(`  Error creating blocks (batch ${Math.floor(i / batchSize) + 1}):`, error.message);
      throw error;
    }
  }

  return blocksToCreate.length;
}

/**
 * Check if translations already exist for a post
 */
export async function checkTranslationsExist(databaseId, slug, targetLocales) {
  const existing = {};

  for (const locale of targetLocales) {
    try {
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            {
              property: 'Slug',
              rich_text: { equals: slug },
            },
            {
              property: 'Locale',
              select: { equals: locale },
            },
          ],
        },
      });

      existing[locale] = response.results.length > 0;
    } catch (error) {
      console.error(`  Error checking ${locale} translation:`, error.message);
      existing[locale] = false;
    }
  }

  return existing;
}

export { notion };
