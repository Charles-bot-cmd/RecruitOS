import { useState } from "react";
import Sidebar from "./sidebar";
import TopBar from "./top-bar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        isMobileMenuOpen ? "block" : "hidden"
      )}>
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <Sidebar className="translate-x-0" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <TopBar onMobileMenuToggle={toggleMobileMenu} />
        
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
