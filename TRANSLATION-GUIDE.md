# AI Translation Guide

This blog now supports automatic AI-powered translation using Claude!

## Setup

### 1. Get an Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### 2. Add API Key to Environment

Add this to your `.env.local` file:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## Usage

### Translate a Single Post

```bash
npm run translate <notion-page-url-or-id>
```

**Examples:**
```bash
# Using full Notion URL
npm run translate https://www.notion.so/My-Article-abc123def456...

# Using just the page ID
npm run translate abc123def456...
```

**What it does:**
1. Fetches your Portuguese post from Notion
2. Translates title and content to English, Spanish, French, Italian, and Japanese
3. Creates 5 new Notion pages (one per language)
4. Each page has:
   - Same slug as original
   - Same date
   - Same cover image
   - Translated title and content
   - Locale set appropriately (en, es, fr, it, ja)
   - Published = true

**Output:**
```
📄 Fetching original post...

✓ Found: "Minha Primeira História"
  Slug: minha-primeira-historia
  Locale: pt-BR
  Blocks: 15

🔍 Checking for existing translations...
  🌍 Will translate to: en, es, fr, it

🌐 Translating to en...
  Translating 15 text blocks to English...
  ✓ Translation complete
  📝 Creating Notion page...
  ✓ Page created: abc123...
  📦 Adding 15 blocks...
  ✅ Success! Created en version with 15 blocks

[... same for es, fr, it ...]

📊 Translation Summary:
   ✅ Successful: 4
```

### Translate All Posts

```bash
npm run translate-all
```

**What it does:**
- Finds all published Portuguese posts (Locale = pt-BR)
- Checks which translations are missing
- Translates only the missing ones
- Skips posts that are already fully translated

**Perfect for:**
- Initial setup (translate your entire blog at once)
- Catching up after adding several posts manually

### Cost

**Per post:**
- ~1,500 tokens input + ~1,500 tokens output
- Claude Haiku pricing: ~$0.0023 per translation
- 5 translations per post = ~$0.0115 per post

**Example costs:**
- 10 posts: ~$0.12
- 50 posts: ~$0.58
- 100 posts: ~$1.15

## Workflow

### Publishing a New Blog Post

1. Write your post in Notion (Portuguese)
2. Set these properties:
   - **Property Name** (title): Your post title
   - **Slug**: URL-friendly slug
   - **Date**: Publication date
   - **Locale**: `pt-BR`
   - **Published**: `true`
   - **Cover** (optional): Cover image
3. Copy the page URL
4. Run: `npm run translate <page-url>`
5. Wait ~15-20 seconds
6. Done! Your post now exists in 6 languages

### Editing Translations

**Option 1: Edit in Notion**
1. Find the translated page in Notion (same slug, different Locale)
2. Edit directly in Notion
3. Changes appear immediately on your blog

**Option 2: Re-translate**
1. Delete the translated versions in Notion
2. Run `npm run translate <page-url>` again
3. Fresh AI translations will be created

## How It Works

### Files Created

- `lib/translator.js` - AI translation logic using Claude
- `lib/notion-writer.js` - Creates Notion pages and blocks
- `scripts/translate-post.js` - CLI to translate single post
- `scripts/translate-all.js` - Batch translate all posts

### No Blog Code Changes!

Your existing blog code (`lib/notion.js`, `app/[locale]/page.js`, etc.) works exactly as before. The blog already filters by Locale, so translated posts appear automatically.

### Translation Quality

The system uses Claude Haiku (fast, cheap, high-quality) and is instructed to:
- Maintain the same tone and style
- Keep the same formatting
- Not translate brand names, URLs, code snippets, or proper nouns
- Return translations in the same structure as the original

### Supported Block Types

✅ **Fully Supported:**
- Paragraphs
- Headings (H1, H2, H3)
- Bulleted lists
- Numbered lists
- Quotes
- Callouts
- Toggle blocks
- Code blocks
- Dividers
- Table of contents

✅ **Preserved (not translated):**
- Images
- Videos
- Files
- Embeds
- Bookmarks

## Troubleshooting

### Error: "Could not find property with name or id: locale"

Make sure your Notion database has a "Locale" property (Select type) with options: `pt-BR`, `en`, `es`, `fr`, `it`, `ja`

### Error: "Could not extract page ID"

Make sure you're using:
- Full Notion URL, OR
- Just the page ID (32-character hex string)

### Translations not appearing on blog

1. Check the Locale is set correctly in Notion
2. Make sure Published = true
3. Verify the slug matches the original post
4. Try rebuilding: `npm run build`

### Rate limiting

If translating many posts, Claude API may rate limit. The script handles this automatically by waiting between requests. If you hit limits:
- Wait a few minutes
- Run `npm run translate-all` again (it skips already-translated posts)

## Tips

1. **Test first**: Try translating one post before batch-translating
2. **Review translations**: AI is good but not perfect - review important posts
3. **Edit in Notion**: You can improve any translation directly in Notion
4. **Consistent slugs**: Use the same slug for all language versions
5. **Cover images**: Cover images are automatically copied to all versions

## Support

If you encounter issues:
1. Check that all environment variables are set
2. Verify your Notion database has the correct properties
3. Make sure your Notion integration has write access
4. Check the error message for clues

Happy translating! 🌍
