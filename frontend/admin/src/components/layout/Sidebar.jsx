import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Tableau de bord", to: "/dashboard", icon: LayoutDashboard },
  { label: "Élections", to: "/elections", icon: CalendarDays },
  { label: "Candidats", to: "/candidates", icon: Users },
  { label: "Résultats", to: "/results", icon: BarChart3 },
  { label: "Paramètres", to: "/settings", icon: Settings },
];

function Sidebar({ isOpen = false, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          className="fixed inset-0 z-30 bg-foreground/30 md:hidden"
          type="button"
          aria-label="Fermer le menu"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform md:static md:z-0 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5 md:hidden">
          <span className="text-sm font-semibold text-sidebar-foreground">
            Navigation
          </span>
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent"
            type="button"
            aria-label="Fermer le menu"
            onClick={onClose}
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>
        <div className="flex h-full flex-col px-3 py-5">
          <div className="mb-6 flex items-center gap-3 px-3">
            <ShieldCheck
              className="text-sidebar-primary"
              size={22}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-sidebar-foreground">
                Espace admin
              </p>
              <p className="text-xs text-muted-foreground">
                Gestion des élections
              </p>
            </div>
          </div>
          <nav className="space-y-1" aria-label="Navigation principale">
            {navigationItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`
                }
                to={to}
                onClick={onClose}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
