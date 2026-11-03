import { Suspense, lazy, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import { BottomNav, SideNav } from './components/Nav'
import { DailyGoalCard, StreakCard, ReviewCard, XpTotalCard } from './components/Stats'
import { applyTheme } from './lib/store'
import Learn from './pages/Learn'

// Learn is the landing page and ships in the entry chunk; every other page
// loads on first visit (the service worker precaches them all for offline).
const Unit = lazy(() => import('./pages/Unit'))
const Lesson = lazy(() => import('./pages/Lesson'))
const Review = lazy(() => import('./pages/Review'))
const ReviewSession = lazy(() => import('./pages/Review').then((m) => ({ default: m.ReviewSession })))
const Practice = lazy(() => import('./pages/Practice'))
const Chart = lazy(() => import('./pages/Chart'))
const Library = lazy(() => import('./pages/Library'))
const GrammarDetail = lazy(() => import('./pages/GrammarDetail'))
const Settings = lazy(() => import('./pages/Settings'))
const Place = lazy(() => import('./pages/Place'))
const Stamps = lazy(() => import('./pages/Stamps'))

export default function App() {
  const location = useLocation()
  // Lessons and review sessions take the whole screen, without navigation.
  const focusMode = /^\/(lesson\/|review\/session)/.test(location.pathname)
  // The stats rail sits beside the main hubs on wide screens.
  const showRail = ['/', '/review', '/practice'].includes(location.pathname)

  useEffect(() => {
    applyTheme()
  }, [])
  // Reset scroll on navigation. A layout effect, so it runs before pages' own
  // effects (e.g. the map scrolling to your current lesson). Braces matter:
  // newer browsers return a Promise from scrollTo, which an effect must not return.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const routes = (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Learn />} />
        <Route path="/unit/:unitId" element={<Unit />} />
        <Route path="/lesson/:lessonId" element={<Lesson />} />
        <Route path="/review" element={<Review />} />
        <Route path="/review/session" element={<ReviewSession />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/chart" element={<Chart />} />
        <Route path="/practice/kana/:script" element={<OldChartRedirect />} />
        <Route path="/practice/library/:type" element={<Library />} />
        <Route path="/grammar/:itemId" element={<GrammarDetail />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/place/:unitId" element={<Place />} />
        <Route path="/map" element={<Stamps />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )

  if (focusMode) return <div className="min-h-[100svh] flex flex-col">{routes}</div>

  return (
    <div className="min-h-[100svh]">
      <SideNav />
      <div className="lg:pl-64 xl:pl-72">
        <div className="mx-auto max-w-6xl flex gap-8 px-4 sm:px-6 lg:px-10">
          <main className="flex-1 min-w-0 max-w-2xl mx-auto pb-28 lg:pb-12">{routes}</main>
          {showRail && (
            <aside className="hidden xl:flex flex-col gap-4 w-80 shrink-0 sticky top-0 self-start pt-8 pb-8 max-h-screen overflow-y-auto">
              <StreakCard />
              <DailyGoalCard />
              <ReviewCard />
              <XpTotalCard />
            </aside>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

// The old per-script chart pages now live on /chart.
function OldChartRedirect() {
  const { script } = useParams()
  return <Navigate to={`/chart?script=${script}`} replace />
}
