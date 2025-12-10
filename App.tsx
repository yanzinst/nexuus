import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import AddNumber from "./pages/AddNumber";
import NumberDetails from "./pages/NumberDetails";
import Profile from "./pages/Profile";
import Operations from "./pages/Operations";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/add" component={AddNumber} />
      <Route path="/add-number" component={AddNumber} />
      <Route path="/number/:id" component={NumberDetails} />
      <Route path="/profile" component={Profile} />
      <Route path="/operations" component={Operations} />
      <Route path="/settings" component={Profile} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
