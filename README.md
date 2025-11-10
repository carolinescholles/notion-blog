# Notion Blog with AI Translation

A multilingual [Next.js](https://nextjs.org/) blog powered by [Notion's Public API](https://developers.notion.com) with automatic AI translation using Claude.

## Features

- **Notion as CMS**: Write and manage your blog content in Notion
- **Multilingual Support**: Built-in support for 6 languages (Portuguese, English, Spanish, French, Italian, Japanese)
- **AI-Powered Translation**: Automatically translate your Portuguese posts to 5 other languages using Claude API
- **Locale-based Routing**: Separate URLs for each language (`/en`, `/es`, `/fr`, `/it`, `/ja`, `/pt-BR`)
- **One-Command Translation**: Translate individual posts or your entire blog with a single command
- **Smart Duplicate Detection**: Automatically skips posts that are already translated

__Demo:__ [Your Netlify URL here]

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

### Deploy to Netlify

#### Option 1: Deploy via Netlify UI (Recommended)

1. **Push to GitHub**: Push your code to a GitHub repository
2. **Connect to Netlify**:
   - Log in to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Install the Next.js plugin (Netlify will prompt you)
4. **Add Environment Variables** (Settings → Environment Variables):
   - `NOTION_TOKEN` - Your Notion integration token
   - `NOTION_DATABASE_ID` - Your Notion database ID
   - `ANTHROPIC_API_KEY` - Your Anthropic API key
5. **Deploy**: Click "Deploy site"

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

#### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

### Automatic Deployments with GitHub Actions

This repository includes a GitHub Actions workflow for automatic deployment to Netlify.

**Setup GitHub Actions** (Settings → Secrets → Actions):

1. **NETLIFY_AUTH_TOKEN**
   - Go to Netlify → User Settings → Applications → Personal access tokens
   - Generate a new token and copy it

2. **NETLIFY_SITE_ID**
   - Go to your Netlify site → Site settings → General
   - Copy the "Site ID" (under Site information)

3. **NOTION_TOKEN** - Your Notion integration token

4. **NOTION_DATABASE_ID** - Your Notion database ID

5. **ANTHROPIC_API_KEY** - Your Anthropic API key

The workflow (`.github/workflows/deploy-netlify.yml`) will automatically deploy your site when you push to the `master` branch.

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