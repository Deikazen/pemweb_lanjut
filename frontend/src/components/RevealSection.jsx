// ============================================
// RevealSection.jsx  (Section dengan Scroll Reveal)
// → Mendeteksi masuk viewport via IntersectionObserver
// → Menambah class section--visible saat terlihat
// → Dipakai di: LandingPage (About, Features, Menu, Contact)
// ============================================

import { useEffect, useState, useRef } from "react";

function RevealSection({ children, className, id }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`${className} ${visible ? "section--visible" : "section--hidden"}`}
      id={id}
    >
      {children}
    </section>
  );
}

export default RevealSection;
