import { useState, useEffect } from "react";
import { useAppState } from "@/hooks/use-app-state";
import { AgentManagement } from "./agent-management";
import { AgentTickets } from "./agent-tickets";
import { AuditLogs } from "./audit-logs";
import { EADownloadInvoice } from "./ea-download-invoice";
import { EASignIn } from "./ea-sign-in";
import { EAAgentSignIn } from "./ea-agent-sign-in";

export function EAInvoiceDownloader() {
  const { state } = useAppState();
  const userRole = state.currentUser?.role || 'Admin';
  const currentTab = state.currentTab;
  
  // Check if user is signed in (for User role)
  const [isSignedIn, setIsSignedIn] = useState(false);
  // Check if agent is signed in (for Agent role)
  const [isAgentSignedIn, setIsAgentSignedIn] = useState(false);
  
  // Normalize role to lowercase for comparison
  const normalizedRole = userRole.toLowerCase();
  const isUserRole = normalizedRole === 'user' || normalizedRole === 'business_user';
  const isAgentRole = normalizedRole === 'agent';
  
  // Track previous role to detect role switches
  const [prevRole, setPrevRole] = useState<string | null>(null);
  
  // Handle sign-in state based on role
  useEffect(() => {
    if (isUserRole) {
      // Check if this is a role switch (from non-User to User)
      if (prevRole && prevRole !== "User" && prevRole !== "user" && prevRole !== "business_user") {
        // Role was switched TO User - require fresh sign-in
        localStorage.removeItem("ea_user_signed_in");
        localStorage.removeItem("ea_user_email");
        setIsSignedIn(false);
      } else {
        // Check if already signed in (for page refresh or staying in User role)
        const signedIn = localStorage.getItem("ea_user_signed_in") === "true";
        setIsSignedIn(signedIn);
      }
      setPrevRole(userRole);
    } else if (isAgentRole) {
      // Check if this is a role switch (from non-Agent to Agent)
      if (prevRole && prevRole !== "Agent" && prevRole !== "agent") {
        // Role was switched TO Agent - require fresh sign-in
        localStorage.removeItem("ea_agent_signed_in");
        localStorage.removeItem("ea_agent_sl_code");
        localStorage.removeItem("ea_agent_gstn");
        setIsAgentSignedIn(false);
      } else {
        // Check if already signed in (for page refresh or staying in Agent role)
        const signedIn = localStorage.getItem("ea_agent_signed_in") === "true";
        setIsAgentSignedIn(signedIn);
      }
      // Clear old agent-specific data (SL Code, GSTN) as we're using email/username now
      localStorage.removeItem("ea_agent_sl_code");
      localStorage.removeItem("ea_agent_gstn");
      setPrevRole(userRole);
    } else {
      // Not User or Agent role - clear sign-in state
      setIsSignedIn(false);
      setIsAgentSignedIn(false);
      setPrevRole(userRole);
    }
  }, [isUserRole, isAgentRole, userRole, prevRole]);
  
  // For User role, show Sign In page if not signed in, otherwise show Download Invoice page
  if (isUserRole) {
    if (!isSignedIn) {
      return <EASignIn onSignInSuccess={() => setIsSignedIn(true)} />;
    }
    return <EADownloadInvoice isAgent={false} />;
  }
  
  // Route based on current tab for Admin
  if (normalizedRole === 'admin' || normalizedRole === 'application_admin') {
    // Check for specific tabs
    if (currentTab === 'ea-agent-tickets') {
      return (
        <div className="space-y-6">
          <AgentTickets />
        </div>
      );
    }
    if (currentTab === 'ea-audit-logs') {
      return (
        <div className="space-y-6">
          <AuditLogs />
        </div>
      );
    }
    // Default to Agent Management (for 'ea-invoice-downloader' tab or any other tab within this module)
    return (
      <div className="space-y-6">
        <AgentManagement />
      </div>
    );
  }

  // For Agent role, show Sign In page if not signed in, otherwise show Download Invoice page
  if (isAgentRole) {
    if (!isAgentSignedIn) {
      return <EAAgentSignIn onSignInSuccess={() => setIsAgentSignedIn(true)} />;
    }
    return <EADownloadInvoice isAgent={true} />;
  }

  // Default fallback
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Dashboard for {userRole} role - Coming soon
      </p>
    </div>
  );
}
