import { FILTERED_VIDEOS } from '../../../lib/videos';
import { kv } from '@vercel/kv';
import Link from 'next/link';

// ISR: 60秒ごとに再生成
export const revalidate = 60;

// ビルド時に静的生成しない（オンデマンド生成 + ISRキャッシュ）
// 初回アクセス時に生成 → 60秒キャッシュ → Vercelの無料枠でもビルド時間を節約
export const dynamicParams = true;

// サイトマップ用に全パスを定義（ただし実際のページ生成はオンデマンド）
export async function generateStaticParams() {
  // ビルド時間を節約するため空配列を返す
  // ページはアクセス時にオンデマンド生成される
  return [];
}

// 動的メタデータ
export async function generateMetadata({ params }) {
  const { id } = await params;
  const video = FILTERED_VIDEOS.find((v) => v.id === id);
  if (!video) {
    return { title: '動画が見つかりません | 東海オンエア 動画バトル' };
  }
  return {
    title: `${video.title} | 東海オンエア 動画バトル`,
    description: `「${video.title}」（${video.year}年）のファン投票ランキング・Eloレーティング情報。再生回数${formatNum(video.views)}回。東海オンエアの全${FILTERED_VIDEOS.length.toLocaleString()}本の動画をファン投票で順位付けするランキングサイト。`,
    openGraph: {
      title: `${video.title} | 東海オンエア 動画バトル`,
      description: `「${video.title}」のEloレーティングとランキング順位`,
      images: [`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`],
    },
  };
}

function formatNum(n) {
  if (n >= 100000000) return Math.floor(n / 100000000) + '億';
  if (n >= 10000) return Math.floor(n / 10000) + '万';
  return n.toLocaleString();
}

