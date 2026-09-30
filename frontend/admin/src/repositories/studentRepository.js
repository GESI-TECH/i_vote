const STORAGE_KEY = "i-vote-admin-students";
const PROMOTIONS_STORAGE_KEY = "i-vote-admin-promotions";

const defaultFaculties = [
  {
    id: 1,
    name: "Faculté des Sciences et technologies appliquées",
    code: "FSTA",
    description: "La Faculté des Sciences et technologies appliquées (FSTA) ",
  },
  {
    id: 2,
    name: "Faculté des Sciences juridiques,politiques et administrative",
    code: "FSJPA",
    description:
      "La Faculté des Sciences juridiques,politiques et administrative (FSJPA) ",
  },
  {
    id: 3,
    name: "Faculté des Sciences de l'homme et de la société",
    code: "FSHS",
    description: "La Faculté des Sciences de l'homme et de la société (FSHS) ",
  },
  {
    id: 4,
    name: "Faculté de la sante publique",
    code: "FSP",
    description: "La Faculté des Sciences de l'homme et de la société (FSHS) ",
  },
  {
    id: 5,
    name: "Faculté de medecine humaine",
    code: "FMH",
    description: "La Faculté des Sciences de l'homme et de la société (FSHS) ",
  },
  {
    id: 6,
    name: "Faculté des Sciences psycholigique et de l'education",
    code: "FSPE",
    description: "La Faculté des Sciences de l'homme et de la société (FSHS) ",
  },
  {
    id: 7,
    name: "Faculté des Sciences economiques et de gestion",
    code: "FSEG",
    description: "La Faculté des Sciences de l'homme et de la société (FSHS) ",
  },
];

const defaultDepartments = [
  {
    id: 1,
    name: "GENI-INFORMATIQUE",
    code: "INFO",
    facultieId: 1,
  },
  {
    id: 2,
    name: "GENI-CIVILE",
    code: "CIVIL",
    facultieId: 1,
  },

  {
    id: 3,
    name: "GENI-ELECTRIQUE",
    code: "ELEC",
    facultieId: 1,
  },
  {
    id: 4,
    name: "GENI-MECANIQUE",
    code: "MECAN",
    facultieId: 1,
  },
  {
    id: 5,
    name: "THEOLOGIE-PROSTESTANTE",
    code: "THEO",
    facultieId: 3,
  },
  {
    id: 6,
    name: "MEDECINE-HUMAINE",
    code: "MEDH",
    facultieId: 5,
  },
  {
    id: 7,
    name: "SENTE-PUBLIQUE",
    code: "SANT",
    facultieId: 4,
  },
  {
    id: 8,
    name: "SCIENCES-ECONOMIQUES",
    code: "ECON",
    facultieId: 7,
  },
  {
    id: 9,
    name: "SCIENCES-DE-GESTION",
    code: "GEST",
    facultieId: 7,
  },
  {
    id: 10,
    name: "SCIENCES-JURIDIQUES",
    code: "JURI",
    facultieId: 2,
  },
  {
    id: 11,
    name: "SCIENCES-PSYCHOLOGIQUES",
    code: "PSY",
    facultieId: 6,
  },
  {
    id: 12,
    name: "SCIENCES-DE-L'EDUCATION",
    code: "EDUC",
    facultieId: 6,
  },
];

const defaultPromotions = [
  {
    id: 1,
    name: "L3 Informatique",
    code: "L3-INFO",
    departmentId: 1,
  },
  {
    id: 2,
    name: "M1 Gestion",
    code: "M1-GEST",
    departmentId: 9,
  },
  {
    id: 3,
    name: "L2 Droit",
    code: "L2-JURI",
    departmentId: 10,
  },
];

const defaultFilieres = [
  {
    id: 1,
    name: "Génie logiciel",
    code: "GENLOG",
    promotionId: 1,
  },
  {
    id: 2,
    name: "Réseaux et systèmes",
    code: "RESEAUX",
    promotionId: 1,
  },
  {
    id: 3,
    name: "Finance",
    code: "FIN",
    promotionId: 2,
  },
];

