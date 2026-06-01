import { FILTERED_VIDEOS } from '../../lib/videos';
import Link from 'next/link';

export const metadata = {
  title: '2018年が東海オンエアのチャンネル史上最高の年だったデータ的根拠 | 東海オンエア 動画バトル',
  description: '東海オンエアの2018年の動画データを詳細に分析。平均再生数783万回・1000万回超え動画74本・総再生数23.8億回など、数値の観点からチャンネルのピーク年を検証するデータ記事です。',
};

function formatMan(n) {
  if (n >= 100000000) return (Math.floor(n / 1000000) / 100).toFixed(2) + '億';
  return Math.floor(n / 10000).toLocaleString() + '万';
}

export default function Analysis2018Page() {
  const allVideos = FILTERED_VIDEOS;

  // 年別集計
  const byYear = {};
  allVideos.forEach((v) => {
    if (!byYear[v.year]) byYear[v.year] = { total: 0, count: 0, videos: [] };
    byYear[v.year].total += v.views;
    byYear[v.year].count++;
    byYear[v.year].videos.push(v);
  });

  const years = Object.keys(byYear).sort();
  const avgByYear = years.map((y) => ({
    year: y,
    avg: byYear[y].total / byYear[y].count,
    total: byYear[y].total,
    count: byYear[y].count,
    over10M: byYear[y].videos.filter((v) => v.views >= 10000000).length,
    over20M: byYear[y].videos.filter((v) => v.views >= 20000000).length,
  }));

  const v2018 = byYear[2018].videos;
  const top10_2018 = [...v2018].sort((a, b) => b.views - a.views).slice(0, 10);
  const avg2018 = byYear[2018].total / byYear[2018].count;

  const s = {
    page: { maxWidth: '700px', margin: '0 auto', padding: '40px 20px', color: '#ccc', fontFamily: '"Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic Medium",sans-serif', lineHeight: '1.8', background: 'linear-gradient(135deg,#141038,#1f1f4a,#2a2a4e)', minHeight: '100vh' },
    h1: { fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
    lead: { fontSize: '13px', color: '#aaa', marginBottom: '32px', lineHeight: 1.7 },
    section: { marginBottom: '36px', paddingBottom: '28px', borderBottom: '1px solid #2a2a4a' },
    h2: { fontSize: '16px', fontWeight: 700, color: '#ffb840', marginBottom: '12px' },
    body: { fontSize: '13px', color: '#ccc', lineHeight: 1.9, marginBottom: '12px' },
    highlight: { background: 'rgba(255,184,64,0.08)', borderLeft: '3px solid #ffb840', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', color: '#fff', marginBottom: '16px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '8px' },
    th: { padding: '6px 10px', borderBottom: '1px solid #333', color: '#ffb840', fontWeight: 700, textAlign: 'right' },
    thL: { padding: '6px 10px', borderBottom: '1px solid #333', color: '#ffb840', fontWeight: 700, textAlign: 'left' },
    td: { padding: '6px 10px', borderBottom: '1px solid #1e1e3a', textAlign: 'right', color: '#ccc' },
    tdL: { padding: '6px 10px', borderBottom: '1px solid #1e1e3a', textAlign: 'left', color: '#ccc' },
    tdHL: { padding: '6px 10px', borderBottom: '1px solid #1e1e3a', textAlign: 'right', color: '#ffb840', fontWeight: 700 },
    tdLHL: { padding: '6px 10px', borderBottom: '1px solid #1e1e3a', textAlign: 'left', color: '#ffb840', fontWeight: 700 },
    link: { color: '#bbb', textDecoration: 'none' },
    backLink: { color: '#ffb840', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '32px' },
  };

  return (
    <div style={s.page}>
      <h1 style={s.h1}>2018年が東海オンエアのチャンネル史上最高の年だったデータ的根拠</h1>
      <p style={s.lead}>
        東海オンエアの全{allVideos.length.toLocaleString()}本の動画データをもとに、2018年が平均再生数・総再生数・1000万回超え本数のいずれの指標においても他の年を上回ることを数値で示します。<br />
        対象：ショート動画・生配信アーカイブ・MV除外。再生数はYouTube Data APIから定期取得。
      </p>

      <div style={s.section}>
        <h2 style={s.h2}>① 年別 平均再生数の比較</h2>
        <p style={s.body}>
          2018年の平均再生数は783万回。全14年間（2013〜2026年）の中で最高値となっている。2位は2019年の719万回、3位は2020年の668万回。2018年以降は年を追うごとに低下傾向にあり、2026年（集計途中）は170万回となっている。
        </p>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.thL}>年</th>
              <th style={s.th}>投稿本数</th>
              <th style={s.th}>年間総再生数</th>
              <th style={s.th}>平均再生数</th>
              <th style={s.th}>1000万回超</th>
            </tr>
          </thead>
          <tbody>
            {avgByYear.map((d) => (
              <tr key={d.year}>
                <td style={d.year === '2018' ? s.tdLHL : s.tdL}>{d.year}年</td>
                <td style={d.year === '2018' ? s.tdHL : s.td}>{d.count}本</td>
                <td style={d.year === '2018' ? s.tdHL : s.td}>{formatMan(d.total)}回</td>
                <td style={d.year === '2018' ? s.tdHL : s.td}>{formatMan(d.avg)}回</td>
                <td style={d.year === '2018' ? s.tdHL : s.td}>{d.over10M}本</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>② 1000万回再生超えの本数</h2>
        <p style={s.body}>
          2018年に1000万回以上の再生数を記録した動画は74本。これは全年で最多の数値となっている。2000万回超えも7本あり、これも全年最多。チャンネル歴代再生数1位の「サバイバルしりとり晩御飯」（3892万回・2019年投稿）は2018年ではなく翌年の動画だが、再生数上位30本のうち13本が2018年投稿となっている。
        </p>
        <div style={s.highlight}>
          2018年：1000万回超え74本 ／ 2000万回超え7本<br />
          2019年：1000万回超え56本 ／ 2000万回超え3本<br />
          2017年：1000万回超え33本 ／ 2000万回超え1本
        </div>
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>③ 2018年 再生数上位10本</h2>
        <p style={s.body}>
          2018年投稿動画の再生数上位10本を以下に示す。上位2本はいずれも3000万回を超えており、10位の「現物しりとり」も1892万回を記録している。上位10本の平均は{formatMan(top10_2018.reduce((s, v) => s + v.views, 0) / 10)}回。
        </p>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.thL}>順位</th>
              <th style={s.thL}>動画タイトル</th>
              <th style={s.th}>再生数</th>
            </tr>
          </thead>
          <tbody>
            {top10_2018.map((v, i) => (
              <tr key={v.id}>
                <td style={{ ...s.tdL, width: '36px', color: '#ffb840', fontWeight: 700 }}>{i + 1}</td>
                <td style={s.tdL}>
                  <Link href={`/video/${v.id}`} style={s.link}>
                    {v.title.length > 38 ? v.title.slice(0, 38) + '…' : v.title}
                  </Link>
                </td>
                <td style={s.td}>{formatMan(v.views)}回</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={s.section}>
        <h2 style={s.h2}>④ 2018年の年間総再生数</h2>
        <p style={s.body}>
          2018年の年間総再生数は{formatMan(byYear[2018].total)}回で、全年中最高値。2位の2019年（{formatMan(byYear[2019].total)}回）を約2億2000万回上回っている。2018年の投稿本数は304本で、300本台の年の中で最も平均再生数が高い。
        </p>
        <p style={s.body}>
          チャンネル全体の累計再生数{formatMan(allVideos.reduce((s, v) => s + v.views, 0))}回のうち、2018年1年間だけで{(byYear[2018].total / allVideos.reduce((s, v) => s + v.views, 0) * 100).toFixed(1)}%を占めている。
        </p>
      </div>

      <Link href="/" style={s.backLink}>← トップに戻る</Link>
    </div>
  );
}
