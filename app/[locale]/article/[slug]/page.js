import { Fragment } from 'react';
import Link from 'next/link';

import {
  getDatabase, getBlocks, getPageFromSlug,
} from '../../../../lib/notion';
import { getTranslations, locales } from '../../../../lib/i18n';
import Text from '../../../../components/text';
import { renderBlock } from '../../../../components/notion/renderer';
import styles from '../../../../styles/post.module.css';

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const allParams = [];

  for (const locale of locales) {
    const database = await getDatabase(locale);
    const params = database?.map((page) => {
      const slug = page.properties?.Slug?.rich_text?.[0]?.text?.content;
      return { locale, slug };
    });
    allParams.push(...params);
  }

  return allParams;
}

export async function generateMetadata({ params }) {
  const { slug, locale } = params;
  const page = await getPageFromSlug(slug, locale);

  if (!page || !page.properties) {
    return {
      title: 'Made in Brazil',
    };
  }

  const title = page.properties?.['Property Name']?.title?.[0]?.plain_text || 'Made in Brazil';
  const date = page.properties?.Date?.date?.start;
  const coverImage = page.properties?.Cover?.files?.[0];
  const imageUrl = coverImage?.file?.url || coverImage?.external?.url;

  return {
    title: `${title} | Made in Brazil`,
    description: `Leia ${title} - histórias e reflexões no blog Made in Brazil`,
    openGraph: {
      title: `${title} | Made in Brazil`,
      description: `Leia ${title} - histórias e reflexões no blog Made in Brazil`,
      type: 'article',
      publishedTime: date,
      locale: locale,
      images: imageUrl ? [{ url: imageUrl, alt: title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Made in Brazil`,
      description: `Leia ${title} - histórias e reflexões no blog Made in Brazil`,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function Page({ params }) {
  const { slug, locale } = params;
  const t = getTranslations(locale);
  const page = await getPageFromSlug(slug, locale);
  const blocks = await getBlocks(page?.id);
  const allPosts = await getDatabase(locale);

  if (!page || !blocks) {
    return <div />;
  }

  // Find current post index
  const currentIndex = allPosts.findIndex(post => post.id === page.id);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const pageTitle = page.properties?.['Property Name']?.title?.[0]?.plain_text;

  return (
    <article className={styles.container}>
        {page.properties?.Cover?.files?.[0] && (
          <div className={styles.coverImage}>
            <img
              src={page.properties.Cover.files[0].file?.url || page.properties.Cover.files[0].external?.url}
              alt={`Capa: ${pageTitle}`}
              loading="eager"
              fetchPriority="high"
              width="680"
              height="auto"
            />
          </div>
        )}
        <h1 className={styles.name}>
          <Text title={page.properties?.['Property Name']?.title} />
        </h1>
        {page.properties?.Date?.date?.start && (
          <time className={styles.date} dateTime={page.properties.Date.date.start}>
            {new Date(page.properties.Date.date.start).toLocaleString(locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        )}
        <section>
          {blocks.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}

          <nav className={styles.navigation} aria-label="Navegação entre artigos">
            {prevPost && (
              <Link
                href={`/${locale}/article/${prevPost.properties?.Slug?.rich_text?.[0]?.text?.content}`}
                className={styles.navLink}
                aria-label={`${t.previous}: ${prevPost.properties?.['Property Name']?.title?.[0]?.plain_text}`}
              >
                <span className={styles.navLabel} aria-hidden="true">{t.previous}</span>
                <span className={styles.navTitle}>
                  <Text title={prevPost.properties?.['Property Name']?.title} />
                </span>
              </Link>
            )}
            {nextPost && (
              <Link
                href={`/${locale}/article/${nextPost.properties?.Slug?.rich_text?.[0]?.text?.content}`}
                className={`${styles.navLink} ${styles.navLinkNext}`}
                aria-label={`${t.next}: ${nextPost.properties?.['Property Name']?.title?.[0]?.plain_text}`}
              >
                <span className={styles.navLabel} aria-hidden="true">{t.next}</span>
                <span className={styles.navTitle}>
                  <Text title={nextPost.properties?.['Property Name']?.title} />
                </span>
              </Link>
            )}
          </nav>

          <Link href={`/${locale}`} className={styles.back} aria-label={t.back}>
            {t.back}
          </Link>
        </section>
    </article>
  );
}

// export const getStaticPaths = async () => {
//   const database = await getDatabase(databaseId);
//   return {
//     paths: database.map((page) => {
//       const slug = page.properties.Slug?.formula?.string;
//       return ({ params: { id: page.id, slug } });
//     }),
//     fallback: true,
//   };
// };

// export const getStaticProps = async (context) => {
//   const { slug } = context.params;
//   const page = await getPage(id);
//   const blocks = await getBlocks(id);

//   return {
//     props: {
//       page,
//       blocks,
//     },
//     revalidate: 1,
//   };
// };