const defaultStudents = [
  {
    id: 1,
    fullName: "Amine Diallo",
    birthDate: "2003-05-14",
    gender: "m",
    matricule: "20240001",
    promotion: "L3 Informatique",
    departmentId: 1,
    facultyId: 1,
    department: "GENI-INFORMATIQUE",
    faculty: "Faculté des Sciences et technologies appliquées",
  },
  {
    id: 2,
    fullName: "Sophie Martin",
    birthDate: "2002-11-08",
    gender: "f",
    matricule: "20240002",
    promotion: "M1 Gestion",
    departmentId: 9,
    facultyId: 7,
    department: "SCIENCES-DE-GESTION",
    faculty: "Faculté des Sciences economiques et de gestion",
  },
  {
    id: 3,
    fullName: "Ibrahima Diop",
    birthDate: "2004-02-21",
    gender: "m",
    matricule: "20240003",
    promotion: "L2 Droit",
    departmentId: 10,
    facultyId: 2,
    department: "SCIENCES-JURIDIQUES",
    faculty: "Faculté des Sciences juridiques,politiques et administrative",
  },
];

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `student-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function generatePromotionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `promotion-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizePromotion(promotion = {}) {
  return {
    id: promotion.id ?? generatePromotionId(),
    name: promotion.name ?? promotion.nom ?? "",
    code: promotion.code ?? "",
    departmentId:
      promotion.departmentId ??
      promotion.departementId ??
      promotion.departement ??
      "",
  };
}

function readPromotions() {
  try {
    const raw = localStorage.getItem(PROMOTIONS_STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(
        PROMOTIONS_STORAGE_KEY,
        JSON.stringify(defaultPromotions),
      );
      return [...defaultPromotions];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(
        PROMOTIONS_STORAGE_KEY,
        JSON.stringify(defaultPromotions),
      );
      return [...defaultPromotions];
    }

    return parsed.map(normalizePromotion);
  } catch (error) {
    console.error("Erreur lors de la lecture des promotions:", error);
    return [...defaultPromotions];
  }
}

function writePromotions(promotions) {
  localStorage.setItem(PROMOTIONS_STORAGE_KEY, JSON.stringify(promotions));
  return promotions;
}

function normalizeStudent(student = {}) {
  return {
    id: student.id ?? generateId(),
    fullName:
      student.fullName ??
      [student.firstName, student.lastName].filter(Boolean).join(" "),
    birthDate: student.birthDate ?? student.dateOfBirth ?? "",
    gender: student.gender ?? student.genre ?? "",
    matricule: student.matricule ?? "",
    promotion: student.promotion ?? "",
    departmentId: student.departmentId ?? student.departementId ?? "",
    facultyId: student.facultyId ?? student.faculteId ?? "",
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
      student.fullName,
      student.birthDate,
      student.gender,
      student.matricule,
      student.promotion,
      student.department,
      student.faculty,
    ].filter(Boolean);

    return values.some((value) =>
      value.toString().toLowerCase().includes(normalizedQuery),
    );
  });
}

export function getPromotions() {
  return readPromotions();
}

export function getPromotionById(id) {
  const promotions = readPromotions();
  return (
    promotions.find((promotion) => String(promotion.id) === String(id)) ?? null
  );
}

export function createPromotion(promotionInput = {}) {
  const promotions = readPromotions();
  const newPromotion = normalizePromotion({
    ...promotionInput,
    id: promotionInput.id ?? generatePromotionId(),
  });

  const nextPromotions = [...promotions, newPromotion];
  writePromotions(nextPromotions);
  return newPromotion;
}

export function updatePromotion(id, promotionInput = {}) {
  const promotions = readPromotions();
  const index = promotions.findIndex(
    (promotion) => String(promotion.id) === String(id),
  );

  if (index === -1) {
    return null;
  }

  const updatedPromotion = normalizePromotion({
    ...promotions[index],
    ...promotionInput,
    id,
  });

  const nextPromotions = [...promotions];
  nextPromotions[index] = updatedPromotion;
  writePromotions(nextPromotions);
  return updatedPromotion;
}

export function deletePromotion(id) {
  const promotions = readPromotions();
  const nextPromotions = promotions.filter(
    (promotion) => String(promotion.id) !== String(id),
  );
  writePromotions(nextPromotions);
  return nextPromotions;
}

export function searchPromotions(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return readPromotions();
  }

  return readPromotions().filter((promotion) => {
    const department = defaultDepartments.find(
      (item) => String(item.id) === String(promotion.departmentId),
    );
    const values = [promotion.name, promotion.code, department?.name].filter(
      Boolean,
    );

    return values.some((value) =>
      value.toString().toLowerCase().includes(normalizedQuery),
    );
  });
}

export function getDepartments() {
  return [...defaultDepartments];
}

export function getFaculties() {
  return [...defaultFaculties];
}

export function getFilieres() {
  return [...defaultFilieres];
}
