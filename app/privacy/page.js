export const metadata = {
  title: 'プライバシーポリシー | 東海オンエア 動画バトル',
};

export default function PrivacyPage() {
  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: '40px 20px',
      color: '#ccc',
      fontFamily: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic Medium", sans-serif',
      lineHeight: '1.8',
      background: '#0e0e1a',
      minHeight: '100vh',
    }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '32px' }}>プライバシーポリシー</h1>

      <p style={{ marginBottom: '24px', fontSize: '14px' }}>
        このページでは、東海オンエア 動画バトルのプライバシーに関する取り扱いについてご説明します。
      </p>

      <Section title="広告について">
        このサイトでは Google AdSense を使って広告を表示しています。
        Google が興味に合わせた広告を出すために Cookie を使うことがあります。
        詳しくは
        <a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer" style={{ color: '#ffb840' }}>
          Google のポリシーと規約
        </a>
        をご覧ください。
      </Section>

      <Section title="アクセス解析について">
        サイトの改善のために Google Analytics でアクセス情報を収集しています。
        データはすべて匿名で、個人を特定することはありません。
        詳しくは
        <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank" rel="noopener noreferrer" style={{ color: '#ffb840' }}>
          Google Analytics 利用規約
        </a>
        をご覧ください。
      </Section>

      <Section title="Cookie について">
        広告表示やアクセス解析のために Cookie を使用しています。
        ブラウザの設定から Cookie をオフにすることもできますが、
        一部の機能が使えなくなることがあります。
      </Section>

      <Section title="免責事項">
        このサイトは東海オンエアの非公式ファンサイトです。
        動画データは YouTube の公開情報をもとにしています。
        サイトの利用によって生じたトラブルについて、運営者は責任を負いかねます。
      </Section>

      <Section title="お問い合わせ">
        ご質問やお問い合わせは、X（Twitter）のDMからどうぞ。
        <br />
        <a href="https://x.com/RankingQQQ" target="_blank" rel="noopener noreferrer" style={{ color: '#ffb840' }}>
          @RankingQQQ
        </a>
      </Section>

      <p style={{ marginTop: '40px', fontSize: '12px', color: '#666' }}>制定日：2026年3月17日</p>

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
