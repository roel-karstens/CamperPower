import { useEffect, useMemo, useState } from 'react'

type RoutePath =
  | '/'
  | '/methodology'
  | '/privacy'
  | '/affiliate-disclosure'
  | '/image-credits'
  | '/sources'
  | '/contact'

const ROUTES: RoutePath[] = [
  '/',
  '/methodology',
  '/privacy',
  '/affiliate-disclosure',
  '/image-credits',
  '/sources',
  '/contact',
]

type Device = {
  key: string
  label: string
  defaultWh: number
}

const DEVICE_BASELINE: Device[] = [
  { key: 'fridge', label: 'Compressor fridge', defaultWh: 480 },
  { key: 'lights', label: 'LED lighting', defaultWh: 120 },
  { key: 'laptop', label: 'Laptop + phone charging', defaultWh: 240 },
  { key: 'pump', label: 'Water pump', defaultWh: 60 },
  { key: 'comfort', label: 'Ventilation / heater fan', defaultWh: 300 },
]

const SOURCE_ITEMS = [
  {
    title: 'Dutch saldering update timelines and impact assumptions',
    href: 'https://www.rijksoverheid.nl',
  },
  {
    title: 'Industry references for camper lithium and charging compatibility',
    href: 'https://www.camperforum.nl',
  },
  {
    title: 'Technical assumptions from CamperPower niche analysis',
    href: 'https://github.com/roel-karstens/CamperPower/tree/main/docs/product',
  },
]

const IMAGE_CREDITS = [
  {
    file: 'hero-camper-interior.jpg',
    section: 'Homepage hero',
    creator: 'Jonathan Bean',
    source: 'https://unsplash.com/photos/9v9Wf0h1g8M',
    license: 'Unsplash License',
  },
  {
    file: 'battery-bay-detail.jpg',
    section: 'Configurator support card',
    creator: 'Waldemar',
    source: 'https://unsplash.com/photos/K6R8N4Y8xYU',
    license: 'Unsplash License',
  },
  {
    file: 'solar-camper-roof.jpg',
    section: 'Knowledge section card',
    creator: 'Avi Richards',
    source: 'https://unsplash.com/photos/Zj9X7P7z0A4',
    license: 'Unsplash License',
  },
]

const formatNumber = (value: number): string => new Intl.NumberFormat('nl-NL').format(value)

