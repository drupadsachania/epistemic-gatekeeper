import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Problem from "./pages/Problem";
import FrameworkOverview from "./pages/FrameworkOverview";
import DecisionStates from "./pages/DecisionStates";
import SignalReference from "./pages/SignalReference";
import OodaMapping from "./pages/OodaMapping";
import ArgusOverview from "./pages/ArgusOverview";
import ArgusExamples from "./pages/ArgusExamples";
import SignalFrameworkMap from "./pages/SignalFrameworkMap";
import Research from "./pages/Research";
import Adoption from "./pages/Adoption";
import Community from "./pages/Community";
import ComingSoon from "./pages/ComingSoon";
import InteractivePage from './pages/InteractivePage';
import { initServiceWorker } from "./lib/serviceWorker";
import { initializeErrorTracking } from "./lib/errorTracking";
import { initializeSecurity } from "./lib/security";
import { initializeMonitoring } from "./lib/monitoring";
import { config } from "./lib/env";
import ErrorBoundary from "./components/ErrorBoundary";
import './styles/globals.css';

const queryClient = new QueryClient();

// App component with error boundary and production configuration
const AppContent = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/">
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/interactive" element={<InteractivePage />} />
            <Route path="/problem" element={<Problem />} />
            <Route path="/framework" element={<FrameworkOverview />} />
            <Route path="/framework/decision-states" element={<DecisionStates />} />
            <Route path="/framework/signal-reference" element={<SignalReference />} />
            <Route path="/framework/ooda-mapping" element={<OodaMapping />} />
            <Route path="/argus" element={<ArgusOverview />} />
            <Route path="/argus/examples" element={<ArgusExamples />} />
            <Route path="/docs/signal-framework-map" element={<SignalFrameworkMap />} />
            <Route path="/research" element={<Research />} />
            <Route path="/adoption" element={<Adoption />} />
            <Route path="/community" element={<Community />} />
            <Route path="/docs/signals" element={<ComingSoon title="Signal Documentation" />} />
            <Route path="/docs/decision-criteria" element={<ComingSoon title="Decision Criteria" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Wrap app with error boundary for production safety
const App = () => {
  // Initialize systems after React mounts
  useEffect(() => {
    initializeSecurity();
    initializeErrorTracking();
    initializeMonitoring();

    if (config.serviceWorkerEnabled) {
      initServiceWorker({
        enabled: true,
        onUpdate: () => console.log('✅ Service worker updated'),
        onInstall: () => console.log('✅ Service worker installed'),
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
