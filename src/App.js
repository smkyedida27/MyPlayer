import React, { useState, useRef, useEffect } from "react";
import songs from "./songs";

// ── helpers ──────────────────────────────────────────
function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + (s < 10 ? "0" : "") + s;
}

export default function App() {
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);   // 0–1
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const audioRef = useRef(null);

  // autoplay on song change
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.load();
    if (playing) a.play().catch(() => {});
  }, [cur]);

  // sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const nextSong = () => {
    setCur(prev =>
      shuffle
        ? Math.floor(Math.random() * songs.length)
        : (prev + 1) % songs.length
    );
    setProgress(0);
  };

  const prevSong = () => {
    setCur(prev => (prev === 0 ? songs.length - 1 : prev - 1));
    setProgress(0);
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().catch(() => {}); setPlaying(true); }
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
    setProgress(ratio);
  };

  const song = songs[cur];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"240px 1fr",
                  gridTemplateRows:"1fr 90px", height:"100vh",
                  background:"#000", fontFamily:"Circular,Helvetica Neue,sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{ background:"#000", padding:"8px", display:"flex",
                      flexDirection:"column", gap:"8px" }}>
        {/* Logo */}
        <div style={{ background:"#121212", borderRadius:8, padding:"16px 20px" }}>
          <span style={{ color:"#fff", fontWeight:900, fontSize:22, letterSpacing:-1 }}>
            NAPLAY
          </span>
        </div>

        {/* Track list */}
        <div style={{ background:"#121212", borderRadius:8, flex:1, overflowY:"auto" }}>
          <p style={{ color:"#b3b3b3", fontSize:14, fontWeight:700,
                      padding:"16px 16px 8px" }}>Your Library</p>
          {songs.map((s, i) => (
            <div key={i} onClick={() => { setCur(i); setProgress(0); setPlaying(true); }}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 12px",
                       background: cur===i ? "#1a1a1a" : "transparent",
                       cursor:"pointer", borderRadius:6, margin:"0 8px 2px" }}>
              <div style={{ width:48, height:48, borderRadius:4,
                            background: s.color || "#333",
                            flexShrink:0 }} />
              <div style={{ minWidth:0 }}>
                <div style={{ color: cur===i ? "#1db954" : "#fff",
                              fontSize:14, whiteSpace:"nowrap",
                              overflow:"hidden", textOverflow:"ellipsis" }}>
                  {s.title}
                </div>
                <div style={{ color:"#b3b3b3", fontSize:12, marginTop:2 }}>
                  {s.artist}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ background:"#121212", display:"flex",
                     flexDirection:"column", justifyContent:"flex-end",
                     padding:"24px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.4,
                      background:`linear-gradient(transparent, ${song.color||"#333"})`,
                      pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <p style={{ color:"#fff", fontSize:12, fontWeight:700,
                      letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Song</p>
          <h1 style={{ color:"#fff", fontSize:52, fontWeight:900,
                       letterSpacing:-2, lineHeight:1, marginBottom:8 }}>
            {song.title}
          </h1>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:14 }}>
            {song.artist}
          </p>
        </div>
      </main>

      {/* ── Bottom bar ── */}
      <footer style={{ gridColumn:"1/3", background:"#181818",
                       borderTop:"1px solid #282828", display:"flex",
                       alignItems:"center", padding:"0 16px", gap:8 }}>

        {/* Now playing */}
        <div style={{ display:"flex", alignItems:"center", gap:12, width:230 }}>
          <div style={{ width:56, height:56, borderRadius:4,
                        background: song.color || "#333", flexShrink:0 }} />
          <div>
            <div style={{ color:"#fff", fontSize:13 }}>{song.title}</div>
            <div style={{ color:"#b3b3b3", fontSize:11 }}>{song.artist}</div>
          </div>
        </div>

        {/* Controls + progress */}
        <div style={{ flex:1, display:"flex", flexDirection:"column",
                      alignItems:"center", gap:8, padding:"0 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <button onClick={()=>setShuffle(s=>!s)}
              style={{ background:"none", border:"none", cursor:"pointer",
                       color: shuffle ? "#1db954" : "#b3b3b3", fontSize:20 }}>⇄</button>
            <button onClick={prevSong}
              style={{ background:"none", border:"none", cursor:"pointer",
                       color:"#b3b3b3", fontSize:20 }}>⏮</button>
            <button onClick={togglePlay}
              style={{ width:32, height:32, borderRadius:"50%", background:"#fff",
                       border:"none", cursor:"pointer", fontSize:14 }}>
              {playing ? "⏸" : "▶"}
            </button>
            <button onClick={nextSong}
              style={{ background:"none", border:"none", cursor:"pointer",
                       color:"#b3b3b3", fontSize:20 }}>⏭</button>
            <button onClick={()=>setRepeat(r=>!r)}
              style={{ background:"none", border:"none", cursor:"pointer",
                       color: repeat ? "#1db954" : "#b3b3b3", fontSize:20 }}>↺</button>
          </div>
          <div style={{ width:"100%", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:"#b3b3b3", fontSize:11, minWidth:35 }}>
              {fmt(progress * duration)}
            </span>
            <div onClick={seek}
              style={{ flex:1, height:4, background:"#535353",
                       borderRadius:2, cursor:"pointer" }}>
              <div style={{ height:"100%", background:"#b3b3b3", borderRadius:2,
                            width:`${(progress*100).toFixed(1)}%`,
                            pointerEvents:"none" }} />
            </div>
            <span style={{ color:"#b3b3b3", fontSize:11, minWidth:35, textAlign:"right" }}>
              {fmt(duration)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div style={{ width:160, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:"#b3b3b3", fontSize:16 }}>🔉</span>
          <input type="range" min="0" max="1" step="0.01" value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            style={{ flex:1, accentColor:"#1db954" }} />
        </div>
      </footer>

      {/* Hidden audio */}
      <audio ref={audioRef} src={song.file}
        onTimeUpdate={e => {
          setProgress(e.target.currentTime / e.target.duration || 0);
        }}
        onLoadedMetadata={e => setDuration(e.target.duration)}
        onEnded={() => { if(repeat) audioRef.current.play(); else nextSong(); }}
      />
    </div>
  );
}