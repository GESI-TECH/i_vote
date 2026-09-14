import { Laptop, LogOut, Menu, Moon, ShieldCheck, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentSession, logout } from "../../services/authService";
import useTheme from "../theme/useTheme";

function Header({ onMenuClick, minimal = false }) {
  const navigate = useNavigate();
  const session = getCurrentSession();
  const { theme, setTheme } = useTheme();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-5 sm:px-6">
        <div className="flex items-center gap-3">
          {!minimal && (
            <button
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
              type="button"
              aria-label="Ouvrir le menu"
              onClick={onMenuClick}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                i-Vote
              </p>
              <p className="text-xs text-muted-foreground">Administration</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="flex items-center rounded-lg border border-border bg-muted p-1"
            aria-label="Choisir le thème"
          >
            <button
              className={`rounded-md p-2 ${theme === "light" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
              type="button"
              aria-label="Thème clair"
              aria-pressed={theme === "light"}
              title="Thème clair"
              onClick={() => setTheme("light")}
            >
              <Sun size={16} aria-hidden="true" />
            </button>
            <button
              className={`rounded-md p-2 ${theme === "dark" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
              type="button"
              aria-label="Thème sombre"
              aria-pressed={theme === "dark"}
              title="Thème sombre"
              onClick={() => setTheme("dark")}
            >
              <Moon size={16} aria-hidden="true" />
            </button>
            <button
              className={`rounded-md p-2 ${theme === "system" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
              type="button"
              aria-label="Thème du système"
              aria-pressed={theme === "system"}
              title="Thème du système"
              onClick={() => setTheme("system")}
            >
              <Laptop size={16} aria-hidden="true" />
            </button>
          </div>

          {!minimal && session && (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-foreground">
                  {session.name}
                </p>
                <p className="text-xs text-muted-foreground">Administrateur</p>
              </div>
              <button
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                type="button"
                onClick={handleLogout}
              >
                <LogOut size={17} aria-hidden="true" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
