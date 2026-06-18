import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { SplashScreen }       from './components/screens/SplashScreen'
import { LoginScreen }        from './components/screens/LoginScreen'
import { RegisterScreen }     from './components/screens/RegisterScreen'
import { OnboardingScreen }   from './components/screens/OnboardingScreen'
import { HomeFeedScreen }     from './components/screens/HomeFeedScreen'
import { PostDetailScreen }   from './components/screens/PostDetailScreen'
import { StoriesScreen }      from './components/screens/StoriesScreen'
import { ProfileScreen }      from './components/screens/ProfileScreen'
import { MessagesScreen }     from './components/screens/MessagesScreen'
import { NotificationsScreen } from './components/screens/NotificationsScreen'
import { SearchScreen }       from './components/screens/SearchScreen'
import { GroupsScreen }       from './components/screens/GroupsScreen'
import { SettingsScreen }     from './components/screens/SettingsScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public — no shell */}
        <Route path="/"           element={<SplashScreen />} />
        <Route path="/login"      element={<LoginScreen />} />
        <Route path="/register"   element={<RegisterScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/stories"    element={<StoriesScreen />} />

        {/* App — with shell */}
        <Route element={<AppShell><Navigate to="/home" /></AppShell>} path="/app" />
        <Route path="/home"          element={<AppShell><HomeFeedScreen /></AppShell>} />
        <Route path="/post/:id"      element={<AppShell><PostDetailScreen /></AppShell>} />
        <Route path="/profile"       element={<AppShell><ProfileScreen /></AppShell>} />
        <Route path="/messages"      element={<AppShell><MessagesScreen /></AppShell>} />
        <Route path="/notifications" element={<AppShell><NotificationsScreen /></AppShell>} />
        <Route path="/explore"       element={<AppShell><SearchScreen /></AppShell>} />
        <Route path="/groups"        element={<AppShell><GroupsScreen /></AppShell>} />
        <Route path="/settings"      element={<AppShell><SettingsScreen /></AppShell>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
