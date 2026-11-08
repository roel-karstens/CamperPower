import type { ComponentType } from 'react'
import { Footer, Header } from './components/Layout'
import { useRouter } from './lib/useRouter'
import { AccuLeegPage } from './pages/AccuLeeg'
import { ConfiguratorPage } from './pages/Configurator'
import { GuidePage, GuidesPage } from './pages/Guides'
import { HomePage } from './pages/Home'
import {
  ContactPage,
  ImageCreditsPage,
  MethodPage,
  MoneyPage,
  NotFoundPage,
  PrivacyPage,
  SourcesPage,
} from './pages/Info'
import { LithiumCheckPage } from './pages/LithiumCheck'
import { PowerstationPage } from './pages/Powerstation'

const ROUTES: Record<string, ComponentType> = {
  '/': HomePage,
  '/configurator': ConfiguratorPage,
  '/accu-leeg': AccuLeegPage,
  '/powerstation-of-vast': PowerstationPage,
  '/lithium-check': LithiumCheckPage,
  '/gidsen': GuidesPage,
  '/methode': MethodPage,
  '/bronnen': SourcesPage,
  '/beeldverantwoording': ImageCreditsPage,
  '/privacy': PrivacyPage,
  '/zo-verdienen-wij-geld': MoneyPage,
  '/contact': ContactPage,
}

function Page() {
  const { path } = useRouter()
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path
  const guide = clean.match(/^\/gidsen\/([a-z0-9-]+)$/)
  if (guide) return <GuidePage key={guide[1]} slug={guide[1]} />
  const Route = ROUTES[clean] ?? NotFoundPage
  return <Route key={clean} />
}

export function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Direct naar de inhoud
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Page />
      </main>
      <Footer />
    </>
  )
}
