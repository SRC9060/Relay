import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccountProvider } from './context/AccountContext';
import { ConversationProvider } from './context/ConversationContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import OverviewPage from './pages/assistant/OverviewPage';
import InboxPage from './pages/inbox/InboxPage';
import AIAssistantPage from './pages/assistant/AIAssistantPage';
import AccountsPage from './pages/settings/AccountsPage';
import PlaceholderPage from './pages/assistant/PlaceholderPage';
import ClientQueuePage from './pages/client/ClientQueuePage';
import HomePage from './pages/public/HomePage';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AccountProvider>
          <ConversationProvider>
            <Analytics />
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<HomePage />} />

              {/* Auth and Onboarding Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
              </Route>

              {/* Assistant Shell Routes */}
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/app/overview" replace />} />
                <Route path="overview" element={<OverviewPage />} />
                <Route path="inbox" element={<InboxPage defaultSegment="all" />} />
                <Route path="action-required" element={<InboxPage defaultSegment="action_required" />} />
                <Route path="assistant-reply" element={<InboxPage defaultSegment="assistant_reply" />} />
                <Route path="client-reply" element={<InboxPage defaultSegment="client_reply" />} />
                <Route path="no-reply" element={<InboxPage defaultSegment="no_reply" />} />
                <Route path="needs-review" element={<InboxPage defaultSegment="needs_review" />} />
                <Route path="waiting" element={<InboxPage defaultSegment="waiting" />} />
                <Route path="meetings" element={<InboxPage defaultSegment="meetings" />} />
                <Route path="important" element={<InboxPage defaultSegment="important" />} />
                <Route path="archive" element={<InboxPage defaultSegment="archive" />} />
                <Route path="ai-assistant" element={<AIAssistantPage />} />
                <Route path="accounts" element={<AccountsPage />} />
                <Route
                  path="settings"
                  element={
                    <PlaceholderPage
                      title="Workspace Settings"
                      milestone="Milestone 4"
                      description="Preferences, AI confidence thresholds, and notification rules."
                    />
                  }
                />
              </Route>

              {/* Dedicated Client Workspace */}
              <Route
                path="/client"
                element={
                  <ProtectedRoute>
                    <ClientQueuePage />
                  </ProtectedRoute>
                }
              />

              {/* Default Catch-all */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </ConversationProvider>
        </AccountProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
