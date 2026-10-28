"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <section
      className="mesh-section"
      style={{
        padding: "100px 24px",
        background: "linear-gradient(160deg, #080318 0%, #0d0a35 50%, #050d20 100%)",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Animated orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700, height: 500, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(79,110,247,0.4) 0%, rgba(139,92,246,0.25) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute", top: "30%", right: "10%",
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            position: "absolute", bottom: "20%", left: "10%",
            width: 350, height: 350, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Glass card wrapper */}
          <div
            className="glass-dark"
            style={{
              borderRadius: 28, padding: "52px 48px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16, background: "linear-gradient(135deg, #4f6ef7, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Let&apos;s build together
            </p>
            <h2 style={{
              fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 700, letterSpacing: "-0.04em",
              lineHeight: 1.05, color: "#fff", marginBottom: 20,
            }}>
              Ready to build something exceptional?
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 36 }}>
              Free consultation, no commitment. We&apos;ll scope your project and tell you exactly what&apos;s possible.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="#contact"
                className="btn-primary"
                style={{
                  fontSize: 15, fontWeight: 600, color: "#fff",
                  textDecoration: "none", padding: "14px 32px", borderRadius: 999, display: "inline-block",
                }}
              >
                Start a project
              </Link>
              <Link
                href="mailto:hello@zintraz.com"
                className="btn-glass"
                style={{
                  fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.8)",
                  textDecoration: "none", padding: "14px 32px", borderRadius: 999, display: "inline-block",
                }}
              >
                hello@zintraz.com
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
