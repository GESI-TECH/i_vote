import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getFaculties,
  getPromotions,
  getStudents,
} from "../../repositories/studentRepository";

function findById(items, id) {
  return items.find((item) => String(item.id) === String(id));
}

function getDirectory(resource) {
  const faculties = getFaculties();
  const promotions = getPromotions();

  const directories = {
    facultes: {
      title: "Facultés",
      description: "Consultez les facultés enregistrées dans l’université.",
      columns: [
        { key: "name", label: "Nom" },
        { key: "code", label: "Code" },
        { key: "description", label: "Description" },
      ],
      rows: faculties,
    },
    promotions: {
      title: "Promotions",
      description: "Promotions rattachées à une faculté.",
      columns: [
        { key: "name", label: "Promotion" },
        { key: "code", label: "Code" },
        { key: "facultyName", label: "Faculté" },
      ],
      rows: promotions.map((promotion) => ({
        ...promotion,
        facultyName:
          findById(faculties, promotion.facultyId ?? promotion.faculteId)?.name ??
          "Non renseignée",
      })),
    },
    etudiants: {
      title: "Étudiants",
      description: "Étudiants et rattachements académiques.",
      columns: [
        { key: "fullName", label: "Nom complet" },
        { key: "matricule", label: "Matricule" },
        { key: "birthDate", label: "Date de naissance" },
        { key: "genderLabel", label: "Genre" },
        { key: "promotionName", label: "Promotion" },
        { key: "facultyName", label: "Faculté" },
      ],
      rows: getStudents().map((student) => {
        const promotion =
          findById(promotions, student.promotionId) ??
          promotions.find((item) => item.name === student.promotion);
        const faculty = findById(
          faculties,
          student.facultyId ?? student.facultieId ?? promotion?.facultyId,
        );

        return {
          ...student,
          genderLabel:
            student.gender === "m"
              ? "Masculin"
              : student.gender === "f"
                ? "Féminin"
                : "Non renseigné",
          promotionName:
            promotion?.name ?? student.promotion ?? "Non renseignée",
          facultyName: faculty?.name ?? "Non renseignée",
        };
      }),
    },
  };

  return directories[resource];
}

function AcademicDirectoryView({ resource }) {
  const [query, setQuery] = useState("");
  const directory = getDirectory(resource);
  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    if (!normalizedQuery) return directory.rows;

    return directory.rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLocaleLowerCase("fr")
          .includes(normalizedQuery),
      ),
    );
  }, [directory.rows, query]);

  return (
    <AdminLayout>
      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Gestion académique
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
              {directory.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {directory.description}
            </p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Rechercher dans {directory.title}</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={17}
              aria-hidden="true"
            />
            <input
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher..."
            />
          </label>
        </header>

        <div className="border-y border-border">
          <div className="flex items-center justify-between py-3 text-sm">
            <h2 className="font-medium text-foreground">Liste</h2>
            <span className="text-muted-foreground">
              {filteredRows.length} résultat{filteredRows.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-border bg-muted/60">
                  {directory.columns.map((column) => (
                    <th
                      key={column.key}
                      className="whitespace-nowrap px-4 py-3 font-medium text-muted-foreground"
                      scope="col"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    className="border-b border-border last:border-0"
                    key={row.id}
                  >
                    {directory.columns.map((column) => (
                      <td
                        className="max-w-sm px-4 py-3 text-foreground"
                        key={column.key}
                      >
                        {row[column.key] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-muted-foreground"
                      colSpan={directory.columns.length}
                    >
                      Aucun résultat trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AcademicDirectoryView;
