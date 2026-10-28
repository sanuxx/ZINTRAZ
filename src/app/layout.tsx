import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientEffects from "@/components/ui/ClientEffects";
import TextFold from "@/components/ui/TextFold";
import { BASE_PATH } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://sanuxx.github.io/ZYNTRAZ/"),
  title: { default: "Zintraz — Business transformation, engineered.", template: "%s — Zintraz" },
  description:
    "Zintraz is a business transformation engineering company in Sri Lanka. We understand how your business works, then build the software, AI, data and automation it needs. Start a transformation assessment.",
  // The full wordmark is a wide rectangle — squished into a browser tab's square favicon slot it
  // reads as an illegible sliver, so the tab icon uses just the arrow accent cropped from it instead.
  icons: { icon: `${BASE_PATH}/zyntraz-mark.png` },
  openGraph: {
    title: "Zintraz — Business transformation, engineered.",
    description: "Business transformation engineering: business analysis, software development, AI & automation, data and custom systems.",
    images: ["/zyntraz-logo.png"],
  },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

// Runs before first paint: play the logo intro once per session, never for reduced-motion users.
const INTRO_SCRIPT = `(function(){var d=document.documentElement;
try{if(localStorage.getItem("zyn-motion")==="reduced"){d.classList.add("rm");var mm=window.matchMedia.bind(window);
window.matchMedia=function(q){if(q.indexOf("prefers-reduced-motion")<0)return mm(q);var base=q.split(" and ").filter(function(x){return x.indexOf("prefers-reduced-motion")<0}).join(" and ").trim();
var ok=/reduce/.test(q)&&!/no-preference/.test(q);var m=ok&&(!base||mm(base).matches);
return{matches:m,media:q,onchange:null,addListener:function(){},removeListener:function(){},addEventListener:function(){},removeEventListener:function(){},dispatchEvent:function(){return false}}}}}catch(e){}
try{var seen=sessionStorage.getItem("zyn-intro");var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;if(seen||reduce){d.classList.add("intro-skip","is-ready")}else{sessionStorage.setItem("zyn-intro","1");d.classList.add("intro-active")}}catch(e){d.classList.add("intro-skip","is-ready")}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <ClientEffects />
        <TextFold />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
