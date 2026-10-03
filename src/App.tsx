import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingAssistant } from './components/assistant/FloatingAssistant';
import { AuthPage } from './pages/AuthPage';
import { Home } from './pages/Home';
import { Discovery } from './pages/Discovery';
import { EligibilityWizard } from './pages/EligibilityWizard';
import { DocumentChecklist } from './pages/DocumentChecklist';
import { GuidedApplication } from './pages/GuidedApplication';
import { SubmissionSuccess } from './pages/SubmissionSuccess';
import { Tracking } from './pages/Tracking';
import { Admin } from './pages/Admin';
import { Analytics } from './pages/Analytics';
import servicesData from './data/services.json';
import { Service } from './types/service';
import { UploadedDoc, Application } from './types/application';
import { getApplications, getApplicationById } from './services/storage';

export const AppContent: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const { addNotification } = useNotification();

  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<any>(null);

  // Active journey state
  const [selectedService, setSelectedService] = useState<Service>(() => servicesData[0] as Service);
  const [wizardAnswers, setWizardAnswers] = useState<any>(null);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [latestApplication, setLatestApplication] = useState<Application | null>(null);

  // Sync route on login or role change
  useEffect(() => {
    if (user) {
      if (isAdmin && currentRoute === 'home') {
        setCurrentRoute('admin');
      } else if (!isAdmin && (currentRoute === 'admin' || currentRoute === 'analytics')) {
        setCurrentRoute('home');
      }
    }
  }, [user, isAdmin]);

  const handleNavigate = (route: string, params: any = null, targetUser?: any) => {
    const activeUser = targetUser !== undefined ? targetUser : user;
    const isUserAdmin = activeUser?.role === 'admin';

    // Role-based protection: Citizens cannot open /admin or /analytics
    if (!isUserAdmin && (route === 'admin' || route === 'analytics')) {
      addNotification({
        type: 'warning',
        title: t('auth.restrictedToastTitle') || 'Access Restricted',
        message:
          t('auth.restrictedToastMsg') ||
          'The Administrative Welfare Portal and Analytics are reserved for Department Desk Officers. Citizens have full access to Scheme Discovery, Eligibility Wizard, and Live Application Tracking.',
      });
      setCurrentRoute('home');
      setRouteParams(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    handleNavigate('discovery', { query });
  };

  const handleSelectCategory = (category: string) => {
    handleNavigate('discovery', { category });
  };

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
  };

  // If not logged in, show AuthPage as the initial screen
  if (!user) {
    return (
      <AuthPage
        onLoginSuccess={(loggedInUser) => {
          handleNavigate(loggedInUser.role === 'admin' ? 'admin' : 'home', null, loggedInUser);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />

      <main className="flex-1 flex flex-col" id="main-content">
        {currentRoute === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onSearch={handleSearch}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {currentRoute === 'discovery' && (
          <Discovery
            query={routeParams?.query}
            category={routeParams?.category}
            onNavigate={handleNavigate}
            onSelectService={handleSelectService}
          />
        )}

        {currentRoute === 'wizard' && (
          <EligibilityWizard
            service={selectedService}
            onNavigate={handleNavigate}
            onEligibilityChecked={(result) => setWizardAnswers(result.answers)}
          />
        )}

        {currentRoute === 'checklist' && (
          <DocumentChecklist
            service={selectedService}
            uploadedDocs={uploadedDocs}
            onUpdateDocs={setUploadedDocs}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'apply' && (
          <GuidedApplication
            service={selectedService}
            initialUploadedDocs={uploadedDocs}
            initialWizardAnswers={wizardAnswers}
            onNavigate={handleNavigate}
            onApplicationSubmitted={(app) => setLatestApplication(app)}
          />
        )}

        {currentRoute === 'submitted' && (
          <SubmissionSuccess
            application={latestApplication || getApplicationById(routeParams?.applicationId, user) || getApplications()[0]}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'track' && (
          <Tracking
            initialAppId={routeParams?.searchId || ''}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'admin' && (
          isAdmin ? (
            <Admin onNavigate={handleNavigate} />
          ) : (
            <Home
              onNavigate={handleNavigate}
              onSearch={handleSearch}
              onSelectCategory={handleSelectCategory}
            />
          )
        )}

        {currentRoute === 'analytics' && (
          isAdmin ? (
            <Analytics onNavigate={handleNavigate} />
          ) : (
            <Home
              onNavigate={handleNavigate}
              onSearch={handleSearch}
              onSelectCategory={handleSelectCategory}
            />
          )
        )}
      </main>

      <Footer />

      {/* Floating AI Assistant on citizen screens */}
      {!isAdmin && (
        <FloatingAssistant
          currentRoute={currentRoute}
          selectedService={selectedService}
          activeApplication={latestApplication}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <NotificationProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </NotificationProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
};

export default App;
