const STORAGE_KEY = "i-vote-admin-elections";

const defaultElections = [
  {
    id: 1,
    title: "Élection du Bureau des étudiants",
    type: "présidentielle",
    status: "active",
    startDate: "2026-09-20",
    endDate: "2026-09-27",
    description:
      "Vote pour l’élection du bureau des étudiants de l’université.",
  },
  {
    id: 2,
    title: "Élection des représentants de promotion",
    type: "représentative",
    status: "draft",
    startDate: "2026-10-02",
    endDate: "2026-10-09",
    description: "Élection des représentants au conseil de promotion.",
  },
];

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `election-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeElection(election = {}) {
  return {
    id: election.id ?? generateId(),
    title: election.title ?? "",
    type: election.type ?? "présidentielle",
    status: election.status ?? "draft",
    startDate: election.startDate ?? "",
    endDate: election.endDate ?? "",
    description: election.description ?? "",
  };
}

function readElections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultElections));
      return [...defaultElections];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultElections));
      return [...defaultElections];
    }

    return parsed.map(normalizeElection);
  } catch (error) {
    console.error("Erreur lors de la lecture des élections:", error);
    return [...defaultElections];
  }
}

function writeElections(elections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(elections));
  return elections;
}

export function getElections() {
  return readElections();
}

export function getElectionById(id) {
  const elections = readElections();
  return (
    elections.find((election) => String(election.id) === String(id)) ?? null
  );
}

export function createElection(electionInput = {}) {
  const elections = readElections();
  const newElection = normalizeElection({
    ...electionInput,
    id: electionInput.id ?? generateId(),
  });

  const nextElections = [...elections, newElection];
  writeElections(nextElections);
  return newElection;
}

export function updateElection(id, electionInput = {}) {
  const elections = readElections();
  const index = elections.findIndex(
    (election) => String(election.id) === String(id),
  );

  if (index === -1) {
    return null;
  }

  const updatedElection = normalizeElection({
    ...elections[index],
    ...electionInput,
    id,
  });

  const nextElections = [...elections];
  nextElections[index] = updatedElection;
  writeElections(nextElections);
  return updatedElection;
}

export function deleteElection(id) {
  const elections = readElections();
  const nextElections = elections.filter(
    (election) => String(election.id) !== String(id),
  );
  writeElections(nextElections);
  return nextElections;
}

export function searchElections(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return readElections();
  }

  return readElections().filter((election) => {
    const values = [
      election.title,
      election.type,
      election.status,
      election.description,
    ].filter(Boolean);

    return values.some((value) =>
      value.toString().toLowerCase().includes(normalizedQuery),
    );
  });
}
