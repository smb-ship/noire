"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Fade, Words } from "@/components/Reveal";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

const fragrances = [
  { n: "01", name: "Nuit Absolue", notes: "Oud · Black Rose · Amber", desc: "A velvet darkness — smoked oud wrapped around midnight rose.", price: "$295", c: "#8a5a2b" },
  { n: "02", name: "Or Liquide", notes: "Saffron · Vanilla · Sandalwood", desc: "Molten gold on the skin. Warm, radiant, unforgettable.", price: "$310", c: "#d9bf8c" },
  { n: "03", name: "Éclipse", notes: "Bergamot · Iris · Vetiver", desc: "Cool light at the edge of shadow. Poised and quietly magnetic.", price: "$275", c: "#6f7b8c" },
  { n: "04", name: "Velours Noir", notes: "Tonka · Leather · Patchouli", desc: "Soft leather and spiced smoke — an intimate, lingering trail.", price: "$320", c: "#4a2a2a" },
];

export default function Home() {
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <main>
      <AnimatePresence>
        {!ready && (
          <motion.div className="loader" exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
            <motion.span className="serif gold" style={{ fontSize: "2rem", letterSpacing: "0.6em" }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}>
              NOIRÉ
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="progress" style={{ scaleX, width: "100%" }} />
      <nav>
        <span className="logo">NOIRÉ</span>
        <div>
          <a className="hide-m" href="#story">Maison</a>
          <a href="#collection">Collection</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <div className="canvas-wrap"><Scene onReady={() => setTimeout(() => setReady(true), 600)} /></div>

      <section className="hero">
        <Fade><p className="eyebrow">Maison de Parfum · Paris</p></Fade>
        <h1 className="serif gold"><Words text="NOIRÉ" delay={0.3} /></h1>
        <Fade delay={0.9}><p className="sub">Rare essences, bottled in darkness. A fragrance that lingers long after you have left the room.</p></Fade>
        <Fade delay={1.1}><a className="btn" href="#collection">Discover the Collection</a></Fade>
      </section>

      <section id="story" className="story">
        <div className="copy">
          <Fade><p className="eyebrow">La Maison</p></Fade>
          <h2 className="serif"><Words text="Born in the hour between dusk and dawn." /></h2>
          <Fade delay={0.2}>
            <p>NOIRÉ was founded on a single obsession: to capture the mystery of night. Each fragrance is composed by hand in small batches, using rare oud, Bulgarian rose and Madagascan vanilla, and rests for ninety days before it is bottled in hand-blown crystal.</p>
            <p style={{ marginTop: "1.4rem" }}>Restraint is our signature. Nothing superfluous — only depth, warmth, and a trace of gold.</p>
          </Fade>
        </div>
      </section>

      <section id="collection" className="collection">
        <Fade><p className="eyebrow">The Collection</p></Fade>
        <h2 className="serif"><Words text="Four portraits of the night." /></h2>
        <div className="grid">
          {fragrances.map((f, i) => (
            <Fade key={f.n} delay={i * 0.12}>
              <motion.article className="card" whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
                <div className="num serif">{f.n}</div>
                <h3 className="serif">{f.name}</h3>
                <div className="notes"><span className="dot" style={{ background: f.c }} />{f.notes}</div>
                <p>{f.desc}</p>
                <div className="price"><span>50 ML</span><span style={{ color: "var(--gold)" }}>{f.price}</span></div>
              </motion.article>
            </Fade>
          ))}
        </div>
      </section>

      <footer id="contact">
        <div className="fgrid">
          <div>
            <div className="serif gold" style={{ fontSize: "2.4rem", letterSpacing: "0.4em" }}>NOIRÉ</div>
            <p style={{ color: "var(--mist)", marginTop: "1.2rem", maxWidth: "20rem", lineHeight: 1.9, fontSize: ".9rem" }}>Maison de parfum. Rare essences, bottled in darkness.</p>
          </div>
          <div><h4>Explore</h4><a href="#story">Maison</a><a href="#collection">Collection</a><a href="#">Boutiques</a></div>
          <div><h4>Care</h4><a href="#">Shipping</a><a href="#">Returns</a><a href="#">Contact</a></div>
          <div>
            <h4>Letters from the Maison</h4>
            <form className="sub-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" aria-label="Email" />
              <button type="submit">JOIN</button>
            </form>
          </div>
        </div>
        <div className="legal"><span>© 2026 NOIRÉ PARIS. ALL RIGHTS RESERVED.</span><span>PRIVACY · TERMS</span></div>
      </footer>
    </main>
  );
}
