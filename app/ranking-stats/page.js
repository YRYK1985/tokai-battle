import { FILTERED_VIDEOS } from '../../lib/videos';
import Link from 'next/link';

export const metadata = {
  title: '東海オンエア 年別動画データ一覧 | 東海オンエア 動画バトル',
  description: '東海オンエアの2013年〜2026年における年別の投稿本数・総再生数・平均再生数をまとめたデータページです。',
};

function formatMan(n) {
  return Math.floor(n / 10000).toLocaleString() + '万';
}

export default function RankingStatsPage() {
  const byYear = {};
  FILTERED_VIDEOS.forEach((v) => {
    if (!byYear[v.year]) byYear[v.year] = { count: 0, totalViews: 0, topVideo: null };
    byYear[v.year].count++;
    byYear[v.year].totalViews += v.views;
    if (!byYear[v.year].topVideo || v.views > byYear[v.year].topVideo.views) {
      byYear[v.year].topVideo = v;
    }
  });

  const years = Object.keys(byYear).sort((a, b) => b - a);
  const totalViews = FILTERED_VIDEOS.reduce((s, v) => s + v.views, 0);

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
    note: { fontSize: '13px', color: '#aaa', marginBottom: '8px' },
    total: { fontSize: '14px', color: '#fff', marginBottom: '32px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: { textAlign: 'right', padding: '8px 10px', borderBottom: '1px solid #333', color: '#ffb840', fontWeight: 700 },
    thLeft: { textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid #333', color: '#ffb840', fontWeight: 700 },
    td: { padding: '10px 10px', borderBottom: '1px solid #222', textAlign: 'right', color: '#fff' },
    tdLeft: { padding: '10px 10px', borderBottom: '1px solid #222', textAlign: 'left', color: '#ffb840', fontWeight: 700 },
    tdTop: { padding: '10px 10px', borderBottom: '1px solid #222', fontSize: '12px', color: '#aaa' },
    link: { color: '#aaa', textDecoration: 'none' },
    backLink: { color: '#ffb840', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '32px' },
  };

  return (
    <div style={style.page}>
      <h1 style={style.h1}>東海オンエア 年別動画データ一覧</h1>
      <p style={style.note}>
        対象：東海オンエア メインチャンネルの通常動画（{FILTERED_VIDEOS.length.toLocaleString()}本）<br />
        除外：ショート動画・生配信アーカイブ・MV
      </p>
      <p style={style.total}>
        総再生数：{Math.floor(totalViews / 100000000 * 10) / 10}億回 ／ 総動画数：{FILTERED_VIDEOS.length.toLocaleString()}本
      </p>

      <table style={style.table}>
        <thead>
          <tr>
            <th style={style.thLeft}>年</th>
            <th style={style.th}>投稿本数</th>
            <th style={style.th}>総再生数</th>
            <th style={style.th}>平均再生数</th>
            <th style={{ ...style.thLeft }}>年間最多再生</th>
          </tr>
        </thead>
        <tbody>
          {years.map((year) => {
            const d = byYear[year];
            const avg = Math.floor(d.totalViews / d.count);
            return (
              <tr key={year}>
                <td style={style.tdLeft}>{year}年</td>
                <td style={style.td}>{d.count}本</td>
                <td style={style.td}>{formatMan(d.totalViews)}回</td>
                <td style={style.td}>{formatMan(avg)}回</td>
                <td style={style.tdTop}>
                  <Link href={`/video/${d.topVideo.id}`} style={style.link}>
                    {d.topVideo.title.length > 25 ? d.topVideo.title.slice(0, 25) + '…' : d.topVideo.title}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Link href="/" style={style.backLink}>← トップに戻る</Link>
    </div>
  );
}
