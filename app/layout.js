export const metadata = {
  title: '東海オンエア 動画バトル',
  description: '東海オンエアの動画3,000本以上から、好きな動画を選んで投票！あなたの推し動画ランキングを作ろう',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: '東海オンエア 動画バトル',
    description: '3000本以上の東海オンエア動画から好きな方を選んで投票しよう！',
    type: 'website',
    images: [{ url: 'https://tokairanking.com/ogp.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '東海オンエア 動画バトル',
    description: '3000本以上の東海オンエア動画から好きな方を選んで投票しよう！',
    images: ['https://tokairanking.com/ogp.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@500;800&display=swap" rel="stylesheet" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9862215132601373" crossOrigin="anonymous"></script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2L1ZYVZQ3C"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2L1ZYVZQ3C');
        `}} />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
