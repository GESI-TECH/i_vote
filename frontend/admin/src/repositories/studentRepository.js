const STORAGE_KEY = "i-vote-admin-students";

const defaultStudents = [
  {
    id: 1,
    firstName: "Amine",
    lastName: "Diallo",
    email: "amine.diallo@univ.sn",
    matricule: "20240001",
    promotion: "L3 Informatique",
    status: "actif",
  },
  {
    id: 2,
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@univ.sn",
    matricule: "20240002",
    promotion: "M1 Gestion",
    status: "actif",
  },
  {
    id: 3,
    firstName: "Ibrahima",
    lastName: "Diop",
    email: "ibrahima.diop@univ.sn",
    matricule: "20240003",
    promotion: "L2 Droit",
    status: "inactif",
  },
];

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `student-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeStudent(student = {}) {
  return {
    id: student.id ?? generateId(),
    firstName: student.firstName ?? "",
    lastName: student.lastName ?? "",
    email: student.email ?? "",
    matricule: student.matricule ?? "",
    promotion: student.promotion ?? "",
    status: student.status ?? "actif",
  };
}

function readStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStudents));
      return [...defaultStudents];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStudents));
      return [...defaultStudents];
    }

    return parsed.map(normalizeStudent);
  } catch (error) {
    console.error("Erreur lors de la lecture des étudiants:", error);
    return [...defaultStudents];
  }
}

function writeStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  return students;
}

export function getStudents() {
  return readStudents();
}

export function getStudentById(id) {
  const students = readStudents();
  return students.find((student) => String(student.id) === String(id)) ?? null;
}

export function createStudent(studentInput = {}) {
  const students = readStudents();
  const newStudent = normalizeStudent({
    ...studentInput,
    id: studentInput.id ?? generateId(),
  });

  const nextStudents = [...students, newStudent];
  writeStudents(nextStudents);
  return newStudent;
}

export function updateStudent(id, studentInput = {}) {
  const students = readStudents();
  const index = students.findIndex(
    (student) => String(student.id) === String(id),
  );

  if (index === -1) {
    return null;
  }

  const updatedStudent = normalizeStudent({
    ...students[index],
    ...studentInput,
    id,
  });

  const nextStudents = [...students];
  nextStudents[index] = updatedStudent;
  writeStudents(nextStudents);
  return updatedStudent;
}

export function deleteStudent(id) {
  const students = readStudents();
  const nextStudents = students.filter(
    (student) => String(student.id) !== String(id),
  );
  writeStudents(nextStudents);
  return nextStudents;
}

export function searchStudents(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return readStudents();
  }

  return readStudents().filter((student) => {
    const values = [
      student.firstName,
      student.lastName,
      student.email,
      student.matricule,
      student.promotion,
    ].filter(Boolean);

    return values.some((value) =>
      value.toString().toLowerCase().includes(normalizedQuery),
    );
  });
}
