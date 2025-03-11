
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TimetableProvider } from "./contexts/TimetableContext";
import { TimetablePromptProvider } from "./contexts/TimetablePromptContext";
import { Toaster } from "sonner";

import SplashScreen from "./components/splash/SplashScreen";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Timetable from "./pages/Timetable";
import TimetableSetup from "./pages/TimetableSetup";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import ArchivedTasks from "./pages/ArchivedTasks";
import Flashcards from "./pages/Flashcards";
import StudyTracker from "./pages/StudyTracker";
import FocusTimer from "./pages/FocusTimer";
import Profile from "./pages/Profile";
import ProfileTest from "./pages/ProfileTest";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ModuleSelectionTest from "./pages/ModuleSelectionTest";

import "./App.css";

function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  useEffect(() => {
    // Skip splash screen for development if needed
    // setShowSplash(false); 
  }, []);

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} duration={3000} />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <TimetableProvider>
          <TimetablePromptProvider>
            <Toaster position="top-center" richColors />
            <Routes>
              {/* Public routes */}
              <Route element={<PublicRoute><Outlet /></PublicRoute>}>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected routes */}
              <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/timetable" element={<Timetable />} />
                <Route path="/timetable-setup" element={<TimetableSetup />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/archived-tasks" element={<ArchivedTasks />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/study-tracker" element={<StudyTracker />} />
                <Route path="/focus-timer" element={<FocusTimer />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile-test" element={<ProfileTest />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/module-selection-test" element={<ModuleSelectionTest />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TimetablePromptProvider>
        </TimetableProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
