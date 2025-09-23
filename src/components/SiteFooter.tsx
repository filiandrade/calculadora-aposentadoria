import React from "react";

export default function SiteFooter() {
  return (
    <footer
      className="mt-10 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80"
      style={{ borderColor: "#e6e8eb" }}
    >
      <div
        className="mx-auto px-4 py-4"
        style={{ maxWidth: 1100, color: "#667", fontSize: 14, lineHeight: 1.6 }}
      >
        © Minhas Calculadoras — v1.0 beta ·{" "}
        <a href="/politica-privacidade.html" style={{ color: "#165788", textDecoration: "none" }}>
          Política de Privacidade
        </a>{" "}
        ·{" "}
        <a href="/termos-de-uso.html" style={{ color: "#165788", textDecoration: "none" }}>
          Termos de Uso
        </a>
      </div>
    </footer>
  );
}
