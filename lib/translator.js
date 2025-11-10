import Anthropic from '@anthropic-ai/sdk';

// Create Anthropic client lazily to ensure env vars are loaded
let anthropic;
function getAnthropicClient() {
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

const languageNames = {
  'en': 'English',
  'es': 'Spanish (Español)',
  'fr': 'French (Français)',
  'it': 'Italian (Italiano)',
  'ja': 'Japanese (日本語)',
  'pt-BR': 'Brazilian Portuguese (Português Brasileiro)',
};

/**
 * Extract plain text from Notion blocks for translation
 */
function extractTextFromBlocks(blocks) {
  const textContent = [];

  for (const block of blocks) {
    const type = block.type;
    const value = block[type];

    if (!value) continue;

    // Handle blocks with rich_text
    if (value.rich_text && value.rich_text.length > 0) {
      const text = value.rich_text.map(t => t.plain_text || t.text?.content || '').join('');
      if (text.trim()) {
        textContent.push({
          type,
          text,
          blockId: block.id,
        });
      }
    }

    // Handle nested blocks (like bulleted/numbered lists, toggles)
    if (value.children && value.children.length > 0) {
      const nestedText = extractTextFromBlocks(value.children);
      textContent.push(...nestedText);
    }

    // Handle callouts
    if (type === 'callout' && value.rich_text) {
      const text = value.rich_text.map(t => t.plain_text || '').join('');
      if (text.trim()) {
        textContent.push({
          type: 'callout',
          text,
          blockId: block.id,
        });
      }
    }

    // Handle quotes
    if (type === 'quote' && value.rich_text) {
      const text = value.rich_text.map(t => t.plain_text || '').join('');
      if (text.trim()) {
        textContent.push({
          type: 'quote',
          text,
          blockId: block.id,
        });
      }
    }
  }

  return textContent;
}

/**
 * Attempt to extract JSON from Claude's response, even if wrapped in text
 */
function extractJSON(text) {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch (e) {
    // If that fails, try to find JSON in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        throw new Error(`Could not parse JSON from response: ${e2.message}`);
      }
    }
    throw new Error(`No JSON found in response: ${text.substring(0, 200)}...`);
  }
}

/**
 * Translate content using Claude API with retry logic
 */
export async function translateContent(title, blocks, targetLocale, retryCount = 0) {
  if (targetLocale === 'pt-BR') {
    return { title, blocks };
  }

  const textBlocks = extractTextFromBlocks(blocks);
  const targetLanguage = languageNames[targetLocale] || targetLocale;

  console.log(`  Translating ${textBlocks.length} text blocks to ${targetLanguage}...`);

  // Prepare content for translation
  const contentToTranslate = {
    title,
    blocks: textBlocks.map((block, index) => ({
      index,
      type: block.type,
      text: block.text,
    })),
  };

  const maxRetries = 3;

  try {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 4096,
      temperature: 0.3,
      messages: [{
        role: "user",
        content: `You are a professional translator. Translate the following blog post from Brazilian Portuguese to ${targetLanguage}.

CRITICAL: Your response must be ONLY a valid JSON object. Do not include any explanation, markdown formatting, or text before or after the JSON.

TRANSLATION RULES:
- Maintain the same tone, style, and formality level
- Keep the same formatting and structure
- Preserve special characters properly (use Unicode escape sequences if needed)
- DO NOT translate:
  * Brand names
  * Product names
  * URLs
  * Code snippets
  * Proper nouns (names of people, places, organizations)

Original content:
${JSON.stringify(contentToTranslate, null, 2)}

REQUIRED RESPONSE FORMAT (valid JSON only):
{
  "title": "translated title here",
  "blocks": [
    {
      "index": 0,
      "type": "paragraph",
      "text": "translated text here"
    }
  ]
}

Remember: Return ONLY the JSON object, nothing else.`
      }]
    });

    const responseText = response.content[0].text.trim();

    // Try to extract and parse JSON
    const translatedContent = extractJSON(responseText);

    // Validate response structure
    if (!translatedContent.title || !Array.isArray(translatedContent.blocks)) {
      throw new Error('Invalid translation response structure');
    }

    return {
      title: translatedContent.title,
      blocks: textBlocks.map((original, index) => {
        const translated = translatedContent.blocks.find(b => b.index === index);
        return {
          ...original,
          translatedText: translated ? translated.text : original.text,
        };
      }),
    };

  } catch (error) {
    // Retry logic for JSON parsing errors
    if (retryCount < maxRetries && (error.message.includes('JSON') || error.message.includes('parse'))) {
      console.log(`  ⚠️  JSON parsing failed, retrying (${retryCount + 1}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return translateContent(title, blocks, targetLocale, retryCount + 1);
    }

    console.error(`  Error translating to ${targetLanguage}:`, error.message);
    throw error;
  }
}

/**
 * Apply translations to Notion blocks structure
 */
export function applyTranslationsToBlocks(blocks, translations) {
  let translationIndex = 0;

  function processBlock(block) {
    const type = block.type;
    const value = block[type];

    if (!value) return block;

    let updatedBlock = { ...block };

    // Apply translation to rich_text fields
    if (value.rich_text && value.rich_text.length > 0) {
      const translation = translations[translationIndex];
      if (translation && translation.translatedText) {
        updatedBlock[type] = {
          ...value,
          rich_text: [{
            type: 'text',
            text: { content: translation.translatedText },
            annotations: value.rich_text[0]?.annotations || {},
            plain_text: translation.translatedText,
          }],
        };
        translationIndex++;
      }
    }

    // Process nested blocks recursively
    if (value.children && value.children.length > 0) {
      updatedBlock[type] = {
        ...value,
        children: value.children.map(child => processBlock(child)),
      };
    }

    return updatedBlock;
  }

  return blocks.map(block => processBlock(block));
}

export { languageNames };
