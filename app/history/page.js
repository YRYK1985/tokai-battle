import { FILTERED_VIDEOS } from '../../lib/videos';
import Link from 'next/link';

export const metadata = {
  title: '東海オンエア 年別チャンネルデータ 2013〜2026 | 東海オンエア 動画バトル',
  description: '東海オンエアの2013年から2026年までの年別投稿本数・総再生数・平均再生数・年間最多再生動画をまとめたデータ記事です。チャンネルの規模の推移を数字で確認できます。',
};

function formatMan(n) {
  if (n >= 100000000) return (Math.floor(n / 1000000) / 100).toFixed(2) + '億';
  return Math.floor(n / 10000).toLocaleString() + '万';
}

const YEAR_DATA = [
  {
    year: 2013,
    count: 22,
    totalViews: 23350000,
    avgViews: 1060000,
    top: [
      { title: '「パンティパンティゲーム」友達と超盛り上がるゲームを紹介！！', views: 3230000 },
      { title: '鼻からミルクティーを一気飲み', views: 2560000 },
      { title: '手作りイカダで川下り！第一弾　プロローグ編【全四弾】', views: 2280000 },
    ],
    note: 'チャンネル開設初年度。投稿本数22本、平均再生数は106万回。',
  },
  {
    year: 2014,
    count: 141,
    totalViews: 305630000,
    avgViews: 2160000,
    top: [
      { title: '【おっぱいゲーム】友達と超盛り上がるゲームを紹介！！', views: 13670000 },
      { title: '【衝撃映像】喉に詰まったモチを掃除機で吸い出し救出する瞬間', views: 8280000 },
      { title: '全身緑でプリクラを撮ったら人は消えるのか！？', views: 8230000 },
    ],
    note: '投稿本数が141本に増加。前年比で約6倍の本数となった。',
  },
  {
    year: 2015,
    count: 157,
    totalViews: 409660000,
    avgViews: 2600000,
    top: [
      { title: '口に牛乳を含んでヒカキンさんの動画見てみた', views: 26630000 },
      { title: '【包丁いらず】車の窓で料理してみた', views: 12150000 },
      { title: '【挑戦】755gの絶品ハンバーグを作れ！【オフ会告知】', views: 9810000 },
    ],
    note: '年間最多再生が2663万回に。平均再生数は260万回。',
  },
  {
    year: 2016,
    count: 237,
    totalViews: 838960000,
    avgViews: 3530000,
    top: [
      { title: '新競技「1500m牛丼」で世界新記録達成！！', views: 23590000 },
      { title: '【配分逆病】全ての配分を逆にしてしまう男たち', views: 16660000 },
      { title: '【ドッキリ】てつやが事務所をクビになったらフィッシャーズはUUUMに誘ってくれるの？', views: 13800000 },
    ],
    note: '投稿本数が237本と大幅増加。総再生数が8億回を超えた。',
  },
  {
    year: 2017,
    count: 294,
    totalViews: 1687210000,
    avgViews: 5730000,
    top: [
      { title: '【めちゃむずい】想像だけでコーラ作り対決！！', views: 25090000 },
      { title: '【宅配vs手作り料理】スピード対決でまさかの結果に！！！', views: 19410000 },
      { title: '【第一回】東海オンエア、モノマネ王決定戦！！！', views: 18430000 },
    ],
    note: '年間総再生数が初めて10億回を超え、16億8000万回に達した。平均再生数573万回。',
  },
  {
    year: 2018,
    count: 304,
    totalViews: 2382680000,
    avgViews: 7830000,
    top: [
      { title: '【大長編】今までに生まれた大量の｢ボツ動画｣を供養します', views: 36390000 },
      { title: '【ゼロからの仕込み】ガチンコ！！ラーメン作り対決！！！！！', views: 33370000 },
      { title: '【山奥のリゾート】２泊３日！寝たら"即帰宅"の旅！Part１', views: 22420000 },
    ],
    note: '年間総再生数23億8000万回。平均再生数783万回はチャンネル史上最高値。年間最多再生の「ボツ動画供養」は3639万回。',
  },
  {
    year: 2019,
    count: 300,
    totalViews: 2157790000,
    avgViews: 7190000,
    top: [
      { title: '【じゃんけんが全て】第１回 サバイバルしりとり晩御飯！', views: 38920000 },
      { title: '【じゃんけんが全て】岡崎市内のラーメンを一日中食べ続けたら何店舗行けるの！？', views: 36300000 },
      { title: '【史上最恐】｢なんでもあり｣のカードを使って罰ゲームを回避せよ！', views: 20130000 },
    ],
    note: '「サバイバルしりとり晩御飯」が3892万回を記録し、チャンネル歴代最多再生動画となっている。年間総再生数は21億5000万回。',
  },
  {
    year: 2020,
    count: 301,
    totalViews: 2013200000,
    avgViews: 6680000,
    top: [
      { title: '【遅刻撲滅運動】撮影日の朝に時間を一切見ずに行動したら逆に遅刻しないんじゃね？？？', views: 25870000 },
      { title: '【ペペロン】猛練習したてつしばの料理VS練習なしのりょうの料理', views: 21430000 },
      { title: '【食えなきゃ負け】相手を満腹にしろ！ご飯食べ食べポーカー！！！前編', views: 21070000 },
    ],
    note: '年間総再生数20億1000万回。301本を投稿し平均6680000回を記録した。',
  },
  {
    year: 2021,
    count: 301,
    totalViews: 1837390000,
    avgViews: 6100000,
    top: [
      { title: '【超計画的】1日の予定を毎時間ダーツで決めたら効率よく生活できるはず！ 前編', views: 24790000 },
      { title: '【過去最長素材】好きなことだったら何時間続けられるの？', views: 22350000 },
      { title: '【成金】東海オンエアが１ヶ月ガチで節約したら生活費はいくらになるの！？', views: 20990000 },
    ],
    note: '年間総再生数18億3000万回。平均再生数は610万回。',
  },
  {
    year: 2022,
    count: 307,
    totalViews: 1490140000,
    avgViews: 4850000,
    top: [
      { title: '【千円台は注文禁止】1万円企画と大食い企画を融合させた、新しい「成功するまで終われない」を思いついたのでやってみたら・・・', views: 19130000 },
      { title: '食べ物を注文して、メンバーと被らなかったら食えー！！！！！', views: 18550000 },
      { title: '結局、焼肉としゃぶしゃぶどっちが多く食べれるん？？', views: 15550000 },
    ],
    note: '年間総再生数14億9000万回。投稿本数307本は年間最多タイ。平均再生数は485万回。',
  },
  {
    year: 2023,
    count: 243,
    totalViews: 1058480000,
    avgViews: 4350000,
    top: [
      { title: '【災害】食べ物を注文して、ゆめまると被らなかったら食えー！！！！！！', views: 16950000 },
      { title: '【最長23回戦】負けたら飲め！！選んだお酒の産地の面積が大きい方が勝ち！！！', views: 12130000 },
      { title: '【偉業王】『凄いこと×100回』で一番凄かった奴の勝ち対決！！！', views: 11980000 },
    ],
    note: '年間総再生数10億5000万回。投稿本数が243本に減少。平均再生数は435万回。',
  },
  {
    year: 2024,
    count: 179,
    totalViews: 615780000,
    avgViews: 3440000,
    top: [
      { title: '【料理】素人3人で100品作る挑戦は何時間かかるの??', views: 13110000 },
      { title: '【しばゆー復活記念】10年に1度の奇跡！一泊二日寝てもいい「普通の旅」', views: 12190000 },
      { title: '【勝者は１人】相手を満腹にしろ！ご飯食べ食べチンチロ！！！', views: 11010000 },
    ],
    note: '年間投稿本数179本。総再生数は6億1000万回、平均344万回。',
  },
  {
    year: 2025,
    count: 224,
    totalViews: 557880000,
    avgViews: 2490000,
    top: [
      { title: '【俺たち最強だから】１人10kg、４人で合計40kgの大食いをします。', views: 8740000 },
      { title: '市販のお菓子10個再現できるまで帰れまてん！！！', views: 8610000 },
      { title: '【２対１】貧弱男２人が団結してバケモノ男の得意競技で圧勝します！', views: 5640000 },
    ],
    note: '年間総再生数5億5000万回。投稿本数224本、平均再生数249万回。',
  },
  {
    year: 2026,
    count: 73,
    totalViews: 124390000,
    avgViews: 1700000,
    top: [
      { title: '【伝説】崩したら全部食え！！食べ食べタワーバトル！！！', views: 3790000 },
      { title: 'ゴルフ未経験が打ちっぱなし１万球打ったらどこまで上手くなる？', views: 2900000 },
      { title: '3分の砂時計で24時間を計ろう！でもって誤差を調べよう！', views: 2880000 },
    ],
    note: '2026年のデータは集計途中（データ取得時点）。',
  },
];

