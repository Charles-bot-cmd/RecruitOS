import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Home, 
  UserCheck, 
  UserCog, 
  Calendar, 
  Settings, 
  User 
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Phase 1 Candidates", href: "/candidates/phase-1", icon: UserCheck },
  { name: "Phase 2 Candidates", href: "/candidates/phase-2", icon: UserCog },
  { name: "Interviews", href: "/interviews", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside className={cn(
      "flex flex-col w-64 fixed inset-y-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
      className
    )}>
      <div className="flex items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">RecruitOS</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              John Doe
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              HR Manager
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
