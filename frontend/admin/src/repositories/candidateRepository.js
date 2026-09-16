const STORAGE_KEY = "i-vote-admin-candidates";

const defaultCandidates = [
  {
    id: 1,
    studentId: 1,
    fullName: "Amine Diallo",
    position: "Président",
    program: "Informatique",
    party: "Alternative citoyenne",
    status: "actif",
  },
  {
    id: 2,
    studentId: 2,
    fullName: "Sophie Martin",
    position: "Vice-présidente",
    program: "Gestion",
    party: "Union étudiante",
    status: "actif",
  },
  {
    id: 3,
    studentId: 3,
    fullName: "Ibrahima Diop",
    position: "Secrétaire général",
    program: "Droit",
    party: "Rassemblement étudiant",
    status: "inactif",
  },
];

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `candidate-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeCandidate(candidate = {}) {
  return {
    id: candidate.id ?? generateId(),
    studentId: candidate.studentId ?? null,
    fullName: candidate.fullName ?? "",
    position: candidate.position ?? "",
    program: candidate.program ?? "",
    party: candidate.party ?? "",
    status: candidate.status ?? "actif",
  };
}

function readCandidates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCandidates));
      return [...defaultCandidates];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCandidates));
      return [...defaultCandidates];
    }

    return parsed.map(normalizeCandidate);
  } catch (error) {
    console.error("Erreur lors de la lecture des candidats:", error);
    return [...defaultCandidates];
  }
}

function writeCandidates(candidates) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  return candidates;
}

export function getCandidates() {
  return readCandidates();
}

export function getCandidateById(id) {
  const candidates = readCandidates();
  return (
    candidates.find((candidate) => String(candidate.id) === String(id)) ?? null
  );
}

export function createCandidate(candidateInput = {}) {
  const candidates = readCandidates();
  const newCandidate = normalizeCandidate({
    ...candidateInput,
    id: candidateInput.id ?? generateId(),
  });

  const nextCandidates = [...candidates, newCandidate];
  writeCandidates(nextCandidates);
  return newCandidate;
}

export function updateCandidate(id, candidateInput = {}) {
  const candidates = readCandidates();
  const index = candidates.findIndex(
    (candidate) => String(candidate.id) === String(id),
  );

  if (index === -1) {
    return null;
  }

  const updatedCandidate = normalizeCandidate({
    ...candidates[index],
    ...candidateInput,
    id,
  });

  const nextCandidates = [...candidates];
  nextCandidates[index] = updatedCandidate;
  writeCandidates(nextCandidates);
  return updatedCandidate;
}

export function deleteCandidate(id) {
  const candidates = readCandidates();
  const nextCandidates = candidates.filter(
    (candidate) => String(candidate.id) !== String(id),
  );
  writeCandidates(nextCandidates);
  return nextCandidates;
}

export function searchCandidates(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return readCandidates();
  }

  return readCandidates().filter((candidate) => {
    const values = [
      candidate.fullName,
      candidate.position,
      candidate.program,
      candidate.party,
    ].filter(Boolean);

    return values.some((value) =>
      value.toString().toLowerCase().includes(normalizedQuery),
    );
  });
}