export default function HistoryPage() {
  const totalVideos = FILTERED_VIDEOS.length;
  const totalViews = FILTERED_VIDEOS.reduce((s, v) => s + v.views, 0);

  const s = {
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
    lead: { fontSize: '13px', color: '#aaa', marginBottom: '8px', lineHeight: 1.7 },
    summary: { fontSize: '13px', color: '#fff', marginBottom: '32px', padding: '12px 16px', background: 'rgba(255,184,64,0.08)', borderRadius: '8px', borderLeft: '3px solid #ffb840' },
    yearBlock: { marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid #2a2a4a' },
    h2: { fontSize: '16px', fontWeight: 700, color: '#ffb840', marginBottom: '4px' },
    meta: { fontSize: '12px', color: '#888', marginBottom: '10px' },
    note: { fontSize: '13px', color: '#ccc', marginBottom: '10px', lineHeight: 1.8 },
    topLabel: { fontSize: '12px', color: '#ffb840', marginBottom: '4px', marginTop: '10px' },
    topList: { listStyle: 'none', padding: 0, margin: 0 },
    topItem: { fontSize: '12px', color: '#aaa', padding: '4px 0', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', gap: 8 },
    topViews: { color: '#fff', whiteSpace: 'nowrap', flexShrink: 0 },
    backLink: { color: '#ffb840', fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '32px' },
  };

  return (
    <div style={s.page}>
      <h1 style={s.h1}>東海オンエア 年別チャンネルデータ 2013〜2026</h1>
      <p style={s.lead}>
        東海オンエア メインチャンネルの通常動画（{totalVideos.toLocaleString()}本）を対象に、年別の投稿本数・総再生数・平均再生数・年間再生数上位3本を掲載しています。<br />
        除外対象：ショート動画・生配信アーカイブ・MV。再生数はYouTube Data APIから定期取得。
      </p>
      <div style={s.summary}>
        チャンネル累計再生数：{formatMan(totalViews)}回　／　累計動画数：{totalVideos.toLocaleString()}本
      </div>

      {YEAR_DATA.map((d) => (
        <div key={d.year} style={s.yearBlock}>
          <h2 style={s.h2}>{d.year}年</h2>
          <p style={s.meta}>
            投稿本数：{d.count}本　／　年間総再生数：{formatMan(d.totalViews)}回　／　平均再生数：{formatMan(d.avgViews)}回
          </p>
          <p style={s.note}>{d.note}</p>
          <p style={s.topLabel}>年間再生数 上位3本</p>
          <ul style={s.topList}>
            {d.top.map((v, i) => (
              <li key={i} style={s.topItem}>
                <span>{i + 1}. {v.title.length > 38 ? v.title.slice(0, 38) + '…' : v.title}</span>
                <span style={s.topViews}>{formatMan(v.views)}回</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <Link href="/" style={s.backLink}>← トップに戻る</Link>
    </div>
  );
}