export default async function VideoPage({ params }) {
  const { id } = await params;
  const video = FILTERED_VIDEOS.find((v) => v.id === id);

  if (!video) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29,#1a1a3e,#24243e)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>動画が見つかりません</h1>
          <Link href="/" style={{ color: '#ffb840' }}>← トップに戻る</Link>
        </div>
      </div>
    );
  }

  // Redisからレーティング・勝敗データを取得
  let ratings = {};
  let matchCount = 0;
  let wins = {};
  let matches = {};
  try {
    const [ratingsData, matchCountData, winsData, matchesData] = await Promise.all([
      kv.hgetall('ratings'),
      kv.get('matchCount'),
      kv.hgetall('wins'),
      kv.hgetall('matches'),
    ]);
    ratings = ratingsData || {};
    matchCount = matchCountData ?? 0;
    wins = winsData || {};
    matches = matchesData || {};
  } catch (e) {
    console.error('Failed to fetch ratings:', e);
  }

  const elo = ratings[video.id] || 1200;
  const videoWins = wins[video.id] || 0;
  const videoMatches = matches[video.id] || 0;
  const winRate = videoMatches >= 10 ? Math.round(videoWins / videoMatches * 100) : null;

  // 全体ランキング計算
  const allRanked = FILTERED_VIDEOS
    .map((v) => ({ ...v, elo: ratings[v.id] || 1200 }))
    .sort((a, b) => b.elo - a.elo || b.views - a.views);
  const overallRank = allRanked.findIndex((v) => v.id === video.id) + 1;

  // 年度別ランキング計算
  const yearVideos = FILTERED_VIDEOS.filter((v) => v.year === video.year);
  const yearRanked = yearVideos
    .map((v) => ({ ...v, elo: ratings[v.id] || 1200 }))
    .sort((a, b) => b.elo - a.elo || b.views - a.views);
  const yearRank = yearRanked.findIndex((v) => v.id === video.id) + 1;

  // 再生数ランキング計算（全体）
  const viewsRanked = [...FILTERED_VIDEOS].sort((a, b) => b.views - a.views);
  const viewsRank = viewsRanked.findIndex((v) => v.id === video.id) + 1;

  // 再生数ランキング計算（年度別）
  const yearViewsRanked = [...yearVideos].sort((a, b) => b.views - a.views);
  const yearViewsRank = yearViewsRanked.findIndex((v) => v.id === video.id) + 1;

  // 前後の動画（全体ランキング基準）
  const prevVideo = overallRank > 1 ? allRanked[overallRank - 2] : null;
  const nextVideo = overallRank < allRanked.length ? allRanked[overallRank] : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0f0c29,#1a1a3e,#24243e)',
      color: '#ccc',
      fontFamily: '"Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic Medium",system-ui,sans-serif',
      lineHeight: '1.8',
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* ヘッダーナビ */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', fontSize: '13px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>← 投票に戻る</Link>
          <Link href="/about" style={{ color: '#888', textDecoration: 'none' }}>このサイトについて</Link>
        </div>

        {/* サムネイル */}
        <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', background: '#1a1a2e' }}>
          <img
            src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
            alt={video.title}
            style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
          />
        </div>

        {/* タイトル */}
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: '0 0 8px', lineHeight: '1.5' }}>
          {video.title}
        </h1>

        {/* 年度 */}
        <p style={{ fontSize: '13px', color: '#888', margin: '0 0 24px' }}>
          {video.year}年公開
        </p>

        {/* YouTube リンク */}
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', background: '#FF0000', borderRadius: '8px',
            color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600,
            marginBottom: '28px',
          }}
        >
          <svg width="20" height="14" viewBox="0 0 28 20" fill="none"><rect width="28" height="20" rx="4" fill="#fff" fillOpacity="0.2"/><polygon points="11,4 11,16 21,10" fill="#fff"/></svg>
          YouTubeで視聴する
        </a>

        {/* ランキングデータ */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: '16px',
          padding: '24px', marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>
            ランキングデータ
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <DataCard label="Eloレーティング" value={String(elo)} />
            <DataCard
              label="勝率"
              value={winRate !== null ? `${winRate}%` : '-'}
            />
            <DataCard
              label="全体ランキング"
              value={`${overallRank}位`}
            />
            <DataCard
              label={`${video.year}年ランキング`}
              value={`${yearRank}位`}
            />
          </div>
        </div>

        {/* 動画情報 */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: '16px',
          padding: '24px', marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>
            動画情報
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <DataCard label="再生回数" value={formatNum(video.views)} sub="回" />
            <DataCard label="高評価数" value={formatNum(video.likes)} />
            <DataCard
              label="再生数ランキング"
              value={`${viewsRank}位`}
            />
            <DataCard
              label={`${video.year}年 再生数ランキング`}
              value={`${yearViewsRank}位`}
            />
          </div>
        </div>

        {/* 広告スロット */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
          padding: '12px', textAlign: 'center', minHeight: '250px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px',
        }}>
          <span style={{ color: '#555', fontSize: '11px' }}>広告スペース（レスポンシブ）</span>
        </div>

        {/* 前後のランキング */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: '16px',
          padding: '24px', marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>
            前後のランキング
          </h2>
          {prevVideo && (
            <RankingNeighbor rank={overallRank - 1} video={prevVideo} />
          )}
          <div style={{
            padding: '10px 14px', background: 'rgba(255,210,60,0.1)',
            borderRadius: '8px', marginBottom: '8px', border: '1px solid rgba(255,210,60,0.3)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontWeight: 900, fontSize: '16px', color: '#ffd700', width: '36px', textAlign: 'center' }}>{overallRank}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{video.title}</span>
            <span style={{ fontSize: '11px', color: '#ffd700', flexShrink: 0 }}>Elo {String(elo)}</span>
          </div>
          {nextVideo && (
            <RankingNeighbor rank={overallRank + 1} video={nextVideo} />
          )}
        </div>

        {/* サイト説明テキスト */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
          padding: '16px 18px', lineHeight: '1.9', marginBottom: '24px',
        }}>
          <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
            「東海オンエア 動画バトル」は、東海オンエアの全{FILTERED_VIDEOS.length.toLocaleString()}本の動画をファン投票で順位付けするランキングサイトです。
            東海オンエアの公認切り抜きチャンネルである「東海ランキング」が運営しています。
            投票にはEloレーティングシステムを採用しており、2本の動画を比較する形式で「どっちが好き？」を繰り返すことで、統計的に信頼性の高い順位を算出しています。
            このページでは「{video.title}」（{video.year}年公開）のランキング情報をご覧いただけます。
            データはリアルタイムの投票結果に基づいて更新されます。
          </p>
        </div>

        {/* フッター */}
        <div style={{ textAlign: 'center', color: '#888', fontSize: '13px', lineHeight: '1.8', paddingTop: '16px' }}>
          <p style={{ margin: '0 0 8px' }}>東海オンエアの動画{FILTERED_VIDEOS.length.toLocaleString()}本から、好きな動画を選んで投票できるランキングサイトです。</p>
          <a href="https://www.youtube.com/@tokairanking" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none', fontSize: '13px' }}>
            東海ランキング【公認】チャンネルはこちらをクリック
          </a>
          <p style={{ margin: '12px 0 0' }}>
            <Link href="/about" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>このサイトについて</Link>
            <span style={{ color: '#444', margin: '0 8px' }}>|</span>
            <Link href="/privacy" style={{ color: '#666', textDecoration: 'none', fontSize: '12px' }}>プライバシーポリシー</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function DataCard({ label, value, sub }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px 16px' }}>
      <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>
        {value}
        {sub && <span style={{ fontSize: '11px', color: '#888', fontWeight: 400, marginLeft: '4px' }}>{sub}</span>}
      </div>
    </div>
  );
}

function RankingNeighbor({ rank, video }) {
  return (
    <Link
      href={`/video/${video.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '8px' }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 14px', background: 'rgba(255,255,255,0.06)',
        borderRadius: '8px', transition: 'background 0.2s',
      }}>
        <span style={{ fontWeight: 700, fontSize: '14px', color: '#666', width: '36px', textAlign: 'center' }}>{rank}</span>
        <img
          src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
          alt=""
          style={{ width: '48px', height: '27px', borderRadius: '4px', objectFit: 'cover', background: '#1a1a2e' }}
        />
        <span style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{video.title}</span>
        <span style={{ fontSize: '11px', color: '#888', flexShrink: 0 }}>Elo {video.elo}</span>
      </div>
    </Link>
  );
}
