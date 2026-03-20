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
        東海オンエア 動画バトル（以下「本サイト」）は、以下のとおりプライバシーポリシーを定めます。
      </p>

      <Section title="広告について">
        本サイトでは、Google AdSense による広告配信を行っています。
        Google はユーザーの興味に応じた広告を表示するために Cookie を使用することがあります。
        Google による Cookie の使用については、
        <a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer" style={{ color: '#ffb840' }}>
          Google のポリシーと規約
        </a>
        をご参照ください。
      </Section>

      <Section title="アクセス解析について">
        本サイトでは、Google Analytics を利用してアクセス情報を収集しています。
        このデータは匿名で収集されており、個人を特定するものではありません。
        Google Analytics の利用規約については、
        <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank" rel="noopener noreferrer" style={{ color: '#ffb840' }}>
          Google Analytics 利用規約
        </a>
        をご参照ください。
      </Section>

      <Section title="Cookie について">
        本サイトでは、広告配信やアクセス解析のために Cookie を使用しています。
        ブラウザの設定により Cookie の受け入れを拒否することも可能ですが、
        その場合は本サイトの一部機能が利用できなくなる場合があります。
      </Section>

      <Section title="免責事項">
        本サイトは東海オンエアの非公式ファンサイトです。
        掲載している動画データは YouTube Data API を通じて取得した公開情報に基づいています。
        本サイトの利用により生じた損害について、運営者は一切の責任を負いません。
      </Section>

      <Section title="お問い合わせ">
        本サイトに関するお問い合わせは、東海ランキング の YouTube チャンネルまたは X（Twitter）のDMよりお願いいたします。
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
