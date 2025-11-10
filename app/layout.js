import '../styles/globals.css';

export const metadata = {
  title: {
    default: 'Made in Brazil - Histórias e reflexões',
    template: '%s | Made in Brazil',
  },
  description: 'Blog pessoal com histórias e reflexões sobre a vida, cultura e experiências no Brasil',
  metadataBase: new URL('https://madeinbrazil.com'),
  keywords: ['blog', 'histórias', 'reflexões', 'brasil', 'made in brazil', 'cultura brasileira', 'experiências'],
  authors: [{ name: 'Made in Brazil' }],
  creator: 'Made in Brazil',
  publisher: 'Made in Brazil',
  openGraph: {
    title: 'Made in Brazil - Histórias e reflexões',
    description: 'Blog pessoal com histórias e reflexões sobre a vida, cultura e experiências no Brasil',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Made in Brazil',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Made in Brazil - Histórias e reflexões',
    description: 'Blog pessoal com histórias e reflexões sobre a vida, cultura e experiências no Brasil',
    creator: '@madeinbrazil',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://madeinbrazil.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
