
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { AuthGuard } from "./components/auth/AuthGuard";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orphans from "./pages/Orphans";
import Donations from "./pages/Donations";
import Reports from "./pages/Reports";
import Members from "./pages/Members";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <AuthGuard>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </AuthGuard>
          } />
          
          <Route path="/orphans" element={
            <AuthGuard>
              <DashboardLayout>
                <Orphans />
              </DashboardLayout>
            </AuthGuard>
          } />
          
          <Route path="/donations" element={
            <AuthGuard>
              <DashboardLayout>
                <Donations />
              </DashboardLayout>
            </AuthGuard>
          } />
          
          <Route path="/reports" element={
            <AuthGuard>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </AuthGuard>
          } />
          
          <Route path="/members" element={
            <AuthGuard>
              <DashboardLayout>
                <Members />
              </DashboardLayout>
            </AuthGuard>
          } />
          
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
