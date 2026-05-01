import TokaiVote from '../components/TokaiVote';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '東海オンエア 動画バトル',
  url: 'https://tokairanking.com',
  description: '東海オンエアの動画3,000本以上をファン投票でランキング。Eloレーティングシステムで統計的に信頼性の高い順位を算出。東海オンエア公認切り抜きチャンネル「東海ランキング」が運営。',
  publisher: {
    '@type': 'Organization',
    name: '東海ランキング',
    url: 'https://www.youtube.com/@tokairanking',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TokaiVote />
    </>
  );
}
