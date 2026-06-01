import { FILTERED_VIDEOS } from '../../lib/videos';
import Link from 'next/link';

export const metadata = {
  title: '東海オンエア 再生数ランキング TOP30 | 東海オンエア 動画バトル',
  description: '東海オンエアの全動画3,000本以上の中から、YouTube再生数の多い動画TOP30を掲載しています。2013年から2026年までの全動画が対象です。',
};

function formatViews(n) {
  if (n >= 100000000) return (Math.floor(n / 1000000) / 100).toFixed(2) + '億';
  if (n >= 10000) return Math.floor(n / 10000) + '万';
  return n.toLocaleString();
}

export default function RankingViewsPage() {
  const top30 = [...FILTERED_VIDEOS]
    .sort((a, b) => b.views - a.views)
    .slice(0, 30);

  const style = {
    page: {
      maxWidth: '700px',
      margin: '0 auto',
      padding: '40px 20px',
      color: '#ccc',
      fontFamily: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic Medium", sans-serif',
      lineHeight: '1.8',
      background: 'linear-gradient(135deg,#141038,#1f1f4a,#2a2a4e)',
      minHeight: '100vh',
    },
    h1: { fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
    note: { fontSize: '13px', color: '#aaa', marginBottom: '32px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: { textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid #333', color: '#ffb840', fontWeight: 700 },
    tdRank: { padding: '10px 10px', borderBottom: '1px solid #222', color: '#ffb840', fontWeight: 700, width: '36px' },
    tdTitle: { padding: '10px 10px', borderBottom: '1px solid #222' },
    tdViews: { padding: '10px 10px', borderBottom: '1px solid #222', textAlign: 'right', whiteSpace: 'nowrap', color: '#fff' },
    tdYear: { padding: '10px 10px', borderBottom: '1px solid #222', textAlign: 'right', whiteSpace: 'nowrap', color: '#888', width: '52px' },
    link: { color: '#ccc', textDecoration: 'none' },
    backLink: { color: '#ffb840', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '32px' },
  };

  return (
    <div style={style.page}>
      <h1 style={style.h1}>東海オンエア 再生数ランキング TOP30</h1>
      <p style={style.note}>
        対象：東海オンエア メインチャンネルの通常動画（{FILTERED_VIDEOS.length.toLocaleString()}本）<br />
        除外：ショート動画・生配信アーカイブ・MV<br />
        再生数はYouTube Data APIから定期取得。
      </p>

      <table style={style.table}>
        <thead>
          <tr>
            <th style={style.th}>順位</th>
            <th style={style.th}>動画タイトル</th>
            <th style={{ ...style.th, textAlign: 'right' }}>再生数</th>
            <th style={{ ...style.th, textAlign: 'right' }}>投稿年</th>
          </tr>
        </thead>
        <tbody>
          {top30.map((v, i) => (
            <tr key={v.id}>
              <td style={style.tdRank}>{i + 1}</td>
              <td style={style.tdTitle}>
                <Link href={`/video/${v.id}`} style={style.link}>{v.title}</Link>
              </td>
              <td style={style.tdViews}>{formatViews(v.views)}回</td>
              <td style={style.tdYear}>{v.year}年</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link href="/" style={style.backLink}>← トップに戻る</Link>
    </div>
  );
}
