export const metadata = {
  title: 'このサイトについて | 東海オンエア 動画バトル',
  description: '東海オンエア 動画バトルは、3000本以上の東海オンエア動画からファン投票でランキングを作るサイトです。EloレーティングシステムやKファクターの仕組み、楽しみ方をご紹介します。',
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
      background: 'linear-gradient(135deg,#141038,#1f1f4a,#2a2a4e)',
      minHeight: '100vh',
    }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '32px' }}>東海オンエア 動画バトルとは？</h1>

      <Section title="サイト概要">
        「東海オンエア 動画バトル」は、東海オンエアの全動画3,000本以上の中から、ファンの投票によってランキングを作る参加型サイトです。
        2本の動画が表示され、「どっちの動画が好き？」を選ぶだけのシンプルな仕組みです。
        世界中の東海オンエアファンが参加しており、投票が積み重なるほど順位の精度が高まります。
        「あの伝説の動画は今何位？」「最近の動画で人気なのは？」といった疑問をランキングで確かめてみてください。
      </Section>

      <Section title="楽しみ方">
        まずは5回投票してみてください。5回投票すると、全ユーザーの投票を集計した総合ランキングが表示されます。
        ランキングは「全期間」と「年度別（2016年〜）」で切り替えることができ、時代ごとの人気動画を比較するのも楽しめます。
        また、各動画のタイトルをクリックすると個別の動画ページに移動でき、再生数・いいね数・現在のEloレーティングなどの詳細情報を確認できます。
        投票結果はXでシェアすることもできるので、ぜひ友達と盛り上がってみてください。
      </Section>

      <Section title="ランキングの仕組み（Eloレーティング）">
        このサイトでは、チェスや将棋のレーティングで使われている「Eloレーティングシステム」を採用しています。
        全動画は初期レーティング1200からスタートし、対戦のたびに勝者のレーティングが上がり、敗者のレーティングが下がります。
        高レーティングの動画に勝てば大きくポイントが上昇し、低レーティングの動画に勝ってもわずかしか上がらない仕組みです（Kファクター=32）。
        これにより、単純な投票数ではなく「どんな相手に勝ったか」を考慮した、統計的に信頼性の高い順位が算出されます。
        投票数が積み重なるほど精度が上がり、本当にファンに支持されている動画が上位に来るようになっています。
      </Section>

      <Section title="対象動画について">
        東海オンエアのメインチャンネルに投稿された通常動画が対象です。
        ショート動画（Shorts）、生放送アーカイブ、ミュージックビデオ（リサイタルズ）、
        グレーゾーン・エージェンシー、グレーゾーン・アイランドの動画は投票対象から除外しています。
        また、初回投票・2回目投票では再生数1,000万回以上・400万回以上の動画を優先的に表示するロジックを採用しており、
        まず代表的な人気動画から投票を始められるようになっています。
        動画データ（再生回数・いいね数）はYouTube Data APIから定期的に取得し、最新の状態に更新しています。
      </Section>

      <Section title="よくある質問">
        <strong style={{ color: '#fff' }}>Q. 何回でも投票できますか？</strong><br />
        はい、何回でも投票できます。投票するたびにランキングが更新されます。<br /><br />
        <strong style={{ color: '#fff' }}>Q. 同じ動画が何度も出てきます</strong><br />
        ランダムに2本を選んでいるため、同じ組み合わせが出ることがあります。「この組み合わせをスキップ」ボタンで別の組み合わせに変えられます。<br /><br />
        <strong style={{ color: '#fff' }}>Q. ランキングはリアルタイムで変わりますか？</strong><br />
        はい。投票のたびにリアルタイムでEloレーティングが更新され、ランキングに反映されます。
      </Section>

      <Section title="運営について">
        このサイトは、東海オンエアの公認切り抜きチャンネル「東海ランキング」の
        運営者が個人で制作・運営しています。東海オンエアの公式とは関係ありません。
        <br /><br />
        <a href="https://www.youtube.com/@TokaiRanking" target="_blank" rel="noopener noreferrer" style={{ color: '#ffb840' }}>
          東海ランキング YouTubeチャンネル
        </a>
        <br />
        <a href="https://x.com/RankingQQQ" target="_blank" rel="noopener noreferrer" style={{ color: '#ffb840' }}>
          X（Twitter）: @RankingQQQ
        </a>
      </Section>

      <p style={{ marginTop: '40px', fontSize: '12px', color: '#666' }}>最終更新：2026年4月6日</p>

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