function App() {
  const [route, setRoute] = useState<RoutePath>(() => {
    const path = (window.location.hash.replace('#', '') || '/') as RoutePath
    return ROUTES.includes(path) ? path : '/'
  })

  const [loads, setLoads] = useState<Record<string, number>>(() =>
    Object.fromEntries(DEVICE_BASELINE.map((device) => [device.key, device.defaultWh])),
  )
  const [autonomyDays, setAutonomyDays] = useState(2)
  const [useSolar, setUseSolar] = useState(true)
  const [useDriveCharging, setUseDriveCharging] = useState(true)
  const [useShorePower, setUseShorePower] = useState(true)
  const [existingEbl, setExistingEbl] = useState<'unknown' | 'modern' | 'legacy'>('unknown')

  useEffect(() => {
    const onHashChange = () => {
      const path = (window.location.hash.replace('#', '') || '/') as RoutePath
      setRoute(ROUTES.includes(path) ? path : '/')
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (target: RoutePath): void => {
    if (target === route) {
      return
    }
    window.history.pushState({}, '', `#${target}`)
    setRoute(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const computed = useMemo(() => {
    const dailyWh = Object.values(loads).reduce((sum, current) => sum + current, 0)
    const usableBatteryFactor = 0.9
    const batteryAh = Math.ceil((dailyWh * autonomyDays) / (12.8 * usableBatteryFactor))

    const sunHours = 4
    const efficiency = 0.85
    const solarWp = Math.ceil(dailyWh / (sunHours * efficiency) / 25) * 25

    const mpptCurrent = Math.ceil(solarWp / 12)
    const dcdcCurrent = useDriveCharging
      ? Math.ceil(Math.max(20, Math.min(60, batteryAh / 8)) / 10) * 10
      : 0

    const maxCurrent = Math.max(mpptCurrent, dcdcCurrent || 0)
    const cableRecommendation =
      maxCurrent <= 20
        ? '6 mm2 cable + 30A fuse'
        : maxCurrent <= 30
          ? '10 mm2 cable + 40A fuse'
          : maxCurrent <= 45
            ? '16 mm2 cable + 60A fuse'
            : '25 mm2 cable + 80A fuse'

    const warnings: string[] = []
    if (!useSolar && !useDriveCharging && !useShorePower) {
      warnings.push('No charging source selected. This setup is not viable for off-grid use.')
    }
    if (existingEbl === 'legacy') {
      warnings.push(
        'Legacy EBL or charger profile detected. Lithium compatibility must be validated before install.',
      )
    }
    if (dailyWh > 2500) {
      warnings.push(
        'High daily load. Verify alternator limits, ventilation, and thermal constraints with an installer.',
      )
    }
    if (autonomyDays >= 4 && !useSolar) {
      warnings.push('High autonomy without solar input significantly increases battery and charging risk.')
    }

    const confidence =
      warnings.length === 0 ? 'High confidence' : warnings.length <= 2 ? 'Medium confidence' : 'Review required'

    return {
      dailyWh,
      batteryAh,
      solarWp,
      mpptCurrent,
      dcdcCurrent,
      cableRecommendation,
      warnings,
      confidence,
    }
  }, [loads, autonomyDays, useSolar, useDriveCharging, useShorePower, existingEbl])

  const renderLink = (label: string, target: RoutePath) => (
    <button
      type="button"
      className={`nav-link ${route === target ? 'nav-link-active' : ''}`}
      onClick={() => navigate(target)}
    >
      {label}
    </button>
  )

  const renderHome = () => (
    <>
      <header className="hero-block">
        <div className="hero-copy">
          <p className="eyebrow">Independent 12V System Planner</p>
          <h1>Build your camper power setup with clear numbers, not guesswork.</h1>
          <p className="hero-subtitle">
            CamperPower turns daily usage into a practical battery, solar, charging and protection plan with
            compatibility and safety checks built in.
          </p>
          <div className="hero-cta-group">
            <a className="button button-primary" href="#configurator">
              Open configurator
            </a>
            <button type="button" className="button button-secondary" onClick={() => navigate('/methodology')}>
              See methodology
            </button>
          </div>
          <div className="trust-badges">
            <span>Transparent assumptions</span>
            <span>Independent recommendations</span>
            <span>Affiliate disclosure always visible</span>
          </div>
        </div>
        <figure className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1501706362039-c6e80948f46f?auto=format&fit=crop&w=1400&q=80"
            alt="Camper interior with practical lighting and power setup"
            loading="eager"
          />
          <figcaption>Decision support for real-world off-grid travel and upgrades.</figcaption>
        </figure>
      </header>

      <section className="section section-insight">
        <article className="insight-card">
          <h2>One calculator, full system view</h2>
          <p>
            Start from Wh/day and autonomy. We map this into battery size, solar target, charge controllers,
            cable and fuse ranges.
          </p>
        </article>
        <article className="insight-card">
          <h2>Compatibility before checkout</h2>
          <p>
            Legacy EBL and charger combinations are flagged early so users avoid expensive mismatches and
            installation risk.
          </p>
        </article>
        <article className="insight-card">
          <h2>Safety gates, not vague advice</h2>
          <p>
            High-risk recommendations include visible warnings and clear boundaries. We never present this as
            mains wiring instructions.
          </p>
        </article>
      </section>

      <section id="configurator" className="section configurator-layout">
        <div className="configurator-panel">
          <h2>CamperPower Configurator</h2>
          <p className="panel-subtitle">From usage to bill of materials in under 5 minutes.</p>

          <fieldset className="field-group">
            <legend>1. Daily energy usage (Wh/day)</legend>
            {DEVICE_BASELINE.map((device) => (
              <label key={device.key} className="input-row">
                <span>{device.label}</span>
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={loads[device.key]}
                  onChange={(event) => {
                    const next = Math.max(0, Number(event.target.value) || 0)
                    setLoads((prev) => ({ ...prev, [device.key]: next }))
                  }}
                />
              </label>
            ))}
          </fieldset>

          <fieldset className="field-group">
            <legend>2. Autonomy and charging profile</legend>
            <label className="input-row">
              <span>Days without shore power</span>
              <input
                type="number"
                min={1}
                max={7}
                value={autonomyDays}
                onChange={(event) => {
                  const next = Number(event.target.value)
                  setAutonomyDays(Number.isNaN(next) ? 2 : Math.max(1, Math.min(7, next)))
                }}
              />
            </label>

            <div className="checkbox-grid">
              <label>
                <input type="checkbox" checked={useSolar} onChange={() => setUseSolar((prev) => !prev)} /> Solar
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={useDriveCharging}
                  onChange={() => setUseDriveCharging((prev) => !prev)}
                />
                DC-DC while driving
              </label>
              <label>
                <input type="checkbox" checked={useShorePower} onChange={() => setUseShorePower((prev) => !prev)} />
                Shore power
              </label>
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>3. Existing charger / EBL profile</legend>
            <select value={existingEbl} onChange={(event) => setExistingEbl(event.target.value as typeof existingEbl)}>
              <option value="unknown">Unknown</option>
              <option value="modern">Modern lithium-ready setup</option>
              <option value="legacy">Legacy setup (pre-lithium)</option>
            </select>
          </fieldset>
        </div>

        <aside className="result-panel" aria-live="polite">
          <h3>Your system recommendation</h3>
          <p className="confidence-tag">{computed.confidence}</p>
          <dl className="result-grid">
            <div>
              <dt>Daily usage</dt>
              <dd>{formatNumber(computed.dailyWh)} Wh</dd>
            </div>
            <div>
              <dt>Battery target</dt>
              <dd>{formatNumber(computed.batteryAh)} Ah LiFePO4</dd>
            </div>
            <div>
              <dt>Solar target</dt>
              <dd>{formatNumber(computed.solarWp)} Wp</dd>
            </div>
            <div>
              <dt>MPPT rating</dt>
              <dd>{formatNumber(computed.mpptCurrent)} A</dd>
            </div>
            <div>
              <dt>DC-DC rating</dt>
              <dd>{computed.dcdcCurrent > 0 ? `${formatNumber(computed.dcdcCurrent)} A` : 'Not selected'}</dd>
            </div>
            <div>
              <dt>Protection baseline</dt>
              <dd>{computed.cableRecommendation}</dd>
            </div>
          </dl>

          <h4>Bill of materials classes</h4>
          <ul className="bom-list">
            <li>LiFePO4 battery bank ({formatNumber(computed.batteryAh)} Ah class)</li>
            <li>Solar array ({formatNumber(computed.solarWp)} Wp class)</li>
            <li>MPPT controller ({formatNumber(computed.mpptCurrent)} A)</li>
            <li>{computed.dcdcCurrent > 0 ? `DC-DC charger (${computed.dcdcCurrent} A)` : 'Optional DC-DC charger'}</li>
            <li>Fuse + cable package ({computed.cableRecommendation})</li>
          </ul>

          {computed.warnings.length > 0 && (
            <div className="warning-box">
              <h4>Compatibility and safety checks</h4>
              <ul>
                {computed.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="result-note">
            Not installation advice. Final cable routes, protection strategy and legacy compatibility should be
            reviewed by a qualified professional.
          </p>
        </aside>
      </section>

      <section className="section editorial-grid">
        <article className="story-card story-card-large">
          <img
            src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80"
            alt="Camper roof with solar modules at sunset"
            loading="lazy"
          />
          <div>
            <h3>What changes in 2027 and why timing matters</h3>
            <p>
              Savings logic changes when energy regulation shifts. CamperPower keeps assumptions visible and
              timestamped so recommendations can be updated without hidden model drift.
            </p>
          </div>
        </article>
        <article className="story-card">
          <img
            src="https://images.unsplash.com/photo-1581092715399-0afb9d4f6f79?auto=format&fit=crop&w=900&q=80"
            alt="Battery and cable hardware detail"
            loading="lazy"
          />
          <div>
            <h3>Compatibility first</h3>
            <p>Legacy systems need explicit checks before lithium upgrades.</p>
          </div>
        </article>
        <article className="story-card">
          <img
            src="https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?auto=format&fit=crop&w=900&q=80"
            alt="Roadside camper near mountain landscape"
            loading="lazy"
          />
          <div>
            <h3>Planning confidence</h3>
            <p>Start with outcomes and risk boundaries before buying components.</p>
          </div>
        </article>
      </section>
    </>
  )

  const renderMethodology = () => (
    <section className="page-block">
      <h1>Methodology</h1>
      <p>
        CamperPower uses a transparent calculation flow: user load profile, autonomy target, charging source
        assumptions, then compatibility and safety checks. Each recommendation is explainable and versioned.
      </p>
      <h2>Core formulas</h2>
      <ul>
        <li>Battery sizing uses daily load, autonomy days, and usable depth assumptions.</li>
        <li>Solar sizing uses equivalent sun-hours and system-efficiency assumptions.</li>
        <li>Controller and cable classes are derived from resulting current ranges.</li>
      </ul>
      <h2>Boundaries</h2>
      <p>
        Outputs are decision support for low-voltage system planning. Final installation details, compliance,
        and verification belong with qualified professionals.
      </p>
    </section>
  )

  const renderPrivacy = () => (
    <section className="page-block">
      <h1>Privacy</h1>
      <p>
        CamperPower is designed to operate with minimal personal data. Calculator inputs are for immediate
        recommendations and should not require account creation for MVP.
      </p>
      <ul>
        <li>No sale of personal data.</li>
        <li>Analytics should be aggregated and event-based.</li>
        <li>Policy updates will be date-stamped on this page.</li>
      </ul>
    </section>
  )

  const renderAffiliate = () => (
    <section className="page-block">
      <h1>Affiliate Disclosure</h1>
      <p>
        CamperPower can earn a commission when users click outbound product links and complete purchases. This
        does not increase user price in standard affiliate models.
      </p>
      <ul>
        <li>Recommendations are derived from explicit rules, not sponsor priority.</li>
        <li>Affiliate relationships are disclosed near relevant links.</li>
        <li>Method and assumptions remain publicly visible.</li>
      </ul>
    </section>
  )

  const renderImageCredits = () => (
    <section className="page-block">
      <h1>Image Credits</h1>
      <p>
        We use context-relevant images with clear rights and source references. Internal tracking follows
        CamperPower&apos;s image registry policy.
      </p>
      <table className="credits-table">
        <thead>
          <tr>
            <th>File</th>
            <th>Placement</th>
            <th>Creator</th>
            <th>Source</th>
            <th>License</th>
          </tr>
        </thead>
        <tbody>
          {IMAGE_CREDITS.map((item) => (
            <tr key={item.file}>
              <td>{item.file}</td>
              <td>{item.section}</td>
              <td>{item.creator}</td>
              <td>
                <a href={item.source} target="_blank" rel="noreferrer">
                  Source
                </a>
              </td>
              <td>{item.license}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )

  const renderSources = () => (
    <section className="page-block">
      <h1>Sources</h1>
      <p>
        Key public references used in CamperPower&apos;s strategy and assumptions are listed below. A deeper source
        log lives in the project documentation repository.
      </p>
      <ul>
        {SOURCE_ITEMS.map((source) => (
          <li key={source.href}>
            <a href={source.href} target="_blank" rel="noreferrer">
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )

  const renderContact = () => (
    <section className="page-block">
      <h1>Contact</h1>
      <p>
        For partnership, methodology, or correction requests, contact the CamperPower team through the project
        repository discussions or issue tracker.
      </p>
      <p>
        <a href="https://github.com/roel-karstens/CamperPower" target="_blank" rel="noreferrer">
          Open CamperPower on GitHub
        </a>
      </p>
    </section>
  )

  const pageContent = () => {
    switch (route) {
      case '/':
        return renderHome()
      case '/methodology':
        return renderMethodology()
      case '/privacy':
        return renderPrivacy()
      case '/affiliate-disclosure':
        return renderAffiliate()
      case '/image-credits':
        return renderImageCredits()
      case '/sources':
        return renderSources()
      case '/contact':
        return renderContact()
      default:
        return renderHome()
    }
  }

  return (
    <div className="app-shell">
      <div className="bg-orb bg-orb-left" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-right" aria-hidden="true"></div>

      <nav className="top-nav">
        <button type="button" className="brand" onClick={() => navigate('/')}>
          CamperPower
        </button>
        <div className="nav-links">
          {renderLink('Methodology', '/methodology')}
          {renderLink('Sources', '/sources')}
          {renderLink('Contact', '/contact')}
        </div>
      </nav>

      <main className="main-content">{pageContent()}</main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h4>CamperPower</h4>
            <p>Independent 12V planning and compatibility guidance for safer off-grid upgrades.</p>
          </div>
          <div className="footer-links">
            <button type="button" onClick={() => navigate('/methodology')}>
              Methodology
            </button>
            <button type="button" onClick={() => navigate('/privacy')}>
              Privacy
            </button>
            <button type="button" onClick={() => navigate('/affiliate-disclosure')}>
              Affiliate disclosure
            </button>
            <button type="button" onClick={() => navigate('/image-credits')}>
              Image credits
            </button>
            <button type="button" onClick={() => navigate('/sources')}>
              Sources
            </button>
            <button type="button" onClick={() => navigate('/contact')}>
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
