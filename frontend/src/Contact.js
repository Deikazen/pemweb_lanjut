export default function Contact() {
  return (
    <section id="kontak" style={{ background:'#0F0500', padding:'80px 40px 40px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(to right,transparent,var(--gold),var(--rouge),var(--gold),transparent)' }}/>

      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr', gap:60, marginBottom:64 }}>

          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <span style={{ fontSize:32 }}>🧧</span>
              <div>
                <div style={{ fontFamily:'Noto Serif SC,serif', color:'var(--gold)', fontSize:22, fontWeight:700 }}>Golden Basket</div>
                <div style={{ color:'rgba(212,160,23,0.5)', fontSize:10, letterSpacing:4, textTransform:'uppercase' }}>Authentic Dimsum</div>
              </div>
            </div>
            <p style={{ color:'rgba(250,246,238,0.4)', lineHeight:1.8, fontSize:13, maxWidth:280 }}>
              Menyajikan cita rasa dim sum autentik Hong Kong dengan bahan-bahan segar pilihan
              dan resep tradisional yang telah diwariskan turun-temurun.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 style={{ color:'var(--gold)', fontSize:13, letterSpacing:3, textTransform:'uppercase', marginBottom:20 }}>Navigasi</h4>
            {['Beranda','Menu','Tentang Kami','Kontak'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(' kami','').replace(' ','-')}`}
                style={{ display:'block', color:'rgba(250,246,238,0.4)', textDecoration:'none', fontSize:13, marginBottom:12 }}>
                {link}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color:'var(--gold)', fontSize:13, letterSpacing:3, textTransform:'uppercase', marginBottom:20 }}>Hubungi Kami</h4>
            {[
              { icon:'📍', text:'Jl. Dimsum Raya No. 88\nBandung, Jawa Barat' },
              { icon:'📞', text:'+62 812-3456-7890' },
              { icon:'✉️', text:'hello@goldenbasket.id' },
              { icon:'🕐', text:'Setiap Hari: 07.00–21.00' },
            ].map(c => (
              <div key={c.icon} style={{ display:'flex', gap:10, marginBottom:14 }}>
                <span style={{ fontSize:14, marginTop:1 }}>{c.icon}</span>
                <span style={{ color:'rgba(250,246,238,0.4)', fontSize:13, lineHeight:1.6, whiteSpace:'pre-line' }}>{c.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop:'1px solid rgba(212,160,23,0.1)', paddingTop:28, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <p style={{ color:'rgba(250,246,238,0.25)', fontSize:12 }}>© 2025 Golden Basket Dimsum. All rights reserved.</p>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <span style={{ color:'rgba(250,246,238,0.25)', fontSize:12 }}>Made with</span>
            <span style={{ fontSize:14 }}>❤️</span>
            <span style={{ color:'rgba(250,246,238,0.25)', fontSize:12 }}>& 🥟</span>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){ #kontak > div > div:first-child { grid-template-columns:1fr !important; gap:32px !important; } }`}</style>
    </section>
  );
}
