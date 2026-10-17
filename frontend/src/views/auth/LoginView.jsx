import { LockKeyhole, LogIn, User } from "lucide-react";
import Header from "../../components/layout/Header";
import { useAuthViewModel } from "../../viewmodels/useAuthViewModel";

function LoginView() {
  const viewModel = useAuthViewModel();

  return (
    <div className="min-h-screen bg-muted">
      <Header minimal /> {/*  Header de componants/layout/header.jsx */}
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl shadow-foreground/5 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-3 sm:mb-7">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:size-11">
              <img src="/icon1.svg" alt="" />
            </div>
            <div>
              <p className="text-xs font-bold italic tracking-[0.18em] text-primary sm:text-sm">
                iVote
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Administration
              </p>
            </div>
          </div>

          <div className="mb-6 sm:mb-7">
            <h1 className="text-xl font-semibold tracking-tight text-muted-foreground sm:text-3xl">
              Connexion
            </h1>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              Accédez à la gestion des élections étudiantes.
            </p>
          </div>

          <form
            className="space-y-4 sm:space-y-5"
            onSubmit={viewModel.submitLogin}
          >
            <div>
              <label
                className="mb-2 block text-xs font-medium text-foreground sm:text-sm"
                htmlFor="username"
              >
                Nom d’utilisateur
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-2.5 text-muted-foreground"
                  size={16}
                  aria-hidden="true"
                />
                <input
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20 sm:h-11 sm:pl-10"
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={viewModel.username}
                  onChange={(event) =>
                    viewModel.setUsername(event.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-medium text-foreground sm:text-sm"
                htmlFor="password"
              >
                Mot de passe
              </label>
              <div className="relative">
                <LockKeyhole
                  className="absolute left-3 top-2.5 text-muted-foreground sm:top-3"
                  size={16}
                  aria-hidden="true"
                />
                <input
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20 sm:h-11 sm:pl-10"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={viewModel.password}
                  onChange={(event) =>
                    viewModel.setPassword(event.target.value)
                  }
                />
              </div>
            </div>

            {viewModel.error && (
              <p className="text-xs text-destructive sm:text-sm" role="alert">
                {viewModel.error}
              </p>
            )}

            <button
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:h-11"
              type="submit"
              disabled={viewModel.isSubmitting}
            >
              <LogIn size={17} aria-hidden="true" />
              {viewModel.isSubmitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-5 border-t border-border pt-4 text-[11px] text-muted-foreground sm:mt-6 sm:pt-5 sm:text-xs">
            Mode temporaire : utilisez <strong>admin</strong> et{" "}
            <strong>admin123</strong>.
          </p>
        </section>
      </main>
    </div>
  );
}

export default LoginView;
