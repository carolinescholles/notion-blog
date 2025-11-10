# Notion Blog with AI Translation

A multilingual [Next.js](https://nextjs.org/) blog powered by [Notion's Public API](https://developers.notion.com) with automatic AI translation using Claude.

## Features

- **Notion as CMS**: Write and manage your blog content in Notion
- **Multilingual Support**: Built-in support for 6 languages (Portuguese, English, Spanish, French, Italian, Japanese)
- **AI-Powered Translation**: Automatically translate your Portuguese posts to 5 other languages using Claude API
- **Locale-based Routing**: Separate URLs for each language (`/en`, `/es`, `/fr`, `/it`, `/ja`, `/pt-BR`)
- **One-Command Translation**: Translate individual posts or your entire blog with a single command
- **Smart Duplicate Detection**: Automatically skips posts that are already translated

__Demo:__ [https://notion-blog-nextjs-coral.vercel.app](https://notion-blog-nextjs-coral.vercel.app)

__Original Documentation:__ [https://samuelkraft.com/blog/building-a-notion-blog-with-public-api](https://samuelkraft.com/blog/building-a-notion-blog-with-public-api)

## Quick Start

### 1. Set Up Notion

Follow Notion's [getting started guide](https://developers.notion.com/docs/getting-started) to:
1. Create a Notion integration
2. Get your `NOTION_TOKEN`
3. Create a database and get your `NOTION_DATABASE_ID`
4. Share your database with the integration

**Required Notion Database Properties:**
- **Property Name** (Title): Post title
- **Slug** (Rich Text): URL slug
- **Date** (Date): Publication date
- **Locale** (Select): Language - options: `pt-BR`, `en`, `es`, `fr`, `it`, `ja`
- **Published** (Checkbox): Publication status
- **Cover** (File): Cover image (optional)

Reference Notion table: https://www.notion.so/5b53abc87b284beab0c169c9fb695b4d?v=e4ed5b1a8f2e4e12b6d1ef68fa66e518

### 2. Get Anthropic API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key (starts with `sk-ant-`)

### 3. Configure Environment

Create a `.env.local` file in the project root:

```bash
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_database_id
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 4. Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your blog.

## Translation Usage

### Translate a Single Post

```bash
npm run translate <notion-page-url-or-id>
```

**Examples:**
```bash
# Using full Notion URL
npm run translate https://www.notion.so/My-Post-abc123...

# Using just the page ID
npm run translate abc123def456...
```

**What happens:**
1. Fetches your Portuguese post from Notion
2. Translates title and content to English, Spanish, French, Italian, and Japanese
3. Creates 5 new Notion pages (one per language)
4. All translations share the same slug but have different `Locale` values

### Translate All Posts

```bash
npm run translate-all
```

Automatically translates all published Portuguese posts that don't have translations yet.

## Translation System

### How It Works

1. **Write in Portuguese**: Create your blog post in Notion with `Locale` set to `pt-BR`
2. **Run Translation**: Execute `npm run translate <page-url>`
3. **AI Translation**: Claude translates your content while preserving:
   - Tone and style
   - Formatting and structure
   - Brand names, URLs, and code snippets
4. **Notion Integration**: Creates new pages in your Notion database
5. **Automatic Publishing**: Translations appear on your blog immediately

### Cost

Using Claude Haiku (fast & affordable):
- ~$0.0023 per translation
- ~$0.0115 per post (5 translations)
- 100 posts = ~$1.15

### Supported Content Types

**Fully Translated:**
- Paragraphs
- Headings (H1, H2, H3)
- Bulleted and numbered lists
- Quotes and callouts
- Toggle blocks

**Preserved (not translated):**
- Images and videos
- Code blocks
- Embeds and bookmarks
- Brand names and URLs

## Project Structure

```
notion-blog/
├── app/
│   ├── [locale]/           # Locale-based routing
│   ├── article/[slug]/     # Blog post pages
│   └── page.js             # Homepage
├── lib/
│   ├── notion.js           # Notion API integration
│   ├── translator.js       # AI translation logic
│   └── notion-writer.js    # Write translations to Notion
├── scripts/
│   ├── translate-post.js   # CLI: translate single post
│   └── translate-all.js    # CLI: batch translate all posts
└── TRANSLATION-GUIDE.md    # Detailed translation docs
```

## Key Files

- **[lib/translator.js](lib/translator.js)**: Claude API integration with retry logic and JSON parsing
- **[lib/notion-writer.js](lib/notion-writer.js)**: Creates translated pages and blocks in Notion
- **[scripts/translate-post.js](scripts/translate-post.js)**: Command-line tool for translating posts
- **[TRANSLATION-GUIDE.md](TRANSLATION-GUIDE.md)**: Complete translation system documentation

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fsamuelkraft%2Fnotion-blog-nextjs&env=NOTION_TOKEN,NOTION_DATABASE_ID,ANTHROPIC_API_KEY&envDescription=Add%20your%20Notion%20and%20Anthropic%20API%20credentials&envLink=https%3A%2F%2Fdevelopers.notion.com%2Fdocs%2Fgetting-started&project-name=notion-blog-nextjs&repo-name=notion-blog-nextjs&demo-title=Notion%20Blog%20with%20AI%20Translation&demo-description=Multilingual%20Next.js%20blog%20powered%20by%20Notion%20with%20AI%20translation)

**Environment Variables Required:**
- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`
- `ANTHROPIC_API_KEY`

### GitHub Actions

Deployment workflows are located under `.github/workflows/` in this repository.

To use the actions, rename them to remove the `.txt` extensions, then add these GitHub Action Secrets (Settings → Secrets → Actions):
1. **ORG_ID** - Vercel account ID found in account Settings
2. **PROJECT_ID** - Vercel project ID found in project Settings
3. **VERCEL_TOKEN** - Vercel token created in Settings → Tokens
4. **GH_TOKEN** - GitHub token (optional)

## Troubleshooting

### Translation Issues

If translations fail:
1. Check your `ANTHROPIC_API_KEY` is valid
2. Ensure Notion database has correct property names (case-sensitive)
3. Verify the post has `Locale` set to `pt-BR`
4. See [TRANSLATION-GUIDE.md](TRANSLATION-GUIDE.md) for detailed troubleshooting

### Common Errors

**"Could not find property with name or id: Locale"**
- Notion property name is case-sensitive - use `Locale` not `locale`

**"Could not extract page ID"**
- Use full Notion URL or clean page ID (32-character hex)

**Rate limiting**
- If translating many posts, Claude API may rate limit
- Wait a few minutes and run again (already-translated posts are skipped)

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT

## Credits

- Original blog template by [Samuel Kraft](https://github.com/samuelkraft)
- AI translation powered by [Anthropic Claude](https://www.anthropic.com)