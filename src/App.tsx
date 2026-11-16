import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { PricingPage } from './pages/PricingPage';
import { DocsPage } from './pages/DocsPage';
import { ContactPage } from './pages/ContactPage';
import { DemoModal } from './components/DemoModal';
import { ComparisonModal } from './components/ComparisonModal';
import { SignInModal } from './components/SignInModal';
import { ChatButton } from './components/ChatButton';

// The admin dashboard is loaded on demand so it adds nothing to the public site's bundle.
const AdminApp = lazy(() => import('./admin/AdminApp'));

// Automatically scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Site() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedPlanForDemo, setSelectedPlanForDemo] = useState<string>('Growth');
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  const handleOpenDemo = (planOrModule?: string) => {
    if (planOrModule) {
      setSelectedPlanForDemo(planOrModule);
    }
    setDemoOpen(true);
  };

  const openChat = () => {
    const btn = document.querySelector('button[aria-label="বাংলা সহায়তা ও চ্যাট"]') as HTMLButtonElement;
    btn?.click();
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col text-[#0B192C] selection:bg-[#064E3B] selection:text-white">
      {/* Navigation Bar */}
      <Navbar onOpenDemo={() => handleOpenDemo()} onOpenSignIn={() => setSignInOpen(true)} />

      {/* Main Routed Content */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={<HomePage onOpenDemo={handleOpenDemo} onOpenComparison={() => setComparisonOpen(true)} />}
          />
          <Route path="/products" element={<ProductsPage onOpenDemo={handleOpenDemo} />} />
          <Route path="/pricing" element={<PricingPage onOpenDemo={handleOpenDemo} />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/contact" element={<ContactPage onOpenSignIn={() => setSignInOpen(true)} onOpenChat={openChat} />} />
          <Route
            path="/schedule-demo"
            element={<ContactPage onOpenSignIn={() => setSignInOpen(true)} onOpenChat={openChat} />}
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer onOpenDemo={() => handleOpenDemo()} onOpenSignIn={() => setSignInOpen(true)} />

      {/* Floating Support Chat Trigger */}
      <ChatButton onOpenDemo={() => handleOpenDemo()} />

      {/* Modals */}
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} initialPlan={selectedPlanForDemo} />

      <ComparisonModal
        isOpen={comparisonOpen}
        onClose={() => setComparisonOpen(false)}
        onSelectPlan={(plan) => handleOpenDemo(plan)}
      />

      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} onOpenDemo={() => handleOpenDemo()} />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={<div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center text-sm">লোড হচ্ছে…</div>}
            >
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<Site />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
