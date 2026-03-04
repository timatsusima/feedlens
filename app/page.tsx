import Link from 'next/link';
import { getLocale } from '@/lib/locale';
import { getDictionary } from '@/lib/dictionaries';

export default async function Home() {
  const locale = await getLocale();
  const d = getDictionary(locale);
  const h = d.home;

  const taglineLines = h.tagline.split('\n');

  return (
    <main>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="hero-bubble">
        <div className="container">
          <h1 className="hero-bubble-title">{h.title}</h1>
          <p className="hero-bubble-tagline">
            {taglineLines[0]}
            {taglineLines[1] && <><br /><span>{taglineLines[1]}</span></>}
          </p>
          <div className="hero-bubble-actions">
            <Link href="/discover" className="button button-hero">
              {h.reciprocityBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bubble insight ──────────────────────────────────────────── */}
      <section className="bubble-section container">
        <h2 className="bubble-title">{h.bubbleTitle}</h2>
        <p className="bubble-text">{h.bubbleText}</p>

        <div className="bubble-compare">
          <div className="bubble-side bubble-inside">
            <div className="bubble-side-label">{h.bubbleLeftLabel}</div>
            <ul className="bubble-list">
              {h.bubbleLeftItems.map((item, i) => (
                <li key={i}>😔 {item}</li>
              ))}
            </ul>
          </div>

          <div className="bubble-divider">→</div>

          <div className="bubble-side bubble-outside">
            <div className="bubble-side-label">{h.bubbleRightLabel}</div>
            <ul className="bubble-list">
              {h.bubbleRightItems.map((item, i) => (
                <li key={i}>✨ {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <Link href="/discover" className="button bubble-cta-btn">
          {h.bubbleCta}
        </Link>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section className="how-section">
        <div className="container">
          <h2 className="how-title">{h.howTitle}</h2>
          <p className="how-subtitle">{h.reciprocityText}</p>

          <div className="reciprocity-steps">
            <div className="reciprocity-step">
              <div className="reciprocity-step-icon">📸</div>
              <div className="reciprocity-step-label">{h.reciprocityStep1Label}</div>
              <p className="reciprocity-step-text">{h.reciprocityStep1Text}</p>
            </div>
            <div className="reciprocity-arrow">→</div>
            <div className="reciprocity-step">
              <div className="reciprocity-step-icon">🔓</div>
              <div className="reciprocity-step-label">{h.reciprocityStep2Label}</div>
              <p className="reciprocity-step-text">{h.reciprocityStep2Text}</p>
            </div>
            <div className="reciprocity-arrow">→</div>
            <div className="reciprocity-step">
              <div className="reciprocity-step-icon">🔍</div>
              <div className="reciprocity-step-label">{h.reciprocityStep3Label}</div>
              <p className="reciprocity-step-text">{h.reciprocityStep3Text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section className="container">
        <div className="features">
          <div className="feature">
            <h3>{h.feature1Title}</h3>
            <p>{h.feature1Text}</p>
          </div>
          <div className="feature">
            <h3>{h.feature2Title}</h3>
            <p>{h.feature2Text}</p>
          </div>
          <div className="feature">
            <h3>{h.feature3Title}</h3>
            <p>{h.feature3Text}</p>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="cta container">
        <h2>{h.ctaTitle}</h2>
        <ol>
          <li>{h.ctaStep1}</li>
          <li>{h.ctaStep2}</li>
          <li>{h.ctaStep3}</li>
        </ol>
        <div className="cta-buttons">
          <Link href="/discover" className="button">
            {h.ctaDiscover}
          </Link>
          <a
            href="https://github.com/yourusername/feedlens"
            target="_blank"
            rel="noopener noreferrer"
            className="button button-outline"
          >
            {h.ctaGithub}
          </a>
        </div>
      </section>

    </main>
  );
}
