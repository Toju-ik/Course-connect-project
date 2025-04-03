
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ui/theme-provider';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import ArchivedTasks from './pages/ArchivedTasks';
import Timetable from './pages/Timetable';
import TimetableSetup from './pages/TimetableSetup';
import Profile from './pages/Profile';
import StudyTracker from './pages/StudyTracker';
import Flashcards from './pages/Flashcards';
import FocusTimer from './pages/FocusTimer';
import Settings from './pages/Settings';
import Collaboration from './pages/Collaboration';
import NotFound from './pages/NotFound';
import { PublicRoute } from './components/routes/PublicRoute';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { Toaster } from "@/components/ui/toaster"
import Friends from './pages/Friends';
import FriendSearchTest from './pages/FriendSearchTest';

function App() {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Authentication Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/archived-tasks" element={<ArchivedTasks />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/timetable-setup" element={<TimetableSetup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/study-tracker" element={<StudyTracker />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/focus-timer" element={<FocusTimer />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/collaboration" element={<Collaboration />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/test/friend-search" element={<FriendSearchTest />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
