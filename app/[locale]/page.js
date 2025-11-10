import Link from 'next/link';
import { getDatabase } from '../../lib/notion';
import { getTranslations } from '../../lib/i18n';
import Text from '../../components/text';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import styles from './index.module.css';

export const databaseId = process.env?.NOTION_DATABASE_ID ?? 'NOTION_DATABASE_ID';

export async function generateMetadata({ params }) {
  const { locale } = params;
  const t = getTranslations(locale);

  return {
    title: `Made in Brazil - ${t.subtitle}`,
    description: `Blog pessoal com histórias e reflexões sobre a vida, cultura e experiências no Brasil`,
    openGraph: {
      title: `Made in Brazil - ${t.subtitle}`,
      description: `Blog pessoal com histórias e reflexões sobre a vida, cultura e experiências no Brasil`,
      locale: locale,
    },
  };
}

async function getPosts(locale) {
  const database = await getDatabase(locale);
  return database;
}

export default async function Page({ params }) {
  const { locale } = params;
  const t = getTranslations(locale);
  const posts = await getPosts(locale);
  return (
    <div>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logo}>
            MADE IN BRAZIL
          </h1>
          <p className={styles.subtitle}>
            {t.subtitle}
          </p>
          <LanguageSwitcher currentLocale={locale} />
        </header>

        <h2 className={styles.heading}>{t.chapters}</h2>
        <ol className={styles.posts} role="list">
          {posts.map((post) => {
            const dateValue = post.properties?.Date?.date?.start;
            const date = dateValue ? new Date(dateValue).toLocaleString(
              locale,
              {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              },
            ) : '';
            const slug = post.properties?.Slug?.rich_text?.[0]?.text?.content;
            return (
              <li key={post.id} className={styles.post}>
                <article>
                  <h3 className={styles.postTitle}>
                    <Link href={`/${locale}/article/${slug}`} aria-label={`${t.readMore}: ${post.properties?.['Property Name']?.title?.[0]?.plain_text}`}>
                      <Text title={post.properties?.['Property Name']?.title} />
                    </Link>
                  </h3>

                  <time className={styles.postDescription} dateTime={dateValue}>{date}</time>
                  <Link href={`/${locale}/article/${slug}`} aria-label={`${t.readMore} ${post.properties?.['Property Name']?.title?.[0]?.plain_text}`}>{t.readMore}</Link>
                </article>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
