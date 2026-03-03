import Link from 'next/link';
import { getLocale } from '@/lib/locale';
import { getDictionary } from '@/lib/dictionaries';

export default async function Home() {
  const locale = await getLocale();
  const d = getDictionary(locale);
  const h = d.home;

  const taglineLines = h.tagline.split('\n');

  return (
    <main className="container">

      {/* ── Hero ── */}
      <section className="hero">
        <h1>{h.title}</h1>
        <p className="tagline">
          {taglineLines[0]}
          {taglineLines[1] && <><br /><span style={{ color: '#909090' }}>{taglineLines[1]}</span></>}
        </p>
      </section>

      {/* ── Reciprocity block ── */}
      <section className="reciprocity-section">
        <h2 className="reciprocity-title">{h.reciprocityTitle}</h2>
        <p className="reciprocity-text">{h.reciprocityText}</p>

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

        <Link href="/discover" className="button reciprocity-btn">
          {h.reciprocityBtn}
        </Link>
      </section>

      {/* ── Features ── */}
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

      {/* ── CTA ── */}
      <div className="cta">
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
      </div>

    </main>
  );
}
