// ============================================
// FloatingParticles.jsx  (Dekorasi Hero)
// → Partikel mengambang di section hero
// → Animasi CSS float-up infinite
// → Dipakai di: LandingPage → section Hero
// ============================================

function FloatingParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size:  4 + Math.random() * 10,
    left:  Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 10,
    opacity: 0.08 + Math.random() * 0.18,
  }));

  return (
    <div className="particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width:  p.size,
            height: p.size,
            left:   `${p.left}%`,
            animationDelay:    `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

export default FloatingParticles;
