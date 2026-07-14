import { Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import ModuleHome from './pages/ModuleHome'
import Flashcards from './pages/Flashcards'
import Quiz from './pages/Quiz'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'

export default function App() {
  const location = useLocation()
  const hideNav = /\/(flashcards|quiz|login|register|admin)$/.test(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <Admin />
            </RequireAuth>
          }
        />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/module/:moduleId"
          element={
            <RequireAuth>
              <ModuleHome />
            </RequireAuth>
          }
        />
        <Route
          path="/module/:moduleId/flashcards"
          element={
            <RequireAuth>
              <Flashcards />
            </RequireAuth>
          }
        />
        <Route
          path="/module/:moduleId/quiz"
          element={
            <RequireAuth>
              <Quiz />
            </RequireAuth>
          }
        />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  )
}
