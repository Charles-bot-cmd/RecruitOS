import { useState } from "react";
import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";

interface TopBarProps {
  onMobileMenuToggle?: () => void;
}

export default function TopBar({ onMobileMenuToggle }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileMenuToggle}
              className="text-slate-600 dark:text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          <div className="lg:hidden">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">RecruitOS</h1>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-600 dark:text-slate-300"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 dark:text-slate-300 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}
