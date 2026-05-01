export const metadata = {
  title: 'お問い合わせ | 東海オンエア 動画バトル',
  description: '東海オンエア 動画バトルへのご意見・ご要望・不具合報告はこちらからどうぞ。',
};

export default function ContactPage() {
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
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '32px' }}>お問い合わせ</h1>

      <p style={{ fontSize: '14px', marginBottom: '32px' }}>
        「東海オンエア 動画バトル」へのご意見・ご要望・不具合のご報告などは、以下の方法でご連絡ください。
      </p>

      <Section title="X（Twitter）でのお問い合わせ">
        最も迅速に対応できる方法です。DMまたはリプライでお気軽にどうぞ。
        <br /><br />
        <a href="https://x.com/RankingQQQ" target="_blank" rel="noopener noreferrer" style={{ color: '#ffb840', fontWeight: 700 }}>
          X: @RankingQQQ →
        </a>
      </Section>

<Section title="対応について">
        いただいたご意見はサイト改善の参考にさせていただきます。内容によっては返信できない場合もございますが、ご了承ください。
        本サイトは東海オンエアの公式サイトではありません。
      </Section>

      <p style={{ marginTop: '40px', fontSize: '12px', color: '#666' }}>最終更新：2026年4月7日</p>

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
