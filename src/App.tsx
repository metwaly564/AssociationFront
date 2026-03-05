import { Home } from './pages/Home';
import { About } from './pages/About';
import { Programs } from './pages/Programs';
import { Volunteering } from './pages/Volunteering';
import { Membership } from './pages/Membership';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Contact } from './pages/Contact';
import { Header } from './components/Header';
import { StrategicFramework } from './pages/about/StrategicFramework';
import { GeneralAssembly } from './pages/about/GeneralAssembly';
import { ManagementBoard } from './pages/about/ManagementBoard';
import { OrganizationalStructure } from './pages/about/OrganizationalStructure';
import { Team } from './pages/about/Team';
import { Committees } from './pages/about/Committees';
import { OfficesBranches } from './pages/about/OfficesBranches';
import { Licenses } from './pages/about/Licenses';
import { Footer } from './components/Footer';
import { AnnualReports } from './pages/AnnualReports';
import { Jobs } from './pages/membership/Jobs';
import { Partnership } from './pages/membership/Partnership';
import { Donate } from './pages/membership/Donate';
import { useState } from 'react';
import { Employees } from './pages/feedback/Employees';
import { Volunteers } from './pages/feedback/Volunteers';
import { Donors } from './pages/feedback/Donors';
import { Beneficiaries } from './pages/feedback/Beneficiaries';
import { Stakeholders } from './pages/feedback/Stakeholders';
import { Results } from './pages/feedback/Results';
import { Policies } from './pages/governance/Policies';
import { OperationalBudget } from './pages/governance/OperationalBudget';
import { FinancialStatements } from './pages/governance/FinancialStatements';
import { Reports } from './pages/governance/Reports';
import { useEffect } from 'react';
import { publicApi } from './lib/api';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
// قراءة الصفحة المحفوظة من localStorage أو افتراضياً 'home'
const initialPage = localStorage.getItem('currentPage') || 'home';
const [currentPage, setCurrentPage] = useState(initialPage);
const [newsDetailSlug, setNewsDetailSlug] = useState<string | null>(null);
const [siteSettings, setSiteSettings] = useState<Record<string, { value: string; type: string }>>({});

  useEffect(() => {
  // كل مرة تتغير الصفحة أو تفاصيل الخبر، نرجع لأعلى الصفحة
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, [currentPage, newsDetailSlug]);

// حفظ الصفحة الحالية في localStorage عند كل تغيير
useEffect(() => {
  localStorage.setItem('currentPage', currentPage);
}, [currentPage]);

  useEffect(() => {
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    try {
      const data = await publicApi.getSiteSettings();
      setSiteSettings(data.settings || {});
      
      // Update document title
      const siteName = data.settings?.site_name?.value || 'جمعية الرعاية الخيرية';
      document.title = siteName;
      
      // Update favicon
      const favicon = data.settings?.site_favicon?.value;
      if (favicon) {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) {
          link.href = favicon;
        } else {
          const newLink = document.createElement('link');
          newLink.rel = 'icon';
          newLink.href = favicon;
          document.head.appendChild(newLink);
        }
      }
    } catch (error) {
      console.error('Error loading site settings:', error);
    }
  };

  // Expose simple navigation for in-page links (e.g., org structure -> team)
  // Not a router; just a small bridge for this app structure.
  ;(window as any).navigateTo = (page: string) => {
    setCurrentPage(page);
    setNewsDetailSlug(null);
  };
  
  // Expose navigation to news detail
  ;(window as any).navigateToNewsDetail = (slug: string) => {
    setCurrentPage('news');
    setNewsDetailSlug(slug);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'about-strategy':
        return <StrategicFramework />;
      case 'about-assembly':
        return <GeneralAssembly />;
      case 'about-management':
        return <ManagementBoard />;
      case 'about-structure':
        return <OrganizationalStructure />;
      case 'about-team':
        return <Team />;
      case 'about-committees':
        return <Committees />;
      case 'about-offices':
        return <OfficesBranches />;
      case 'about-licenses':
        return <Licenses />;
      case 'programs':
        return <Programs onDonateClick={() => setCurrentPage('membership-donate')} />;
      case 'programs-annual':
        return <AnnualReports />;
      case 'feedback-employees':
        return <Employees />;
      case 'feedback-volunteers':
        return <Volunteers />;
      case 'feedback-donors':
        return <Donors />;
      case 'feedback-beneficiaries':
        return <Beneficiaries />;
      case 'feedback-stakeholders':
        return <Stakeholders />;
      case 'feedback-results':
        return <Results />;
      case 'volunteering':
        return <Volunteering />;
      case 'membership':
        return <Membership />;
      case 'membership-jobs':
        return <Jobs />;
      case 'membership-partnership':
        return <Partnership />;
      case 'membership-donate':
        return <Donate />;
      case 'news':
        if (newsDetailSlug) {
          return <NewsDetail slug={newsDetailSlug} onBack={() => setNewsDetailSlug(null)} />;
        }
        return <News />;
      case 'contact':
        return <Contact />;
      case 'gov-policies':
        return <Policies />;
      case 'gov-operational-budget':
        return <OperationalBudget />;
      case 'gov-financial-statements':
        return <FinancialStatements />;
      case 'gov-reports':
        return <Reports />;
      default:
        return <Home />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme" dir="rtl">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} siteSettings={siteSettings} />
        <main>{renderPage()}</main>
        <Footer setCurrentPage={setCurrentPage} siteSettings={siteSettings} />
      </div>
    </ThemeProvider>
  );
}

export default App;
