import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider }           from './context/AuthContext'
import { ToastProvider }          from './components/ui/Toast'
import { ProtectedRoute }         from './components/layout/ProtectedRoute'
import { AppShell }               from './components/layout/AppShell'
import { SplashScreen }           from './components/screens/SplashScreen'
import { LoginScreen }            from './components/screens/LoginScreen'
import { RegisterScreen }         from './components/screens/RegisterScreen'
import { OnboardingScreen }       from './components/screens/OnboardingScreen'
import { HomeFeedScreen }         from './components/screens/HomeFeedScreen'
import { PostDetailScreen }       from './components/screens/PostDetailScreen'
import { StoriesScreen }          from './components/screens/StoriesScreen'
import { ProfileScreen }          from './components/screens/ProfileScreen'
import { MessagesScreen }         from './components/screens/MessagesScreen'
import { NotificationsScreen }    from './components/screens/NotificationsScreen'
import { SearchScreen }           from './components/screens/SearchScreen'
import { GroupsScreen }           from './components/screens/GroupsScreen'
import { SettingsScreen }         from './components/screens/SettingsScreen'
import { useUIStore }             from './stores/uiStore'

export default function App() {
  const { theme, language, isRTL } = useUIStore()

  // Initialize theme and language on mount
  useEffect(() => {
    const root = document.documentElement
    
    // Apply theme
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Apply language and direction
    root.setAttribute('lang', language)
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
  }, [theme, language, isRTL])

  return (
    <BrowserRouter>
      {/*
        AuthProvider must sit inside BrowserRouter so it can call useNavigate()
        when signing out.
      */}
      <AuthProvider>
        <ToastProvider>
          <Routes>
          {/* ── Public routes (no shell, no auth required) ── */}
          <Route path="/"           element={<SplashScreen />} />
          <Route path="/login"      element={<LoginScreen />} />
          <Route path="/register"   element={<RegisterScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />

          {/* Stories is protected but uses no AppShell */}
          <Route
            path="/stories"
            element={
              <ProtectedRoute>
                <StoriesScreen />
              </ProtectedRoute>
            }
          />

          {/* ── Protected routes wrapped in AppShell ── */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <AppShell><HomeFeedScreen /></AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/post/:id"
            element={
              <ProtectedRoute>
                <AppShell><PostDetailScreen /></AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppShell><ProfileScreen /></AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <AppShell><ProfileScreen /></AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <AppShell><MessagesScreen /></AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <AppShell><NotificationsScreen /></AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <AppShell><SearchScreen /></AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <AppShell><GroupsScreen /></AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppShell><SettingsScreen /></AppShell>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
