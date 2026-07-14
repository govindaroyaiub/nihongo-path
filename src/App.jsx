import { Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import ModuleHome from './pages/ModuleHome'
import Flashcards from './pages/Flashcards'
import Quiz from './pages/Quiz'

export default function App() {
  const location = useLocation()
  const hideNav = /\/(flashcards|quiz)$/.test(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/module/:moduleId" element={<ModuleHome />} />
        <Route path="/module/:moduleId/flashcards" element={<Flashcards />} />
        <Route path="/module/:moduleId/quiz" element={<Quiz />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  )
}
