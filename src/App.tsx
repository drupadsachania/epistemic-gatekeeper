import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import Index from "./pages/Index";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";
import Research from "./pages/Research";
import Adoption from "./pages/Adoption";
import Community from "./pages/Community";
import InteractivePage from "./pages/InteractivePage";

// Still-active legacy pages (Eclipse-styled sub-pages, rendered under Layout)
import Problem from "./pages/Problem";
import DecisionStates from "./pages/DecisionStates";
import SignalReference from "./pages/SignalReference";
import OodaMapping from "./pages/OodaMapping";
import ArgusOverview from "./pages/ArgusOverview";
import ArgusExamples from "./pages/ArgusExamples";
import SignalFrameworkMap from "./pages/SignalFrameworkMap";

import { initServiceWorker } from "./lib/serviceWorker";
import { initializeErrorTracking } from "./lib/errorTracking";
import { initializeSecurity } from "./lib/security";
import { initializeMonitoring } from "./lib/monitoring";
import { config } from "./lib/env";
import './styles/globals.css';

const queryClient = new QueryClient();

const AppContent = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/">
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            {/* ── Homepage ───────────────────────────────────────────── */}
            <Route path="/" element={<Index />} />

            {/* ── Interactive demo ───────────────────────────────────── */}
            <Route path="/interactive" element={<InteractivePage />} />

            {/* ── Kairos sub-pages ───────────────────────────────────── */}
            <Route path="/kairos/problem"          element={<Problem />} />
            <Route path="/kairos/decision-states"  element={<DecisionStates />} />
            <Route path="/kairos/signals"           element={<SignalReference />} />
            <Route path="/kairos/ooda"             element={<OodaMapping />} />

            {/* ── Argus XDR sub-pages ────────────────────────────────── */}
            <Route path="/argus-xdr/overview"      element={<ArgusOverview />} />
            <Route path="/argus-xdr/use-cases"     element={<ArgusExamples />} />
            <Route path="/argus-xdr/signal-map"    element={<SignalFrameworkMap />} />

            {/* ── Docs hub ───────────────────────────────────────────── */}
            <Route path="/docs"        element={<Docs />} />

            {/* ── Research / community ───────────────────────────────── */}
            <Route path="/research"    element={<Research />} />
            <Route path="/adoption"    element={<Adoption />} />
            <Route path="/community"   element={<Community />} />

            {/* ── Legacy redirects (old URL structure → new) ─────────── */}
            <Route path="/problem"                        element={<Navigate to="/kairos/problem"         replace />} />
            <Route path="/framework"                      element={<Navigate to="/"                       replace />} />
            <Route path="/framework/decision-states"      element={<Navigate to="/kairos/decision-states" replace />} />
            <Route path="/framework/signal-reference"     element={<Navigate to="/kairos/signals"         replace />} />
            <Route path="/framework/ooda-mapping"         element={<Navigate to="/kairos/ooda"            replace />} />
            <Route path="/argus"                          element={<Navigate to="/argus-xdr/overview"     replace />} />
            <Route path="/argus/examples"                 element={<Navigate to="/argus-xdr/use-cases"    replace />} />
            <Route path="/docs/signal-framework-map"      element={<Navigate to="/argus-xdr/signal-map"   replace />} />
            <Route path="/docs/signals"                   element={<Navigate to="/kairos/signals"         replace />} />
            <Route path="/docs/decision-criteria"         element={<Navigate to="/kairos/decision-states" replace />} />

            {/* ── 404 ────────────────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => {
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
