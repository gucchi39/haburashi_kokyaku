// メインアプリケーション
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { useReminders } from './hooks/useReminders';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const onboardingDone = useStore(state => state.onboardingDone);

  // リマインダーを有効化（デモ用）
  useReminders();

  return (
    <BrowserRouter basename="/haburashi_kokyaku">
      <Routes>
        <Route 
          path="/onboarding" 
          element={onboardingDone ? <Navigate to="/" /> : <OnboardingPage />} 
        />
        <Route 
          path="/" 
          element={onboardingDone ? <HomePage /> : <Navigate to="/onboarding" />} 
        />
        <Route 
          path="/dashboard" 
          element={onboardingDone ? <DashboardPage /> : <Navigate to="/onboarding" />} 
        />
        <Route 
          path="/chat" 
          element={onboardingDone ? <ChatPage /> : <Navigate to="/onboarding" />} 
        />
        <Route 
          path="/settings" 
          element={onboardingDone ? <SettingsPage /> : <Navigate to="/onboarding" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

