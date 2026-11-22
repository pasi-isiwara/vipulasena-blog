'use client';

/* The home page: introduction, the four collection cards, the citation notice
   and the question form. Generated from the prototype by scripts/build-home.mjs
   so the markup and artwork stay identical - edit that script, not this file. */

import Link from 'next/link';
import Image from 'next/image';
import { usePrefs } from '@/lib/prefs';
import { HeroArt } from '@/components/art/HeroArt';
import { BandArt } from '@/components/art/BandArt';
import { AskForm } from '@/components/AskForm';

export function HomeContent() {
  const { t } = usePrefs();

  return (
    <div id="home-view">

        {/* ===== Introduction ===== */}
        <section className="hero" id="top">
          <div className="wrap">

            <div className="byline">
              <div className="portrait">
                <div className="portrait-frame">
                  <div className="orbit" aria-hidden="true"></div>
                  <div className="portrait-offset rise d3" aria-hidden="true"></div>
                  <div className="portrait-photo">
                    <Image src="/portrait.jpg" alt={t('altPortrait')} width="300" height="300" priority />
                  </div>
                </div>
              </div>

              <div className="intro">
                <h1 className="rise d1">{t('name')}</h1>
                <span className="rule" aria-hidden="true"></span>
                <p className="role rise d2" dangerouslySetInnerHTML={{ __html: t('role') }} />
                <ul className="quals rise d3" aria-label={t('ariaQuals')}>
                  <li>BSc</li>
                  <li>PGDE</li>
                  <li>MA</li>
                </ul>
              </div>

              <p className="bio-lead rise d4">{t('bio1')}</p>

              {/* Background art: orbits, a molecule and a leafy branch */}
              <HeroArt />
            </div>

            <div className="bio rise d5">
              <p>{t('bio2')}</p>
            <div className="actions">
              <a className="btn" href="#collections">{t('explore')}</a>
              <a className="text-link" href="#cite">{t('howCite')}</a>
            </div>
            </div>

          </div>

          <a className="scroll-cue" href="#collections" aria-label={t('ariaScrollCue')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </a>
        </section>

        {/* ===== Collections ===== */}
        <section className="collections" id="collections">
         <BandArt />
         <div className="wrap">
          <div className="section-head">
            <h2>{t('explore')}</h2>
            <p>{t('colIntro')}</p>
          </div>

          <div className="grid">

            <Link className="card card--feature" href="/education">
              <svg className="card-art" viewBox="0 0 200 200" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle className="lg" cx="100" cy="100" r="92" strokeDasharray="2 6" />
                <circle className="ln" cx="100" cy="100" r="72" />
                <g className="spinning">
                  <ellipse className="lg" cx="100" cy="100" rx="56" ry="20" />
                  <ellipse className="lg" cx="100" cy="100" rx="56" ry="20" transform="rotate(60 100 100)" />
                  <ellipse className="lg" cx="100" cy="100" rx="56" ry="20" transform="rotate(120 100 100)" />
                  <circle className="dot" cx="156" cy="100" r="3.5" />
                  <circle className="dot" cx="72" cy="52" r="2.5" />
                </g>
                <circle className="dot" cx="100" cy="100" r="6" />
              </svg>
              <div className="card-top">
                <span className="icon" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1.6" /><ellipse cx="12" cy="12" rx="10" ry="4.2" /><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" /></svg>
                </span>
                <h3>{t('navEdu')}</h3>
                <p>{t('eduDesc')}</p>
                <ul className="chips">
                  <li>{t('chipArticles')}</li>
                  <li>{t('chipTeaching')}</li>
                  <li>{t('chipCurriculum')}</li>
                </ul>
              </div>
              <span className="card-foot">
                <span className="more">{t('eduMore')}</span>
                <span className="go" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              </span>
            </Link>

            <Link className="card card--sand" href="/academic-posts">
              <svg className="card-art" viewBox="0 0 200 200" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect className="ln" x="60" y="42" width="96" height="124" rx="6" transform="rotate(8 108 104)" />
                <rect className="ln" x="48" y="34" width="96" height="124" rx="6" />
                <path className="ln" d="M64 60h64M64 74h50M64 88h58" />
                <path className="lg" d="M66 140v-14M84 140v-26M102 140v-20M120 140v-38" />
                <path className="lg" d="M60 142h70" />
                <circle className="dot" cx="120" cy="98" r="3" />
              </svg>
              <span className="icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6" /><path d="M9 17h4" /></svg>
              </span>
              <h3>{t('navAcad')}</h3>
              <p>{t('acadDesc')}</p>
              <ul className="chips">
                <li>{t('chipResearch')}</li>
                <li>{t('chipCommentary')}</li>
              </ul>
              <span className="card-foot">
                <span className="more">{t('acadMore')}</span>
                <span className="go" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              </span>
            </Link>

            <Link className="card card--sage" href="/childrens-books">
              <svg className="card-art" viewBox="0 0 200 200" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path className="ln" d="M100 156c-14-10-34-15-62-15V61c28 0 48 5 62 15 14-10 34-15 62-15v80c-28 0-48 5-62 15z" />
                <path className="ln" d="M100 76v80" />
                <path className="lg" d="M56 84c12 0 22 2 30 6M56 100c12 0 22 2 30 6M114 90c8-4 18-6 30-6M114 106c8-4 18-6 30-6" />
                <path className="lg" d="M100 20l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
                <path className="lg" d="M152 28a13 13 0 1 0 11 19 11 11 0 0 1-11-19z" />
                <circle className="dot" cx="62" cy="36" r="2.5" />
                <circle className="dot" cx="132" cy="52" r="2" />
              </svg>
              <span className="icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.5C10.3 5.2 7.8 4.5 4 4.5v13c3.8 0 6.3.7 8 2 1.7-1.3 4.2-2 8-2v-13c-3.8 0-6.3.7-8 2z" /><path d="M12 6.5v13" /></svg>
              </span>
              <h3>{t('navKids')}</h3>
              <p>{t('kidsDesc')}</p>
              <ul className="chips">
                <li>{t('chipStories')}</li>
                <li>{t('chipYoung')}</li>
              </ul>
              <span className="card-foot">
                <span className="more">{t('kidsMore')}</span>
                <span className="go" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              </span>
            </Link>

            <Link className="card card--wide" href="/media">
              <svg className="card-art" viewBox="0 0 200 200" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect className="ln" x="36" y="66" width="128" height="88" rx="12" />
                <path className="ln" d="M70 66l10-16h40l10 16" />
                <circle className="lg" cx="100" cy="110" r="26" />
                <circle className="ln" cx="100" cy="110" r="14" />
                <circle className="dot" cx="146" cy="82" r="3.5" />
                <path className="lg" d="M172 34l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" />
                <path className="lg" d="M28 44l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
              </svg>
              <span className="icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13" r="3.5" /></svg>
              </span>
              <h3>{t('navMedia')}</h3>
              <p>{t('mediaDesc')}</p>
              <ul className="chips">
                <li>{t('chipRecent')}</li>
                <li>{t('chipNew')}</li>
                <li>{t('chipLeisure')}</li>
              </ul>
              <span className="card-foot">
                <span className="more">{t('mediaMore')}</span>
                <span className="go" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              </span>
            </Link>

          </div>
         </div>
        </section>

        {/* ===== Free-use notice ===== */}
        <section className="notice wrap" id="cite">
          <div className="notice-panel">
            <div className="notice-text">
              <span className="notice-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h4v4c0 3-1.5 5-4 6" /><path d="M14 7h4v4c0 3-1.5 5-4 6" /></svg>
              </span>
              <h2>{t('freeTitle')}</h2>
              <p>{t('freeText')}</p>
            </div>
            <figure className="citation">
              <figcaption>{t('citeLabel')}</figcaption>
              <p className="cite-text" dangerouslySetInnerHTML={{ __html: t('citeText') }} />
              <p className="hint">{t('citeHint')}</p>
            </figure>
          </div>
        </section>

        {/* ===== Ask a question ===== */}
        <section className="ideas wrap" id="ask">
          <div className="ideas-panel">
            <div className="ideas-text">
              <span className="notice-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6" /><path d="M12 17h.01" /></svg>
              </span>
              <h2>{t('askTitle')}</h2>
              <p>{t('askText')}</p>
              <p className="ask-direct">{t('askDirect')}</p>
              <ul className="contact-links">
                <li><a href="tel:+94774903995"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg><span>+94 77 490 3995</span></a></li>
                <li><a href="mailto:vipulasena.pathiraja@gmail.com"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg><span>vipulasena.pathiraja@gmail.com</span></a></li>
              </ul>
            </div>
            <AskForm />
          </div>
        </section>

    </div>
  );
}
