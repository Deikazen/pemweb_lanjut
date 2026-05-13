export default function Hero() {
  return (
    <section
      id="beranda"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        background: `
        radial-gradient(ellipse 80% 60% at 50% 0%, rgba(192,57,43,0.25) 0%, transparent 70%),
        radial-gradient(ellipse 50% 80% at 90% 50%, rgba(212,160,23,0.08) 0%, transparent 60%),
        linear-gradient(160deg, #1A0A00 0%, #2C1008 40%, #1A0A00 100%)
      `,
      }}
    >
      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: `
          repeating-linear-gradient(0deg,  var(--gold) 0, var(--gold) 1px, transparent 1px, transparent 40px),
          repeating-linear-gradient(90deg, var(--gold) 0, var(--gold) 1px, transparent 1px, transparent 40px)
        `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Spinning circle deco */}
      <div
        style={{
          position: "absolute",
          right: "-10%",
          top: "50%",
          transform: "translateY(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          border: "1px solid rgba(212,160,23,0.15)",
          animation: "spin-slow 30s linear infinite",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 40,
            borderRadius: "50%",
            border: "1px solid rgba(212,160,23,0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 100,
            borderRadius: "50%",
            border: "1px dashed rgba(192,57,43,0.2)",
          }}
        />
      </div>

      {/* Big Chinese char */}
      <div
        style={{
          position: "absolute",
          right: "8%",
          top: "15%",
          fontFamily: "Noto Serif SC, serif",
          fontSize: 200,
          fontWeight: 900,
          color: "rgba(212,160,23,0.05)",
          lineHeight: 1,
          userSelect: "none",
          animation: "float 6s ease-in-out infinite",
        }}
      >
        食
      </div>

      {/* Steam particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${20 + i * 8}%`,
            bottom: "15%",
            width: 3,
            height: 40 + i * 5,
            borderRadius: 999,
            background:
              "linear-gradient(to top, rgba(255,255,255,0.6), transparent)",
            animation: `steamRise ${1.5 + i * 0.3}s ease-in infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 40px",
          paddingTop: 100,
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(212,160,23,0.1)",
            border: "1px solid rgba(212,160,23,0.3)",
            padding: "6px 18px",
            borderRadius: 999,
            marginBottom: 30,
            animation: "fadeIn 0.8s ease forwards",
          }}
        >
          <span style={{ color: "var(--gold)", fontSize: 12 }}>✦</span>
          <span
            style={{
              color: "var(--gold)",
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Authentic Hong Kong Style
          </span>
          <span style={{ color: "var(--gold)", fontSize: 12 }}>✦</span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: "clamp(52px, 8vw, 110px)",
            lineHeight: 1.05,
            color: "var(--cream)",
            fontWeight: 900,
            marginBottom: 20,
            animation: "fadeUp 0.9s ease 0.1s both",
          }}
        >
          Cita Rasa
          <br />
          <span
            style={{
              background:
                "linear-gradient(90deg, var(--gold-light), var(--gold), var(--rouge-light), var(--gold))",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}
          >
            Dimsum
          </span>
          <br />
          Autentik
        </h1>

        <p
          style={{
            color: "rgba(250,246,238,0.65)",
            fontSize: 18,
            maxWidth: 480,
            lineHeight: 1.7,
            marginBottom: 44,
            fontWeight: 300,
            animation: "fadeUp 0.9s ease 0.2s both",
          }}
        >
          Diolah dengan teknik tradisional turun-temurun, disajikan hangat dalam
          keranjang bambu — setiap gigitan membawa kenangan dari dapur Hong
          Kong.
        </p>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            animation: "fadeUp 0.9s ease 0.3s both",
          }}
        >
          <a
            href="#menu"
            style={{
              background:
                "linear-gradient(135deg, var(--rouge), var(--rouge-dark))",
              color: "var(--gold-light)",
              padding: "16px 36px",
              borderRadius: 2,
              textDecoration: "none",
              fontSize: 14,
              letterSpacing: 2,
              fontWeight: 500,
              textTransform: "uppercase",
              border: "1px solid var(--gold)",
              display: "inline-block",
              boxShadow: "0 8px 30px rgba(192,57,43,0.4)",
              transition: "all 0.3s",
            }}
          >
            Lihat Menu
          </a>
          <a
            href="#tentang"
            style={{
              background: "transparent",
              color: "var(--cream)",
              padding: "16px 36px",
              borderRadius: 2,
              textDecoration: "none",
              fontSize: 14,
              letterSpacing: 2,
              fontWeight: 500,
              textTransform: "uppercase",
              border: "1px solid rgba(250,246,238,0.2)",
              display: "inline-block",
              transition: "all 0.3s",
            }}
          >
            Tentang Kami
          </a>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 48,
            marginTop: 80,
            paddingTop: 48,
            borderTop: "1px solid rgba(212,160,23,0.15)",
            animation: "fadeUp 0.9s ease 0.4s both",
            flexWrap: "wrap",
          }}
        >
          {[
            { num: "30+", label: "Varian Menu" },
            { num: "10+", label: "Tahun Berpengalaman" },
            { num: "5★", label: "Rating Pelanggan" },
          ].map((stat) => (
            <div key={stat.num}>
              <div
                style={{
                  fontFamily: "Noto Serif SC, serif",
                  fontSize: 36,
                  fontWeight: 700,
                  color: "var(--gold)",
                  lineHeight: 1,
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  color: "rgba(250,246,238,0.5)",
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 150,
          background: "linear-gradient(to top, var(--cream), transparent)",
        }}
      />
    </section>
  );
}
