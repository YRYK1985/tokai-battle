export const metadata = {
  title: '東海オンエア 動画バトル',
  description: '東海オンエアの動画3000本以上から、好きな動画を選んで投票！あなたの推し動画ランキングを作ろう',
  openGraph: {
    title: '東海オンエア 動画バトル',
    description: '3000本以上の東海オンエア動画から好きな方を選んで投票しよう！',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '東海オンエア 動画バトル',
    description: '3000本以上の東海オンエア動画から好きな方を選んで投票しよう！',
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
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700;900&display=swap" rel="stylesheet" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9862215132601373" crossOrigin="anonymous"></script>
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
