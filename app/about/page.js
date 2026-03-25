export const metadata = {
  title: 'このサイトについて | 東海オンエア 動画バトル',
  description: '東海オンエア 動画バトルは、3000本以上の東海オンエア動画からファン投票でランキングを作るサイトです。仕組みや楽しみ方をご紹介します。',
};

export default function AboutPage() {
  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: '40px 20px',
      color: '#ccc',
      fontFamily: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic Medium", sans-serif',
      lineHeight: '1.8',
      background: 'linear-gradient(135deg,#0f0c29,#1a1a3e,#24243e)',
      minHeight: '100vh',
    }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '32px' }}>東海オンエア 動画バトルとは？</h1>

      <Section title="サイト概要">
        「東海オンエア 動画バトル」は、東海オンエアの全動画3,000本以上の中から、
        ファンの投票によってランキングを作る参加型サイトです。
        2本の動画が表示され、「どっちの動画が好き？」を選ぶだけのシンプルな仕組みです。
      </Section>

      <Section title="ランキングの仕組み（Eloレーティング）">
        このサイトでは、チェスや将棋のレーティングで使われている「Eloレーティングシステム」を採用しています。
        2つの動画が対戦し、選ばれた方のレーティングが上がり、選ばれなかった方が下がります。
        強い動画（高レーティング）に勝てば大きくポイントが上がり、弱い動画に勝ってもわずかしか上がらない仕組みです。
        これにより、単純な投票数ではなく、統計的に信頼性の高い順位が算出されます。
        投票数が増えるほど精度が上がり、本当にファンに支持されている動画が上位に来るようになっています。
      </Section>

      <Section title="楽しみ方">
        まずは5回投票してみてください。5回投票すると、全ユーザーの投票を集計した総合ランキングが表示されます。
        ランキングは「全期間」と「年度別」で切り替えることができます。
        投票結果はXでシェアすることもできます。
      </Section>

      <Section title="対象動画について">
        東海オンエアのメインチャンネルに投稿された通常動画が対象です。
        ショート動画（Shorts）、生放送アーカイブ、ミュージックビデオ（リサイタルズ）、
        グレーゾーン・エージェンシー、グレーゾーン・アイランドの動画は投票対象から除外しています。
        動画データ（再生回数・いいね数）はYouTube Data APIから定期的に取得し、最新の状態に更新しています。
      </Section>

      <Section title="運営について">
        このサイトは、東海オンエアの公認切り抜きチャンネル「東海ランキング」の
        運営者が個人で制作・運営しています。
        <br /><br />
        <a href="https://www.youtube.com/@TokaiRanking" target="_blank" rel="noopener noreferrer" style={{ color: '#ffb840' }}>
          東海ランキング YouTubeチャンネル
        </a>
        <br />
        <a href="https://x.com/RankingQQQ" target="_blank" rel="noopener noreferrer" style={{ color: '#ffb840' }}>
          X（Twitter）: @RankingQQQ
        </a>
      </Section>

      <Section title="よくある質問">
        <strong style={{ color: '#ddd' }}>Q. ランキングは個人のもの？全体のもの？</strong>
        <br />
        全ユーザーの投票を合算した総合ランキングです。あなたの投票も全体のランキングに反映されます。
        <br /><br />
        <strong style={{ color: '#ddd' }}>Q. 何回でも投票できる？</strong>
        <br />
        はい、何回でも投票できます。投票するほどランキングの精度が上がり、より正確な順位になります。いつも投票してくださる皆さん、ありがとうございます。
        <br /><br />
        <strong style={{ color: '#ddd' }}>Q. 再生回数が多い動画が有利？</strong>
        <br />
        いいえ。ランキングは純粋にファンの「どっちが好き？」の投票だけで決まります。
        再生回数やいいね数はランキング順位には影響しません。
      </Section>

      <p style={{ marginTop: '40px', fontSize: '12px', color: '#666' }}>最終更新：2026年3月25日</p>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <a href="/" style={{ color: '#ffb840', fontSize: '14px', textDecoration: 'none' }}>← トップに戻る</a>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{title}</h2>
      <p style={{ fontSize: '14px', margin: 0 }}>{children}</p>
    </div>
  );
}
