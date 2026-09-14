import { LockKeyhole, LogIn, ShieldCheck } from "lucide-react";
import Header from "../../components/layout/Header";
import { useAuthViewModel } from "../../viewmodels/useAuthViewModel";

function LoginView() {
  const viewModel = useAuthViewModel();

  return (
    <div className="min-h-screen bg-muted">
      <Header minimal />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl shadow-foreground/5">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                i-Vote
              </p>
              <p className="text-sm text-muted-foreground">Administration</p>
            </div>
          </div>

          <div className="mb-7">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Connexion
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Accédez à la gestion des élections étudiantes.
            </p>
          </div>

          <form className="space-y-5" onSubmit={viewModel.submitLogin}>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-foreground"
                htmlFor="username"
              >
                Nom d’utilisateur
              </label>
              <input
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
                id="username"
                name="username"
                autoComplete="username"
                required
                value={viewModel.username}
                onChange={(event) => viewModel.setUsername(event.target.value)}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-foreground"
                htmlFor="password"
              >
                Mot de passe
              </label>
              <div className="relative">
                <LockKeyhole
                  className="absolute left-3 top-3 text-muted-foreground"
                  size={18}
                  aria-hidden="true"
                />
                <input
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
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
              <p className="text-sm text-destructive" role="alert">
                {viewModel.error}
              </p>
            )}

            <button
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={viewModel.isSubmitting}
            >
              <LogIn size={18} aria-hidden="true" />
              {viewModel.isSubmitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 border-t border-border pt-5 text-xs text-muted-foreground">
            Mode temporaire : utilisez <strong>admin</strong> et{" "}
            <strong>admin123</strong>.
          </p>
        </section>
      </main>
    </div>
  );
}

export default LoginView;
