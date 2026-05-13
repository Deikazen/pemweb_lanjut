import { useState, useEffect } from 'react';

const FALLBACK_ITEMS = [
  { id: 1, name: 'Hakau Udang',            media_url: null },
  { id: 2, name: 'Siomay Daging',          media_url: null },
  { id: 3, name: 'Cheong Fun Udang',       media_url: null },
  { id: 4, name: 'Pao Kari Ayam',          media_url: null },
  { id: 5, name: 'Turnip Cake (Lo Bak Go)',media_url: null },
  { id: 6, name: 'Egg Tart',               media_url: null },
];

const EMOJIS = ['🥟','🫕','🍱','🥩','🦐','🫓','🍡','🥮'];

function MenuCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const emoji = EMOJIS[index % EMOJIS.length];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'linear-gradient(145deg,#2C1008,#3D1A0A)' : 'linear-gradient(145deg,#FAF6EE,#FDF3D0)',
        border: `1px solid ${hovered ? 'rgba(212,160,23,0.5)' : 'rgba(212,160,23,0.15)'}`,
        borderRadius: 4, overflow: 'hidden',
        transition: 'all 0.4s ease',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 50px rgba(192,57,43,0.25)' : '0 4px 20px rgba(0,0,0,0.05)',
        animation: `fadeUp 0.6s ease ${index * 0.08}s both`,
      }}
    >
      {/* Image / emoji */}
      <div style={{
        height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        background: hovered
          ? 'linear-gradient(135deg,rgba(192,57,43,0.2),rgba(139,26,26,0.3))'
          : 'linear-gradient(135deg,rgba(212,160,23,0.08),rgba(192,57,43,0.05))',
      }}>
        {item.media_url
          ? <img src={item.media_url} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <div style={{ fontSize: 72, animation: hovered ? 'float 2s ease-in-out infinite' : 'none', transform: hovered ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.3s' }}>{emoji}</div>
        }
        {hovered && (
          <div style={{ position:'absolute', bottom:10, left:'30%', display:'flex', gap:8 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width:3, height:30, borderRadius:999,
                background:'linear-gradient(to top,rgba(255,255,255,0.5),transparent)',
                animation:'steamRise 1.5s ease-in infinite',
                animationDelay:`${i*0.2}s`,
              }}/>
            ))}
          </div>
        )}
        <div style={{
          position:'absolute', top:12, right:12,
          background:'var(--rouge)', color:'var(--gold-light)',
          padding:'3px 10px', fontSize:9, letterSpacing:2,
          textTransform:'uppercase', borderRadius:1, fontWeight:500,
        }}>Fresh</div>
      </div>

      {/* Info */}
      <div style={{ padding:'20px 22px' }}>
        <div style={{ fontFamily:'Noto Serif SC,serif', fontSize:17, fontWeight:700, color: hovered ? 'var(--gold-light)' : 'var(--ink)', marginBottom:6, transition:'color 0.3s' }}>
          {item.name}
        </div>
        <div style={{ fontSize:12, color: hovered ? 'rgba(212,160,23,0.6)' : 'rgba(61,43,31,0.5)', letterSpacing:1, marginBottom:16, transition:'color 0.3s' }}>
          Handcrafted Daily · Steamed Fresh
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:'Noto Serif SC,serif', fontSize:16, fontWeight:700, color: hovered ? 'var(--gold)' : 'var(--rouge)', transition:'color 0.3s' }}>
            Rp 35.000
          </div>
          <button style={{
            background: hovered ? 'var(--gold)' : 'transparent',
            color: hovered ? 'var(--ink)' : 'var(--rouge)',
            border:`1px solid ${hovered ? 'var(--gold)' : 'var(--rouge)'}`,
            padding:'6px 14px', borderRadius:2, cursor:'pointer',
            fontSize:11, letterSpacing:1, textTransform:'uppercase',
            fontFamily:'DM Sans,sans-serif', fontWeight:500, transition:'all 0.3s',
          }}>Pesan</button>
        </div>
      </div>
    </div>
  );
}

export default function Menu() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setItems(FALLBACK_ITEMS); setLoading(false); }, 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="menu" style={{ padding:'100px 40px', background:'var(--cream)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <div style={{ width:40, height:1, background:'var(--gold)' }}/>
            <span style={{ color:'var(--rouge)', fontSize:11, letterSpacing:4, textTransform:'uppercase', fontWeight:500 }}>Pilihan Terbaik Kami</span>
            <div style={{ width:40, height:1, background:'var(--gold)' }}/>
          </div>
          <h2 style={{ fontSize:'clamp(36px,5vw,64px)', color:'var(--ink)', marginBottom:16 }}>
            Menu <span style={{ color:'var(--rouge)' }}>Spesial</span>
          </h2>
          <p style={{ color:'rgba(61,43,31,0.6)', maxWidth:500, margin:'0 auto', lineHeight:1.7 }}>
            Setiap sajian dibuat segar setiap hari menggunakan bahan pilihan,
            mengikuti resep tradisional yang telah teruji selama puluhan tahun.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:'center', padding:60 }}>
            <div style={{ fontSize:48, animation:'float 1.5s ease-in-out infinite' }}>🥟</div>
            <div style={{ color:'var(--rouge)', letterSpacing:3, fontSize:12, textTransform:'uppercase', marginTop:12 }}>Menyiapkan menu...</div>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:24 }}>
            {items.map((item, i) => <MenuCard key={item.id} item={item} index={i} />)}
          </div>
        )}

        {/* Divider */}
        <div style={{ marginTop:64, display:'flex', alignItems:'center', gap:16, justifyContent:'center' }}>
          <div style={{ height:1, width:80, background:'linear-gradient(to right,transparent,var(--gold))' }}/>
          <span style={{ color:'var(--gold)', fontSize:20 }}>🧧</span>
          <div style={{ height:1, width:80, background:'linear-gradient(to left,transparent,var(--gold))' }}/>
        </div>
      </div>
    </section>
  );
}
