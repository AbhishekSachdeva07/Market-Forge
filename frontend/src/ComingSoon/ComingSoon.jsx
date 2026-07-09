import Countdown from "react-countdown";
import { Helmet } from "react-helmet-async";
import "./ComingSoon.css";

const CountdownBox = ({ value, label }) => (
  <div className="count-box">
    <h2>{String(value).padStart(2, "0")}</h2>
    <span>{label}</span>
  </div>
);

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <h2 className="launch-text">🚀 We're Live!</h2>;
  }

  return (
    <div className="countdown">
      <CountdownBox value={days} label="Days" />
      <CountdownBox value={hours} label="Hours" />
      <CountdownBox value={minutes} label="Minutes" />
      <CountdownBox value={seconds} label="Seconds" />
    </div>
  );
};

export default function ComingSoon() {
  return (
    <>
      <Helmet>
        <title>
          Simulated Market Data API for Students & Developers | Market Forge
        </title>

        <meta
          name="description"
          content="Market Forge provides realistic simulated stock market data through APIs for students, educators, and developers. Build, test, and learn using synthetic financial market data without relying on live exchanges."
        />

        <meta
          name="keywords"
          content="simulated market data, stock market API, simulated stock data, market data API, financial data API, synthetic market data, finance education, developer API"
        />

        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Market Forge | Simulated Market Data API"
        />

        <meta
          property="og:description"
          content="Access realistic simulated stock market data via API for education, testing, and software development."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://marketdatasimulator.netlify.app"
        />

        <meta
          property="og:image"
          content="https://marketdatasimulator.netlify.app/og-image.png"
        />

        {/* Twitter */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="Market Forge | Simulated Market Data API"
        />

        <meta
          name="twitter:description"
          content="Realistic simulated stock market data API for students, educators, and developers."
        />

        <meta
          name="twitter:image"
          content="https://marketdatasimulator.netlify.app/og-image.png"
        />

        <link
          rel="canonical"
          href="https://marketdatasimulator.netlify.app"
        />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Market Forge",
              "url": "https://yourdomain.com",
              "description": "Simulated Market Data API for students, educators, and developers.",
              "publisher": {
                "@type": "Organization",
                "name": "Market Forge"
              }
            }
          `}
  </script>
      </Helmet>

      <section className="coming-container">
        <div className="glass-card">
          <p className="logo">Simulated Market Data</p>

          <h1>Coming Soon</h1>

          <p className="subtitle">
            Realistic market data simulations built for students, educators,
            and developers.
          </p>

          <Countdown
            date={new Date("2026-09-30T23:59:59")}
            renderer={renderer}
          />

          <div className="features">
            <p>📈 Simulated stock prices with realistic market movements.</p>

            <p>🔑 API access for projects, learning, and experimentation.</p>

            <p>📚 Educational resources to understand financial markets.</p>

            <p>🎓 Built for students, universities, and developers.</p>
          </div>
        </div>
      </section>
    </>
  );
}