import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Stake from "./pages/Stake";
import Referrals from "./pages/Referrals";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const App = () => (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true }}>
        <div className="min-h-screen bg-background text-foreground">
          <Navigation />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stake" element={<Stake />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
);

export default App;
