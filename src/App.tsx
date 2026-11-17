import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { CastingCallsPage } from './pages/CastingCallsPage';
import { CastingCallDetailPage } from './pages/CastingCallDetailPage';
import { CreateCastingCallPage } from './pages/CreateCastingCallPage';
import { ApplicantReviewPage } from './pages/ApplicantReviewPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { SearchPage } from './pages/SearchPage';
import { MessagesPage } from './pages/MessagesPage';
import { MessageDetailPage } from './pages/MessageDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { FavoriteGroupDetailPage } from './pages/FavoriteGroupDetailPage';
import { ReportUserPage } from './pages/ReportUserPage';
import { AdminSection } from './pages/AdminSection';
import { SettingsPage } from './pages/SettingsPage';

const MainContent: React.FC = () => {
  const { activePage, pageParam } = useApp();

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'terms':
        return <TermsPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'profile':
        return <ProfilePage userId={pageParam || undefined} />;
      case 'casting-calls':
        return <CastingCallsPage />;
      case 'casting-call-detail':
        return <CastingCallDetailPage castingCallId={pageParam || ''} />;
      case 'create-casting-call':
        return <CreateCastingCallPage />;
      case 'applicant-review':
        return <ApplicantReviewPage castingCallId={pageParam || ''} />;
      case 'my-applications':
        return <MyApplicationsPage />;
      case 'search':
        return <SearchPage />;
      case 'messages':
        return <MessagesPage />;
      case 'message-detail':
        return <MessageDetailPage otherUserId={pageParam || ''} />;
      case 'favorites':
        return <FavoritesPage />;
      case 'favorite-group-detail':
        return <FavoriteGroupDetailPage groupId={pageParam || ''} />;
      case 'report-user':
        return <ReportUserPage />;
      case 'admin-dashboard':
        return <AdminSection initialSubView="dashboard" />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--app-bg)] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />
      <main className="flex-1 w-full">{renderCurrentPage()}</main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
