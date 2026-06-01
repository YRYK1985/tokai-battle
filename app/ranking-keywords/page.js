import { FILTERED_VIDEOS } from '../../lib/videos';
import Link from 'next/link';

export const metadata = {
  title: '東海オンエア タイトルキーワード別 再生数データ | 東海オンエア 動画バトル',
  description: '東海オンエアの動画タイトルに含まれるキーワード別に、動画本数・平均再生数・最多再生数を集計したデータ一覧です。「対決」「料理」「帰れません」など10種類のキーワードを対象としています。',
};

function formatMan(n) {
  return Math.floor(n / 10000).toLocaleString() + '万';
}

const KEYWORDS = [
  { key: 'じゃんけん', label: 'じゃんけん' },
  { key: '料理', label: '料理' },
  { key: '食べ', label: '食べ系' },
  { key: '対決', label: '対決' },
  { key: '罰ゲーム', label: '罰ゲーム' },
  { key: '帰れません', label: '帰れません' },
  { key: '旅', label: '旅' },
  { key: 'ドッキリ', label: 'ドッキリ' },
  { key: 'ランキング', label: 'ランキング' },
  { key: '勝', label: '勝負系' },
];

export default function RankingKeywordsPage() {
  const results = KEYWORDS.map(({ key, label }) => {
    const matched = FILTERED_VIDEOS.filter((v) => v.title.includes(key));
    if (matched.length === 0) return null;
    const totalViews = matched.reduce((s, v) => s + v.views, 0);
    const avg = totalViews / matched.length;
    const sorted = [...matched].sort((a, b) => b.views - a.views);
    return { label, key, count: matched.length, avg, totalViews, top5: sorted.slice(0, 5) };
  }).filter(Boolean).sort((a, b) => b.avg - a.avg);

  const s = {
    page: { maxWidth: '700px', margin: '0 auto', padding: '40px 20px', color: '#ccc', fontFamily: '"Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic Medium",sans-serif', lineHeight: '1.8', background: 'linear-gradient(135deg,#141038,#1f1f4a,#2a2a4e)', minHeight: '100vh' },
    h1: { fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
    lead: { fontSize: '13px', color: '#aaa', marginBottom: '24px', lineHeight: 1.7 },
    note: { fontSize: '12px', color: '#666', marginBottom: '32px', lineHeight: 1.6 },
    summaryTable: { width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '40px' },
    th: { padding: '7px 10px', borderBottom: '1px solid #333', color: '#ffb840', fontWeight: 700, textAlign: 'left' },
    thR: { padding: '7px 10px', borderBottom: '1px solid #333', color: '#ffb840', fontWeight: 700, textAlign: 'right' },
    td: { padding: '7px 10px', borderBottom: '1px solid #1e1e3a', color: '#fff', fontWeight: 700 },
    tdR: { padding: '7px 10px', borderBottom: '1px solid #1e1e3a', textAlign: 'right', color: '#ccc' },
    kwBlock: { marginBottom: '36px', paddingBottom: '28px', borderBottom: '1px solid #2a2a4a' },
    h2: { fontSize: '15px', fontWeight: 700, color: '#ffb840', marginBottom: '4px' },
    meta: { fontSize: '12px', color: '#888', marginBottom: '10px' },
    topTable: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
    tdTop: { padding: '5px 8px', borderBottom: '1px solid #1e1e3a', color: '#bbb' },
    tdTopR: { padding: '5px 8px', borderBottom: '1px solid #1e1e3a', textAlign: 'right', color: '#fff', whiteSpace: 'nowrap' },
    link: { color: '#bbb', textDecoration: 'none' },
    backLink: { color: '#ffb840', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '32px' },
  };

  return (
    <div style={s.page}>
      <h1 style={s.h1}>東海オンエア タイトルキーワード別 再生数データ</h1>
      <p style={s.lead}>
        動画タイトルに含まれるキーワードごとに、動画本数・平均再生数・最多再生数を集計しています。<br />
        対象：{FILTERED_VIDEOS.length.toLocaleString()}本（ショート・生配信・MV除外）。キーワードはタイトルの部分一致で集計。
      </p>
      <p style={s.note}>
        ※ 1本の動画が複数のキーワードに該当する場合、それぞれのキーワードにカウントされます。<br />
        ※ 平均再生数の高い順に並べています。
      </p>

      <table style={s.summaryTable}>
        <thead>
          <tr>
            <th style={s.th}>キーワード</th>
            <th style={s.thR}>動画本数</th>
            <th style={s.thR}>平均再生数</th>
            <th style={s.thR}>最多再生数</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.key}>
              <td style={s.td}>「{r.label}」</td>
              <td style={s.tdR}>{r.count}本</td>
              <td style={s.tdR}>{formatMan(r.avg)}回</td>
              <td style={s.tdR}>{formatMan(r.top5[0].views)}回</td>
            </tr>
          ))}
        </tbody>
      </table>

      {results.map((r) => (
        <div key={r.key} style={s.kwBlock}>
          <h2 style={s.h2}>「{r.label}」を含む動画（{r.count}本）</h2>
          <p style={s.meta}>
            平均再生数：{formatMan(r.avg)}回　／　合計再生数：{formatMan(r.totalViews)}回
          </p>
          <table style={s.topTable}>
            <thead>
              <tr>
                <th style={{ ...s.th, fontSize: '11px' }}>再生数上位5本</th>
                <th style={{ ...s.thR, fontSize: '11px' }}>再生数</th>
              </tr>
            </thead>
            <tbody>
              {r.top5.map((v) => (
                <tr key={v.id}>
                  <td style={s.tdTop}>
                    <Link href={`/video/${v.id}`} style={s.link}>
                      {v.title.length > 38 ? v.title.slice(0, 38) + '…' : v.title}
                    </Link>
                  </td>
                  <td style={s.tdTopR}>{formatMan(v.views)}回</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <Link href="/" style={s.backLink}>← トップに戻る</Link>
    </div>
  );
}
