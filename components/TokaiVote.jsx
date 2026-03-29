'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { FILTERED_VIDEOS } from "../lib/videos";

const K = 32;
function expectedScore(ra, rb) {
  return 1 / (1 + Math.pow(10, (rb - ra) / 400));
}
function updateElo(winner, loser) {
  const eW = expectedScore(winner, loser);
  const eL = expectedScore(loser, winner);
  return [Math.round(winner + K * (1 - eW)), Math.round(loser + K * (0 - eL))];
}

function formatNum(n) {
  if (n >= 100000000) return Math.floor(n / 100000000) + "億";
  if (n >= 10000) return Math.floor(n / 10000) + "万";
  return n.toLocaleString();
}


export default function TokaiVote() {
  const [ratings, setRatings] = useState(() => {
    const r = {};
    FILTERED_VIDEOS.forEach((v) => (r[v.id] = 1200));
    return r;
  });
  const [matchCount, setMatchCount] = useState(0);
  const [myVoteCount, setMyVoteCount] = useState(0);
  const [pair, setPair] = useState([null, null]);
  const [showRanking, setShowRanking] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [imgErrors, setImgErrors] = useState({});
  const [votedState, setVotedState] = useState(null);
  const [lastVote, setLastVote] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // 再生数帯ごとのリスト（初回・2回目用）
  const VIDEOS_10M = FILTERED_VIDEOS.filter(v => v.views >= 10000000);
  const VIDEOS_4M_10M = FILTERED_VIDEOS.filter(v => v.views >= 4000000 && v.views < 10000000);
  const voteCountRef = useRef(0);

  const pickPair = useCallback(() => {
    let pool = FILTERED_VIDEOS;
    const count = voteCountRef.current;
    if (count === 0 && VIDEOS_10M.length >= 2) {
      pool = VIDEOS_10M;
    } else if (count === 1 && VIDEOS_4M_10M.length >= 2) {
      pool = VIDEOS_4M_10M;
    }
    const i = Math.floor(Math.random() * pool.length);
    let j = Math.floor(Math.random() * (pool.length - 1));
    if (j >= i) j++;
    const a = pool[i], b = pool[j];
    setPair(Math.random() < 0.5 ? [a, b] : [b, a]);
  }, []);

  useEffect(() => { pickPair(); }, [pickPair]);

  // ハッシュ #ranking でランキング直接表示（動画ページからの遷移用）
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#ranking') {
        setShowRanking(true);
        window.history.replaceState(null, '', '/');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Fetch global ratings on mount
  useEffect(() => {
    fetch('/api/ratings')
      .then(res => res.json())
      .then(data => {
        if (data.ratings && Object.keys(data.ratings).length > 0) {
          setRatings(prev => ({ ...prev, ...data.ratings }));
        }
        if (data.matchCount) setMatchCount(data.matchCount);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const vote = (winnerId) => {
    if (phase !== 'idle') return;
    const loserId = pair[0].id === winnerId ? pair[1].id : pair[0].id;

    // Optimistic local update
    setRatings((prev) => {
      const [newW, newL] = updateElo(prev[winnerId], prev[loserId]);
      return { ...prev, [winnerId]: newW, [loserId]: newL };
    });
    setMatchCount((c) => c + 1);
    setMyVoteCount((c) => c + 1);
    voteCountRef.current += 1;

    // Send to server
    fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winnerId, loserId }),
    }).then(res => res.json()).then(data => {
      if (data.winnerElo && data.loserElo) {
        setRatings(prev => ({
          ...prev,
          [winnerId]: data.winnerElo,
          [loserId]: data.loserElo,
        }));
      }
    }).catch(() => {});

    const winnerTitle = pair.find(p => p.id === winnerId)?.title;
    const loserTitle = pair.find(p => p.id === loserId)?.title;
    setVotedState({ winnerId, loserId });
    setPhase('voted');
    if (myVoteCount === 0) {
      setLastVote({ winnerTitle, loserTitle });
    }
    setTimeout(() => {
      setPhase('exit');
      setTimeout(() => {
        setVotedState(null);
        pickPair();
        setPhase('idle');
      }, 150);
    }, 280);
  };

  const [rankYear, setRankYear] = useState('all');

  const availableYears = useMemo(() => {
    const years = [...new Set(FILTERED_VIDEOS.filter(v => v.year).map(v => v.year))].sort((a, b) => b - a);
    return years;
  }, []);

  const ranking = useMemo(() => {
    const base = FILTERED_VIDEOS.map((v) => ({ ...v, elo: ratings[v.id] || 1200 }))
      .sort((a, b) => b.elo - a.elo || b.views - a.views);
    if (rankYear === 'all') return base;
    return base.filter(v => v.year === rankYear);
  }, [ratings, rankYear]);

  const cardStyle = (isWinner, isLoser, isHovered) => ({
    flex: 1,
    maxWidth: isSmallScreen ? "100%" : "560px",
    minWidth: isSmallScreen ? "auto" : "400px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: phase !== 'idle' ? "default" : "pointer",
    transition: "transform 0.35s ease, opacity 0.35s ease, border-color 0.35s ease, box-shadow 0.2s ease",
    border: isWinner ? "2px solid rgba(255,210,60,0.7)" : (!isSmallScreen && isHovered) ? "2px solid rgba(255,255,255,0.25)" : "2px solid transparent",
    display: "flex",
    flexDirection: "column",
    transform: isWinner ? "scale(1.03)" : isLoser ? "scale(0.97)" : (!isSmallScreen && isHovered) ? "translateY(-7px) scale(1.02)" : "none",
    opacity: isLoser ? 0.4 : 1,
    boxShadow: (!isSmallScreen && isHovered && phase === 'idle') ? "0 20px 48px rgba(0,0,0,0.45)" : "none",
  });

  // ---- Ranking ----
  if (showRanking) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#130f34,#1d1d46,#28284a)", color: "#fff", fontFamily: "system-ui,sans-serif", padding: 0, margin: 0, paddingBottom: '80px' }}>
        <div style={{ textAlign: "center", padding: "24px 16px 4px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, fontFamily: '"M PLUS 1p", sans-serif', background: "linear-gradient(180deg,#ffd080,#ffb840,#ffa030,#ff8820)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            ランキング {rankYear === 'all' ? 'TOP300' : 'TOP50'}
          </h1>
          <p style={{ color: "#888", fontSize: "11px", marginTop: "4px", letterSpacing: "0.03em" }}>by 東海ランキング<span style={{ marginLeft: "-0.3em" }}>【</span>公認】</p>
          <p style={{ color: "#999", fontSize: "13px", marginTop: "6px" }}>ユーザー{formatNum(Math.floor(matchCount / 5))}人 全{formatNum(matchCount)}票 の投票に基づく</p>
        </div>
        <div style={{ padding: "8px 16px 16px" }}>
          <button
            style={{ display: "block", margin: "0 auto 12px", padding: "10px 28px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "30px", color: "#fff", fontSize: "14px", cursor: "pointer" }}
            onClick={() => setShowRanking(false)}
          >
            ← 投票に戻る
          </button>
          {availableYears.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", padding: "0 0 16px", maxWidth: "700px", margin: "0 auto" }}>
              <button
                onClick={() => setRankYear('all')}
                style={{ padding: "6px 14px", borderRadius: "20px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", background: rankYear === 'all' ? "rgba(100,210,255,0.85)" : "rgba(255,255,255,0.08)", color: rankYear === 'all' ? "#fff" : "#aaa" }}
              >全期間</button>
              {availableYears.map(y => (
                <button
                  key={y}
                  onClick={() => setRankYear(y)}
                  style={{ padding: "6px 14px", borderRadius: "20px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", background: rankYear === y ? "rgba(100,210,255,0.85)" : "rgba(255,255,255,0.08)", color: rankYear === y ? "#fff" : "#aaa" }}
                >{y}年</button>
              ))}
            </div>
          )}

          {ranking.slice(0, rankYear === 'all' ? 300 : 50).map((v, i) => {
            const adPositions = rankYear === 'all' ? [5, 20, 50, 100, 150, 200, 250] : [5, 20, 50];
            return (
              <div key={v.id}>
                <a href={`/video/${v.id}`} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "rgba(255,255,255,0.09)", borderRadius: "12px", marginBottom: "6px", maxWidth: "700px", marginLeft: "auto", marginRight: "auto", textDecoration: "none", color: "inherit" }}>
                  <span style={{ fontWeight: 900, fontSize: "18px", width: "32px", textAlign: "center", flexShrink: 0, color: i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : i <= 4 ? "#88c8e8" : "#666" }}>
                    {i + 1}
                  </span>
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                    alt=""
                    style={{ width: "48px", height: "27px", borderRadius: "4px", objectFit: "cover", flexShrink: 0, background: "#1a1a2e" }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.title}</div>
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Elo {v.elo} ・ ▶ {formatNum(v.views)} ・ ♡ {formatNum(v.likes)}</div>
                  </div>
                </a>
                {/* 広告スロット一時停止（AdSense審査対策）
                {adPositions.includes(i + 1) && (
                  <div className="ad-slot" style={{ maxWidth: "700px", marginLeft: "auto", marginRight: "auto", marginBottom: "6px", padding: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", textAlign: "center", minHeight: i + 1 === 5 ? "90px" : "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#555", fontSize: "11px" }}>広告スペース{i + 1 === 5 ? "（横長バナー）" : "（レスポンシブ）"}</span>
                  </div>
                )}
                */}
              </div>
            );
          })}

          {/* ランキング終わりの広告スロット — 一時停止（AdSense審査対策） */}

          <button
            style={{ display: "block", margin: "24px auto 16px", padding: "14px 32px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "30px", color: "#ccc", fontSize: "15px", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
            onClick={() => {
              const pool = rankYear === 'all' ? FILTERED_VIDEOS : FILTERED_VIDEOS.filter(v => v.year === rankYear);
              const v = pool[Math.floor(Math.random() * pool.length)];
              window.open(`https://www.youtube.com/watch?v=${v.id}`, '_blank');
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.08)"}
          >
            🎲 ランダムで{rankYear === 'all' ? '' : `${rankYear}年の`}東海オンエアの動画を見る
          </button>

          {/* ランキング下部の説明テキスト（AdSense審査対策） */}
          <div style={{ maxWidth: "700px", margin: "0 auto 24px", padding: "16px 18px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", lineHeight: "1.9" }}>
            <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
              「東海オンエア 動画バトル」は、東海オンエアの全{formatNum(FILTERED_VIDEOS.length)}本の動画をファン投票で順位付けするランキングサイトです。東海オンエアの公認切り抜きチャンネルである「東海ランキング」が運営しています。投票にはEloレーティングシステムを採用しており、2本の動画を比較する形式で「どっちが好き？」を繰り返すことで、統計的に信頼性の高い順位を算出しています。5回投票すると全体のランキング結果を閲覧でき、全期間ランキングと年度別ランキングを切り替えて楽しめます。
            </p>
          </div>

          {/* ランキングページ フッター */}
          <div style={{ textAlign: "center", padding: "16px 16px 100px", color: "#888", fontSize: "13px", lineHeight: "1.8" }}>
            <p style={{ margin: "0 0 8px" }}>東海オンエアの動画3,000本以上から、好きな動画を選んで投票できるランキングサイトです。</p>
            <a href="https://www.youtube.com/@tokairanking" target="_blank" rel="noopener noreferrer" style={{ color: "#888", textDecoration: "none", fontSize: "13px" }}>
              東海ランキング【公認】チャンネルはこちらをクリック
            </a>
            <p style={{ margin: "12px 0 0" }}>
              <a href="/about" style={{ color: "#666", textDecoration: "none", fontSize: "12px" }}>このサイトについて</a>
              <span style={{ color: "#444", margin: "0 8px" }}>|</span>
              <a href="/privacy" style={{ color: "#666", textDecoration: "none", fontSize: "12px" }}>プライバシーポリシー</a>
            </p>
          </div>
        </div>

        {/* 広告枠 — 一時停止（AdSense審査対策） */}
      </div>
    );
  }

  // ---- Vote ----
  if (!pair[0] || !pair[1]) return null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#110e30,#1b1b42,#262646)", color: "#fff", fontFamily: "system-ui,sans-serif", padding: 0, margin: 0, paddingBottom: '80px', display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
      <div style={{ textAlign: "center", padding: isSmallScreen ? "64px 12px 0" : "56px 16px 0" }}>
        <h1 style={{ fontSize: isSmallScreen ? "26px" : "36px", fontWeight: 800, fontFamily: '"M PLUS 1p", sans-serif', letterSpacing: "0.05em", margin: 0, lineHeight: "1.6", display: "inline-block", paddingLeft: "0.15em" }}>
          <span style={{ background: "linear-gradient(180deg,#ffd080,#ffb840,#ffa030,#ff8820)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>東海オンエア 動画バトル</span>
        </h1>
        <p style={{ color: "#aaa", fontSize: isSmallScreen ? "12px" : "13px", marginTop: "-2px", letterSpacing: "0.03em", lineHeight: "1.6" }}>by 東海ランキング<span style={{ marginLeft: "-0.3em" }}>【</span>公認】</p>
        <p style={{ color: "#ff9944", fontSize: isSmallScreen ? "15px" : "19px", fontWeight: 500, fontFamily: '"M PLUS 1p", sans-serif', letterSpacing: "0.05em", marginTop: "16px", lineHeight: "1.6", paddingLeft: "0.3em" }}>どっちの動画が好き？タップで投票！</p>
        <p style={{ color: "#aaa", fontSize: isSmallScreen ? "13px" : "14px", marginTop: "16px", lineHeight: "1.6" }}>あなた {myVoteCount.toLocaleString()}回投票済み ・ 全体 {formatNum(matchCount)}票 ・ {FILTERED_VIDEOS.length.toLocaleString()}本の動画</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: isSmallScreen ? "8px" : "24px", padding: "0 16px 12px", maxWidth: "1200px", margin: "0 auto", minHeight: isSmallScreen ? "auto" : "440px", opacity: phase === 'exit' ? 0 : 1, transition: "opacity 0.15s ease", flexDirection: "row", }}>
        {pair.map((video, idx) => {
          const isWinner = phase === 'voted' && votedState?.winnerId === video.id;
          const isLoser = phase === 'voted' && votedState?.loserId === video.id;
          const isHovered = hoveredCard === idx && phase === 'idle';
          return (
            <div
              key={video.id + "-" + matchCount}
              style={cardStyle(isWinner, isLoser, isHovered)}
              onClick={() => vote(video.id)}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", overflow: "hidden", background: "#1a1a2e" }}>
                {!imgErrors[video.id] ? (
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    alt={video.title}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      if (e.target.src.includes('maxresdefault')) {
                        e.target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                      } else {
                        setImgErrors((p) => ({ ...p, [video.id]: true }));
                      }
                    }}
                  />
                ) : (
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", background: "linear-gradient(135deg,#1e3a5f,#2d1b69)" }}>
                    🎬
                  </div>
                )}
              </div>
              <div style={{ padding: isSmallScreen ? "8px 10px" : "14px 16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <p style={{ fontSize: isSmallScreen ? "13px" : "16px", fontWeight: 700, lineHeight: "1.4", margin: "0 0 6px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {video.title}
                </p>
                <div style={{ display: "flex", gap: isSmallScreen ? "8px" : "16px", fontSize: isSmallScreen ? "12px" : "13px", color: "#aaa" }}>
                  <span>▶ {formatNum(video.views)}</span>
                  <span>♡ {formatNum(video.likes)}</span>
                </div>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", textAlign: "center", padding: isSmallScreen ? "8px" : "10px", fontSize: isSmallScreen ? "12px" : "12px", color: "#ff4444", textDecoration: "none", borderTop: "1px solid rgba(255,255,255,0.09)" }}
                onClick={(e) => e.stopPropagation()}
              >
                YouTubeで見る →
              </a>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "4px 0 24px" }}>
        <button
          style={{ padding: "8px 24px", background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", color: "#888", fontSize: "14px", cursor: phase !== 'idle' ? "default" : "pointer", opacity: phase !== 'idle' ? 0.4 : 1 }}
          onClick={() => { if (phase === 'idle') pickPair(); }}
        >
          この組み合わせをスキップ
        </button>

      {lastVote && myVoteCount >= 5 && (
        <a
          href={`https://x.com/intent/tweet?text=${encodeURIComponent(`🔥 東海オンエア 動画バトル🔥\n私は「${lastVote.winnerTitle}」に投票！https://tokairanking.com`)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setLastVote(null)}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 20px", background: "#000", border: "1px solid #333", borderRadius: "20px", color: "#fff", fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "background 0.15s" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a1a"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#000"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          この投票をXでシェアする
        </a>
      )}

      {myVoteCount < 5 ? (
        <>
        <p style={{ textAlign: "center", color: "#bbb", fontSize: isSmallScreen ? "14px" : "15px", margin: 0, lineHeight: "1.6" }}>
          あと{5 - myVoteCount}回投票すると詳しいランキングが見られます
        </p>
        {matchCount > 0 && (
          <div style={{ margin: "6px auto 0", padding: "0 16px" }}>
            <p style={{ textAlign: "center", color: "#888", fontSize: "11px", marginBottom: "8px" }}>現在のTOP3</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
              {ranking.slice(0, 3).map((v, i) => (
                <div key={v.id} style={{ position: "relative", width: isSmallScreen ? "30vw" : "120px", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: "-6px", left: "-4px", zIndex: 1, width: "22px", height: "22px", borderRadius: "50%", background: i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : "#cd7f32", color: "#000", fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                  <img src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`} alt="" style={{ width: "100%", aspectRatio: "16/9", borderRadius: "6px", objectFit: "cover", display: "block" }} />
                  <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", color: "#888", fontSize: "10px", textDecoration: "none", marginTop: "4px" }}>YouTubeで見る →</a>
                </div>
              ))}
            </div>
          </div>
        )}
        </>
      ) : (
        <button
          style={{ padding: "12px 32px", background: "linear-gradient(135deg,#ff6b6b,#ee5a24)", border: "none", borderRadius: "30px", color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,107,107,0.3)" }}
          onClick={() => {
            fetch('/api/ratings').then(r => r.json()).then(data => {
              if (data.ratings && Object.keys(data.ratings).length > 0) {
                setRatings(prev => ({ ...prev, ...data.ratings }));
              }
              if (data.matchCount) setMatchCount(data.matchCount);
            }).catch(() => {});
            setShowRanking(true);
          }}
        >
          🏆 ランキングを見る
        </button>
      )}
      </div>

      {/* フッター */}
      <div style={{ textAlign: "center", padding: "32px 16px 100px", color: "#888", fontSize: "13px", lineHeight: "1.8" }}>
        <p style={{ margin: "0 0 8px" }}>東海オンエアの動画3,000本以上から、好きな動画を選んで投票できるランキングサイトです。</p>
        <a
          href="https://www.youtube.com/@tokairanking"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#888", textDecoration: "none", fontSize: "13px" }}
        >
          東海ランキング【公認】チャンネルはこちらをクリック
        </a>
        <p style={{ margin: "12px 0 0" }}>
          <a href="/about" style={{ color: "#666", textDecoration: "none", fontSize: "12px" }}>このサイトについて</a>
          <span style={{ color: "#444", margin: "0 8px" }}>|</span>
          <a href="/privacy" style={{ color: "#666", textDecoration: "none", fontSize: "12px" }}>プライバシーポリシー</a>
        </p>
      </div>

      {/* 広告枠 — 一時停止（AdSense審査対策） */}
    </div>
  );
}
