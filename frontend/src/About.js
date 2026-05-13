export default function About() {
  return (
    <section id="tentang" style={{
      padding:'100px 40px',
      background:'linear-gradient(160deg,#1A0A00 0%,#2C1008 50%,#1A0A00 100%)',
      position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', inset:0, opacity:0.03,
        backgroundImage:'repeating-linear-gradient(45deg,var(--gold) 0,var(--gold) 1px,transparent 1px,transparent 30px)',
        backgroundSize:'30px 30px' }} />

      <div style={{
        position:'absolute', left:'-2%', top:'10%',
        fontFamily:'Noto Serif SC,serif', fontSize:300, fontWeight:900,
        color:'rgba(212,160,23,0.04)', lineHeight:1, userSelect:'none',
        animation:'float 8s ease-in-out infinite',
      }}>點</div>

      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>

          {/* Text */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <div style={{ width:40, height:1, background:'var(--gold)' }}/>
              <span style={{ color:'var(--gold)', fontSize:11, letterSpacing:4, textTransform:'uppercase' }}>Kisah Kami</span>
            </div>
            <h2 style={{ fontSize:'clamp(32px,4vw,54px)', color:'var(--cream)', lineHeight:1.2, marginBottom:24 }}>
              Tradisi yang<br/><span style={{ color:'var(--gold)' }}>Tak Pernah Pudar</span>
            </h2>
            <p style={{ color:'rgba(250,246,238,0.6)', lineHeight:1.8, marginBottom:20, fontWeight:300 }}>
              Berdiri sejak 2010, Golden Basket lahir dari kecintaan mendalam terhadap
              tradisi kuliner <em>yum cha</em> — tradisi menikmati teh dan dim sum bersama
              keluarga yang berakar dari kebudayaan Kanton, Tiongkok.
            </p>
            <p style={{ color:'rgba(250,246,238,0.6)', lineHeight:1.8, marginBottom:36, fontWeight:300 }}>
              Setiap lipatan, setiap isian, dikerjakan dengan tangan oleh tim koki
              berpengalaman yang belajar langsung dari Hong Kong. Kami percaya
              bahwa makanan yang baik adalah makanan yang dibuat dengan sabar dan cinta.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {[
                { icon:'🌿', text:'Bahan Segar Pilihan' },
                { icon:'👨‍🍳', text:'Koki Bersertifikat' },
                { icon:'🚫', text:'Tanpa Pengawet' },
                { icon:'♻️', text:'Ramah Lingkungan' },
              ].map(f => (
                <div key={f.text} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:18 }}>{f.icon}</span>
                  <span style={{ color:'rgba(250,246,238,0.7)', fontSize:13 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card deco */}
          <div style={{ position:'relative', height:480 }}>
            <div style={{ position:'absolute', top:40, right:0, width:'85%', height:340, background:'linear-gradient(145deg,rgba(192,57,43,0.2),rgba(139,26,26,0.1))', border:'1px solid rgba(212,160,23,0.15)', borderRadius:4, transform:'rotate(6deg)' }}/>
            <div style={{ position:'absolute', top:20, right:10, width:'85%', height:340, background:'linear-gradient(145deg,rgba(212,160,23,0.1),rgba(192,57,43,0.05))', border:'1px solid rgba(212,160,23,0.2)', borderRadius:4, transform:'rotate(3deg)' }}/>
            <div style={{ position:'absolute', top:0, right:20, width:'85%', height:340, background:'linear-gradient(145deg,#2C1008,#3D1A0A)', border:'1px solid rgba(212,160,23,0.35)', borderRadius:4, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:30 }}>
              <div style={{ fontSize:80, animation:'float 4s ease-in-out infinite' }}>🥟</div>
              <div style={{ fontFamily:'Noto Serif SC,serif', fontSize:22, color:'var(--gold)', textAlign:'center' }}>點心 · Dim Sum</div>
              <div style={{ color:'rgba(250,246,238,0.5)', fontSize:13, textAlign:'center', lineHeight:1.6 }}>"Touch the Heart" — filosofi kami dalam setiap sajian</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, width:'80%' }}>
                <div style={{ flex:1, height:1, background:'linear-gradient(to right,transparent,var(--gold))' }}/>
                <span style={{ color:'var(--gold)', fontSize:14 }}>✦</span>
                <div style={{ flex:1, height:1, background:'linear-gradient(to left,transparent,var(--gold))' }}/>
              </div>
              <div style={{ fontSize:12, color:'rgba(212,160,23,0.6)', letterSpacing:3, textTransform:'uppercase' }}>Since 2010</div>
            </div>
            <div style={{ position:'absolute', bottom:30, left:0, background:'var(--rouge)', padding:'12px 20px', borderRadius:3, border:'1px solid var(--gold)' }}>
              <div style={{ fontFamily:'Noto Serif SC,serif', fontSize:24, color:'var(--gold)', lineHeight:1 }}>10+</div>
              <div style={{ color:'rgba(250,246,238,0.6)', fontSize:10, letterSpacing:2, textTransform:'uppercase' }}>Tahun</div>
            </div>
            <div style={{ position:'absolute', bottom:100, left:20, background:'rgba(212,160,23,0.15)', padding:'12px 20px', borderRadius:3, border:'1px solid rgba(212,160,23,0.3)' }}>
              <div style={{ fontFamily:'Noto Serif SC,serif', fontSize:24, color:'var(--gold-light)', lineHeight:1 }}>30+</div>
              <div style={{ color:'rgba(250,246,238,0.6)', fontSize:10, letterSpacing:2, textTransform:'uppercase' }}>Varian</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:100, background:'linear-gradient(to top,var(--cream),transparent)' }}/>

      <style>{`@media(max-width:768px){ #tentang > div > div { grid-template-columns:1fr !important; } }`}</style>
    </section>
  );
}
