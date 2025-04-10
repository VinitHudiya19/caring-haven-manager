
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  HeartHandshake,
  BarChart3,
  Menu,
  X,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Orphans", href: "/orphans", icon: Users },
  { name: "Donations", href: "/donations", icon: HeartHandshake },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Members", href: "/members", icon: UserPlus },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [adminName, setAdminName] = useState("Admin User");

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name) {
      setAdminName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminName");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          type="button"
          className="p-2 rounded-md text-gray-700 hover:bg-primary-light hover:text-primary transition-colors duration-200"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        >
          {showMobileSidebar ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={cn(
          "fixed inset-0 flex flex-col w-64 z-40 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden",
          showMobileSidebar ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold text-primary">BalSadan</h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-primary-light hover:text-primary"
                  )}
                  onClick={() => setShowMobileSidebar(false)}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-primary"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex bg-primary-light p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">{adminName}</p>
                <p className="text-xs text-gray-500">Signed in</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-primary">BalSadan</h1>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-primary-light hover:text-primary"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 transition-colors duration-200",
                        isActive
                          ? "text-white"
                          : "text-gray-500 group-hover:text-primary"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex bg-primary-light p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{adminName}</p>
                  <p className="text-xs text-gray-500">Signed in</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
