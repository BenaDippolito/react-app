import React from "react";

export default function Home() {
  return (
    <section className="page home-page">
      <div className="home-hero">
        {/* decorative animated gradient background */}
        <div className="animated-gradient" aria-hidden="true" />

        {/* content sits above the gradient */}
        <div
          className="header__description"
          style={{ position: "relative", zIndex: 1 }}></div>
      </div>
    </section>
  );
}
