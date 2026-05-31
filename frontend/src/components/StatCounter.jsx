// ============================================
// StatCounter.jsx  (Animated Stat Counter)
// → Angka statistik dengan animasi naik dari 0
// → Menggunakan useCountUp hook + IntersectionObserver
// → Dipakai di: LandingPage → section Hero
// ============================================

import { useEffect, useState, useRef } from "react";
import useCountUp from "../hooks/useCountUp";

function StatCounter({ value, label, suffix = "" }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(value, 1600, started);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero-stat" ref={ref}>
      <strong>{count}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}

export default StatCounter;
