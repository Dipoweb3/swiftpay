
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateWallet from "./pages/CreateWallet";
import Unlock from "./pages/Unlock";
import SendBitcoin from "./pages/SendBitcoin";
import ReceiveBitcoin from "./pages/ReceiveBitcoin";
import Bridge from "./pages/Bridge";
import Security from "./pages/Security";
import TransactionHistory from "./pages/TransactionHistory";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-wallet" element={<CreateWallet />} />
            <Route path="/unlock" element={<Unlock />} />
            <Route path="/send" element={<SendBitcoin />} />
            <Route path="/receive" element={<ReceiveBitcoin />} />
            <Route path="/bridge" element={<Bridge />} />
            <Route path="/security" element={<Security />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
