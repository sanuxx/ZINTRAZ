import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";
import FAQ from "@/components/sections/FAQ";

export const metadata: Metadata = {
  title: "Contact — start a transformation assessment",
  description: "No commitment. Talk to a Zyntraz architect about your operations, and where software, AI and automation will pay off first.",
};

export default function ContactPage() {
  return (
    <div className="page">
      <Contact />
      <FAQ />
    </div>
  );
}
