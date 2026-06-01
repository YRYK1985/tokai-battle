import { FILTERED_VIDEOS } from '../../lib/videos';
import Link from 'next/link';

export const metadata = {
  title: '東海オンエア 年間平均の2倍以上を記録した動画一覧 | 東海オンエア 動画バトル',
  description: '東海オンエアの動画を年別に分析し、その年の平均再生数の2倍以上を記録した動画を年ごとに一覧化しています。2013年から2026年まで対象。',
};

function formatMan(n) {
  return Math.floor(n / 10000).toLocaleString() + '万';
}

export default function RankingHitsPage() {
  const byYear = {};
  FILTERED_VIDEOS.forEach((v) => {
    if (!byYear[v.year]) byYear[v.year] = { total: 0, videos: [] };
    byYear[v.year].total += v.views;
    byYear[v.year].videos.push(v);
  });

  const years = Object.keys(byYear).sort((a, b) => b - a);

  const s = {
    page: { maxWidth: '700px', margin: '0 auto', padding: '40px 20px', color: '#ccc', fontFamily: '"Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic Medium",sans-serif', lineHeight: '1.8', background: 'linear-gradient(135deg,#141038,#1f1f4a,#2a2a4e)', minHeight: '100vh' },
    h1: { fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
    lead: { fontSize: '13px', color: '#aaa', marginBottom: '32px', lineHeight: 1.7 },
    yearBlock: { marginBottom: '36px', paddingBottom: '28px', borderBottom: '1px solid #2a2a4a' },
    h2: { fontSize: '15px', fontWeight: 700, color: '#ffb840', marginBottom: '4px' },
    meta: { fontSize: '12px', color: '#888', marginBottom: '10px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
    th: { padding: '6px 8px', borderBottom: '1px solid #333', color: '#ffb840', fontWeight: 700, textAlign: 'left' },
    thR: { padding: '6px 8px', borderBottom: '1px solid #333', color: '#ffb840', fontWeight: 700, textAlign: 'right' },
    td: { padding: '6px 8px', borderBottom: '1px solid #1e1e3a', color: '#bbb' },
    tdR: { padding: '6px 8px', borderBottom: '1px solid #1e1e3a', textAlign: 'right', color: '#fff', whiteSpace: 'nowrap' },
    tdX: { padding: '6px 8px', borderBottom: '1px solid #1e1e3a', textAlign: 'right', color: '#ffb840', whiteSpace: 'nowrap' },
    link: { color: '#bbb', textDecoration: 'none' },
    backLink: { color: '#ffb840', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '32px' },
  };

  return (
    <div style={s.page}>
      <h1 style={s.h1}>東海オンエア 年間平均の2倍以上を記録した動画一覧</h1>
      <p style={s.lead}>
        各年の全動画の平均再生数を算出し、その2倍以上の再生数を記録した動画を年ごとに一覧化しています。<br />
        対象：{FILTERED_VIDEOS.length.toLocaleString()}本（ショート・生配信・MV除外）。再生数はYouTube Data APIから定期取得。
      </p>

      {years.map((year) => {
        const d = byYear[year];
        const avg = d.total / d.videos.length;
        const hits = d.videos
          .filter((v) => v.views >= avg * 2)
          .sort((a, b) => b.views - a.views);
        if (hits.length === 0) return null;
        return (
          <div key={year} style={s.yearBlock}>
            <h2 style={s.h2}>{year}年</h2>
            <p style={s.meta}>
              年間平均再生数：{formatMan(avg)}回　／　該当動画：{hits.length}本　／　年間投稿総数：{d.videos.length}本
            </p>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>動画タイトル</th>
                  <th style={s.thR}>再生数</th>
                  <th style={s.thR}>平均比</th>
                </tr>
              </thead>
              <tbody>
                {hits.map((v) => (
                  <tr key={v.id}>
                    <td style={s.td}>
                      <Link href={`/video/${v.id}`} style={s.link}>
                        {v.title.length > 36 ? v.title.slice(0, 36) + '…' : v.title}
                      </Link>
                    </td>
                    <td style={s.tdR}>{formatMan(v.views)}回</td>
                    <td style={s.tdX}>{(v.views / avg).toFixed(1)}倍</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      <Link href="/" style={s.backLink}>← トップに戻る</Link>
    </div>
  );
}
