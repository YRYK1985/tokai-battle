export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#110e30,#1b1b42,#262646)',
      color: '#fff',
      fontFamily: 'system-ui,sans-serif',
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* ヘッダーナビ */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', fontSize: '13px' }}>
          <span style={{ color: '#555' }}>← 投票に戻る</span>
          <span style={{ color: '#555' }}>🏆 ランキングに戻る</span>
        </div>

        {/* サムネイル スケルトン */}
        <div style={{
          borderRadius: '12px', marginBottom: '20px',
          background: 'rgba(255,255,255,0.06)', aspectRatio: '16/9',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />

        {/* タイトル スケルトン */}
        <div style={{
          height: '24px', width: '75%', borderRadius: '6px',
          background: 'rgba(255,255,255,0.08)', marginBottom: '12px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        <div style={{
          height: '14px', width: '30%', borderRadius: '4px',
          background: 'rgba(255,255,255,0.05)', marginBottom: '24px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />

        {/* YouTubeボタン スケルトン */}
        <div style={{
          height: '40px', width: '180px', borderRadius: '8px',
          background: 'rgba(255,255,255,0.06)', marginBottom: '28px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />

        {/* ランキングデータ スケルトン */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: '16px',
          padding: '24px', marginBottom: '24px',
        }}>
          <div style={{
            height: '18px', width: '140px', borderRadius: '4px',
            background: 'rgba(255,255,255,0.08)', marginBottom: '16px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.06)', borderRadius: '10px',
                padding: '14px 16px', height: '60px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
            ))}
          </div>
        </div>

        {/* 動画情報 スケルトン */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: '16px',
          padding: '24px', marginBottom: '24px',
        }}>
          <div style={{
            height: '18px', width: '100px', borderRadius: '4px',
            background: 'rgba(255,255,255,0.08)', marginBottom: '16px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.06)', borderRadius: '10px',
                padding: '14px 16px', height: '60px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
            ))}
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}} />
      </div>
    </div>
  );
}
