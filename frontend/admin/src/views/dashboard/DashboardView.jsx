import AdminLayout from "../../components/layout/AdminLayout";
import { getCurrentSession } from "../../services/authService";

function DashboardView() {
  const session = getCurrentSession();

  return (
    <AdminLayout>
      <section className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <p className="text-xs font-medium text-primary sm:text-sm">
          Bienvenue, {session?.name}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Tableau de bord
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
          La base de l’espace d’administration est prête. Les modules de gestion
          des élections seront ajoutés ici.
        </p>
      </section>
    </AdminLayout>
  );
}

export default DashboardView;
