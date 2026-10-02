import AdminLayout from "../../components/layout/AdminLayout";
import { getCurrentSession } from "../../services/authService";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  GraduationCap,
  Network,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getDepartments,
  getFaculties,
  getFilieres,
  getPromotions,
  getStudents,
} from "../../repositories/studentRepository";

const academicLinks = [
  {
    title: "Facultés",
    description: "Consulter les facultés de l’université.",
    to: "/facultes",
    icon: Building2,
  },
  {
    title: "Départements",
    description: "Explorer les départements et leurs facultés.",
    to: "/departements",
    icon: Network,
  },
  {
    title: "Promotions",
    description: "Voir les promotions par département.",
    to: "/promotions",
    icon: GraduationCap,
  },
  {
    title: "Filières",
    description: "Consulter les filières par promotion.",
    to: "/filieres",
    icon: BookOpen,
  },
  {
    title: "Étudiants",
    description: "Consulter les dossiers étudiants.",
    to: "/etudiants",
    icon: Users,
  },
];

function DashboardView() {
  const session = getCurrentSession();
  const metrics = [
    { label: "Facultés", value: getFaculties().length },
    { label: "Départements", value: getDepartments().length },
    { label: "Promotions", value: getPromotions().length },
    { label: "Filières", value: getFilieres().length },
    { label: "Étudiants", value: getStudents().length },
  ];

  return (
    <AdminLayout>
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <header>
          <p className="text-sm font-medium text-primary">
            Bienvenue, {session?.name}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Vue d’ensemble de la structure académique.
          </p>
        </header>

        <section aria-label="Effectifs académiques">
          <dl className="grid grid-cols-2 border-y border-border sm:grid-cols-3 lg:grid-cols-5">
            {metrics.map(({ label, value }) => (
              <div
                className="border-b border-r border-border px-4 py-4 last:border-r-0 sm:border-b-0"
                key={label}
              >
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-2xl font-semibold text-foreground">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="academic-links-title">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2
              className="text-lg font-semibold text-foreground"
              id="academic-links-title"
            >
              Gestion académique
            </h2>
            <span className="text-sm text-muted-foreground">
              Accès aux annuaires
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {academicLinks.map(({ title, description, to, icon: Icon }) => (
              <Link
                className="group flex min-h-24 items-center gap-4 border border-border bg-background p-4 transition-colors hover:border-primary/50 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                key={to}
                to={to}
              >
                <span className="flex size-10 shrink-0 items-center justify-center bg-muted text-primary">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-foreground">
                    {title}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {description}
                  </span>
                </span>
                <ArrowUpRight
                  className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                  size={18}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>
      </section>
    </AdminLayout>
  );
}

export default DashboardView;
