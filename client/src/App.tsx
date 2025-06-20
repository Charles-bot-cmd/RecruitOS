import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import MainLayout from "@/components/layout/main-layout";
import Dashboard from "@/pages/dashboard";
import Phase1Candidates from "@/pages/phase1-candidates";
import Phase2Candidates from "@/pages/phase2-candidates";
import Interviews from "@/pages/interviews";
import Settings from "@/pages/settings";
import CandidateProfile from "@/pages/candidate-profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/candidates/phase-1" component={Phase1Candidates} />
        <Route path="/candidates/phase-2" component={Phase2Candidates} />
        <Route path="/candidates/:id" component={CandidateProfile} />
        <Route path="/interviews" component={Interviews} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
