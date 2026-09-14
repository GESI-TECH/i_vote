import AdminLayout from "../../components/layout/AdminLayout";
import { getCurrentSession } from "../../services/authService";

function DashboardView() {
  const session = getCurrentSession();

  return (
    <AdminLayout>
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <p className="text-sm font-medium text-primary">
          Bienvenue, {session?.name}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Tableau de bord
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          La base de l’espace d’administration est prête. Les modules de gestion
          des élections seront ajoutés ici.
        </p>
      </section>
    </AdminLayout>
  );
}

export default DashboardView;
