import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center", margin: "16px 0" }}
      data-ad-client="ca-pub-2807386492616114"
      data-ad-slot="YOUR_SLOT_ID"   /* substitua pelo slot gerado no AdSense */
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
