import {
  User,
  BasicTopic,
  Flashcard,
  QuizQuestion,
  StudentAcademicRecord,
  AcademicCourse,
  AcademicAnnouncement,
  AuthRulesConfig,
  RolePermission,
  AuditLogEntry,
} from '../types/auth';

// ============================================================
// DEFAULT USERS (NAME & PASSWORD CREDENTIALS)
// ============================================================

export const DEFAULT_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'admin',
    role: 'admin',
    title: 'Dean of Microbial Sciences & Academic Affairs',
    email: 'academic.admin@microsphere.edu',
    avatar: '🛡️',
    lastLogin: 'Today at 09:15 AM',
  },
  {
    id: 'usr_student_01',
    name: 'student',
    role: 'student',
    studentId: 'STU-2026-0842',
    title: 'Microbiology Undergraduate (Year 2)',
    email: 'alex.rivera@students.microsphere.edu',
    avatar: '🎓',
    lastLogin: 'Today at 10:40 AM',
  },
  {
    id: 'usr_admin_02',
    name: 'Dr. Sarah Mitchell',
    role: 'admin',
    title: 'Department Chair & Lead Academic Advisor',
    email: 's.mitchell@microsphere.edu',
    avatar: '🔬',
    lastLogin: 'Yesterday at 04:20 PM',
  },
  {
    id: 'usr_student_02',
    name: 'Elena Rostova',
    role: 'student',
    studentId: 'STU-2026-0914',
    title: 'Biochemistry & Virology Major',
    email: 'elena.rostova@students.microsphere.edu',
    avatar: '🧪',
    lastLogin: 'Today at 08:30 AM',
  },
];

export const DEFAULT_PASSWORDS: Record<string, string> = {
  admin: 'admin123',
  student: 'student123',
  'Dr. Sarah Mitchell': 'admin123',
  'Elena Rostova': 'student123',
};

// ============================================================
// STUDENT: "THE BASICS" DATA
// ============================================================

export const BASIC_TOPICS: BasicTopic[] = [
  {
    id: 'basic-intro',
    title: '1. What is a Microbe?',
    subtitle: 'The fundamental kingdoms & scale of invisible life',
    readTime: '3 min read',
    level: 'Foundational',
    icon: '🦠',
    summary:
      'Microorganisms are microscopic living entities encompassing bacteria, archaea, fungi, protozoa, and microscopic algae, along with acellular entities like viruses.',
    keyPoints: [
      'Prokaryotes (Bacteria & Archaea) possess no membrane-bound nucleus and contain circular DNA.',
      'Eukaryotes (Fungi, Protozoa) possess a distinct nuclear membrane and specialized organelles like mitochondria.',
      'Viruses are non-cellular obligate parasites that require host machinery to duplicate.',
      'Size rule of thumb: Viruses (20–300 nm) < Bacteria (0.5–5 μm) < Eukaryotic cells (10–100 μm).',
    ],
    clinicalRelevance:
      'Understanding cell type determines selective toxicity: antibiotics specifically target bacterial cell structures (e.g. peptidoglycan, 70S ribosomes) without harming human host cells.',
  },
  {
    id: 'basic-cell-wall',
    title: '2. Cell Structure & Anatomy Basics',
    subtitle: 'Core components of bacterial architecture',
    readTime: '4 min read',
    level: 'Essential',
    icon: '🛡️',
    summary:
      'Bacteria share universal structures (cell membrane, cytoplasm, ribosomes, nucleoid) while exhibiting unique protective layers such as peptidoglycan walls and polysaccharide capsules.',
    keyPoints: [
      'Peptidoglycan (murein) forms a mesh-like sac outside the plasma membrane preventing osmotic lysis.',
      'Ribosomes in bacteria are 70S (made of 50S and 30S subunits), structurally different from human 80S ribosomes.',
      'Flagella provide motive force (chemotaxis), while fimbriae/pili facilitate surface attachment and conjugation.',
      'Bacterial capsules prevent phagocytosis by host white blood cells and resist desiccation.',
    ],
    clinicalRelevance:
      'Gram-negative bacteria carry endotoxin (Lipopolysaccharide / LPS) in their outer membrane, which can trigger septic shock when released during severe systemic infections.',
  },
  {
    id: 'basic-staining',
    title: '3. Gram Staining Protocol & Classification',
    subtitle: 'The cornerstone differential staining method',
    readTime: '4 min read',
    level: 'Hands-on Lab',
    icon: '🧪',
    summary:
      'Developed by Hans Christian Gram in 1884, Gram staining divides bacteria into Gram-positive and Gram-negative based on physical cell wall thickness and chemical composition.',
    keyPoints: [
      'Step 1: Crystal Violet (Primary stain) turns all cells purple.',
      'Step 2: Gram Iodine (Mordant) forms an insoluble crystal violet-iodine (CV-I) complex inside the cell.',
      'Step 3: Acetone/Alcohol (Decolorizer) dissolves outer lipids in Gram-negatives and washes CV-I out.',
      'Step 4: Safranin (Counterstain) stains decolorized Gram-negative cells pink/red; Gram-positives remain deep purple.',
      'Gram-Positive: Thick peptidoglycan layer (20–80 nm), retains purple stain (e.g. Staphylococcus, Streptococcus).',
      'Gram-Negative: Thin peptidoglycan (2–7 nm) + Outer Membrane with LPS, stains pink (e.g. E. coli, Pseudomonas).',
    ],
    clinicalRelevance:
      'Gram status provides immediate initial diagnostic direction in hospitals within 30 minutes, guiding empirical antibiotic selection before culture sensitivity results are available.',
  },
  {
    id: 'basic-growth',
    title: '4. Bacterial Growth & Aseptic Culture',
    subtitle: 'Binary fission, growth curves, and sterile techniques',
    readTime: '3 min read',
    level: 'Core Concept',
    icon: '📈',
    summary:
      'Bacterial populations expand exponentially through binary fission under optimal temperature, moisture, pH, and nutrient availability.',
    keyPoints: [
      'Lag Phase: Adaptation to environment, enzyme synthesis, no immediate cell division.',
      'Log (Exponential) Phase: Rapid balanced cell division, predictable doubling time (generation time).',
      'Stationary Phase: Nutrient depletion and toxic waste accumulation cause rate of cell division to equal rate of death.',
      'Death / Decline Phase: Exponential loss of cell viability.',
      'Aseptic Technique: Working near a Bunsen flame or laminar flow hood to eliminate microbial contamination.',
    ],
    clinicalRelevance:
      'Antibiotics targeting cell wall synthesis (such as penicillin and cephalosporins) are most effective during the Log (exponential) growth phase when new peptidoglycan is being synthesized.',
  },
];

export const BASIC_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    term: 'Peptidoglycan',
    phonetic: '/ˌpɛptɪdoʊˈɡlaɪkən/',
    category: 'Cell Biology',
    definition:
      'A polymer composed of alternating sugars (NAG and NAM) cross-linked by short amino acid chains, forming the rigid structural cell wall of bacteria.',
    example: 'Penicillin disrupts the transpeptidase enzyme that cross-links peptidoglycan layers.',
  },
  {
    id: 'fc-2',
    term: 'Binary Fission',
    phonetic: '/ˈbaɪnəri ˈfɪʃən/',
    category: 'Reproduction',
    definition:
      'A form of asexual reproduction where a single parent bacterium replicates its circular chromosome and divides into two genetically identical daughter cells.',
    example: 'E. coli can undergo binary fission every 20 minutes in nutrient-rich broth at 37°C.',
  },
  {
    id: 'fc-3',
    term: 'Endospore',
    phonetic: '/ˈɛndoʊˌspɔːr/',
    category: 'Survival',
    definition:
      'A dormant, tough, non-reproductive structure produced by certain Gram-positive bacteria (e.g., Bacillus and Clostridium) to survive extreme heat, radiation, and disinfectants.',
    example: 'Autoclaving at 121°C under 15 psi pressure for 15 minutes is required to destroy endospores.',
  },
  {
    id: 'fc-4',
    term: 'Gram-Negative Outer Membrane',
    phonetic: '/ɡræm ˈnɛɡətɪv/',
    category: 'Anatomy',
    definition:
      'An asymmetric lipid bilayer external to the peptidoglycan layer in Gram-negative bacteria, containing Lipopolysaccharide (LPS/Endotoxin) and porin channels.',
    example: 'The outer membrane protects bacteria like Pseudomonas from penicillin and detergents.',
  },
  {
    id: 'fc-5',
    term: 'Plasmid',
    phonetic: '/ˈplæzmɪd/',
    category: 'Genetics',
    definition:
      'A small, circular, extrachromosomal DNA molecule capable of autonomous replication, often carrying genes conferring antibiotic resistance or virulence factors.',
    example: 'Plasmids can be rapidly transferred between different bacterial species via conjugation.',
  },
  {
    id: 'fc-6',
    term: 'Aseptic Technique',
    phonetic: '/eɪˈsɛptɪk tɛkˈniːk/',
    category: 'Lab Practice',
    definition:
      'A set of specific work practices designed to prevent contamination of cultures, sterile equipment, and laboratory environments by unwanted microorganisms.',
    example: 'Flaming inoculation loops before and after streaking agar plates is a standard aseptic rule.',
  },
  {
    id: 'fc-7',
    term: 'Chemotaxis',
    phonetic: '/ˌkiːmoʊˈtæksɪs/',
    category: 'Physiology',
    definition:
      'The directed movement of a microorganism toward chemical attractants (like glucose) or away from chemical repellents (like toxins) using rotating flagella.',
    example: 'Bacterial runs and tumbles alternate to guide the cell up a nutrient concentration gradient.',
  },
  {
    id: 'fc-8',
    term: 'Facultative Anaerobe',
    phonetic: '/ˈfækəlˌteɪtɪv ænˈɛəroʊb/',
    category: 'Metabolism',
    definition:
      'An organism that generates ATP by aerobic respiration when oxygen is present, but can switch to fermentation or anaerobic respiration when oxygen is absent.',
    example: 'Escherichia coli is a quintessential facultative anaerobe thriving in the mammalian intestine.',
  },
];

export const BASIC_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which of the following cellular structures is present in bacteria but ABSENT in human cells?',
    options: [
      '80S Ribosomes',
      'Peptidoglycan cell wall',
      'Phospholipid bilayer plasma membrane',
      'Linear DNA chromosomes',
    ],
    correctIndex: 1,
    explanation:
      'Peptidoglycan is unique to bacteria. Human cells have no cell wall, making peptidoglycan synthesis an ideal selective target for antibiotics like penicillin.',
    topic: 'Cell Anatomy',
  },
  {
    id: 'q2',
    question: 'In a standard Gram stain, what color do Gram-negative bacteria appear after proper completion?',
    options: ['Deep Purple', 'Bright Green', 'Pink / Red', 'Colorless'],
    correctIndex: 2,
    explanation:
      'Gram-negative bacteria lose the crystal violet-iodine complex during alcohol decolorization and are counterstained pink/red by safranin.',
    topic: 'Gram Staining',
  },
  {
    id: 'q3',
    question: 'During which phase of bacterial growth is the population dividing at its maximal and constant rate?',
    options: ['Lag Phase', 'Log (Exponential) Phase', 'Stationary Phase', 'Death Phase'],
    correctIndex: 1,
    explanation:
      'During the Log (exponential) phase, cells are dividing at their maximum rate under the given conditions, and generation time is constant.',
    topic: 'Bacterial Growth',
  },
  {
    id: 'q4',
    question: 'What is the primary role of bacterial endospores produced by Bacillus anthracis?',
    options: [
      'Active sexual reproduction',
      'Rapid exponential population growth',
      'Extreme environmental survival under harsh conditions',
      'Production of photosynthetic ATP',
    ],
    correctIndex: 2,
    explanation:
      'Endospores are not reproductive units; one cell forms one endospore. They are survival capsules capable of enduring desiccation, boiling, and radiation for decades.',
    topic: 'Microbial Survival',
  },
  {
    id: 'q5',
    question: 'Which component of the Gram-negative bacterial outer membrane acts as a potent endotoxin?',
    options: ['Teichoic acid', 'Lipopolysaccharide (LPS)', 'Mycolic acid', 'Flagellin protein'],
    correctIndex: 1,
    explanation:
      'Lipopolysaccharide (LPS), specifically the Lipid A portion, acts as an endotoxin that triggers massive cytokine release and potential septic shock.',
    topic: 'Pathogenesis Basics',
  },
];

export const BASIC_CHECKLIST_ITEMS = [
  { id: 'chk-1', text: 'Understand differences between Prokaryotes, Eukaryotes, and Viruses', defaultDone: true },
  { id: 'chk-2', text: 'Master the 4 steps and reagents of the Gram Stain protocol', defaultDone: true },
  { id: 'chk-3', text: 'Identify the 4 phases of the bacterial growth curve', defaultDone: false },
  { id: 'chk-4', text: 'Review why antibiotics do not kill human cells (Selective Toxicity)', defaultDone: false },
  { id: 'chk-5', text: 'Memorize the core terminology flashcards (Peptidoglycan, LPS, Endospore)', defaultDone: false },
  { id: 'chk-6', text: 'Score 80%+ on the Basics Knowledge Check Quiz', defaultDone: false },
];

// ============================================================
// ADMIN: "ACADEMIC INFORMATION" DATA
// ============================================================

export const INITIAL_STUDENT_ROSTER: StudentAcademicRecord[] = [
  {
    id: 'rec-001',
    studentId: 'STU-2026-0842',
    name: 'Alex Rivera',
    email: 'alex.rivera@students.microsphere.edu',
    program: 'B.S. Microbiology',
    year: '2nd Year',
    gpa: 3.84,
    standing: "Dean's List",
    enrolledCourse: 'MICR-101: Fundamentals of Microbiology',
    attendancePercent: 96,
    completedCredits: 48,
    quizAverage: 92.5,
  },
  {
    id: 'rec-002',
    studentId: 'STU-2026-0914',
    name: 'Elena Rostova',
    email: 'elena.rostova@students.microsphere.edu',
    program: 'B.S. Biochemistry & Virology',
    year: '3rd Year',
    gpa: 3.92,
    standing: "Dean's List",
    enrolledCourse: 'MICR-204: Microbial Genetics & Genomics',
    attendancePercent: 98,
    completedCredits: 76,
    quizAverage: 95.0,
  },
  {
    id: 'rec-003',
    studentId: 'STU-2026-0621',
    name: 'Marcus Chen',
    email: 'marcus.chen@students.microsphere.edu',
    program: 'B.S. Biomedical Sciences',
    year: '2nd Year',
    gpa: 3.65,
    standing: 'Good Standing',
    enrolledCourse: 'MICR-101: Fundamentals of Microbiology',
    attendancePercent: 92,
    completedCredits: 44,
    quizAverage: 88.0,
  },
  {
    id: 'rec-004',
    studentId: 'STU-2026-0773',
    name: 'Sophia Al-Mansoor',
    email: 'sophia.almansoor@students.microsphere.edu',
    program: 'B.S. Microbiology & Immunology',
    year: '4th Year',
    gpa: 3.97,
    standing: "Dean's List",
    enrolledCourse: 'MICR-310: Clinical Pathogenesis & Immunology',
    attendancePercent: 100,
    completedCredits: 112,
    quizAverage: 98.4,
  },
  {
    id: 'rec-005',
    studentId: 'STU-2026-0551',
    name: 'Jordan Taylor',
    email: 'jordan.taylor@students.microsphere.edu',
    program: 'B.S. Biotechnology',
    year: '1st Year',
    gpa: 2.82,
    standing: 'Academic Alert',
    enrolledCourse: 'MICR-101: Fundamentals of Microbiology',
    attendancePercent: 78,
    completedCredits: 16,
    quizAverage: 71.2,
  },
  {
    id: 'rec-006',
    studentId: 'STU-2026-0418',
    name: 'Devon Vance',
    email: 'devon.vance@students.microsphere.edu',
    program: 'M.S. Molecular Microbiology',
    year: 'Graduate',
    gpa: 3.88,
    standing: "Dean's List",
    enrolledCourse: 'MICR-420: Advanced Lab Techniques & Metagenomics',
    attendancePercent: 95,
    completedCredits: 24,
    quizAverage: 93.7,
  },
  {
    id: 'rec-007',
    studentId: 'STU-2026-0390',
    name: 'Aisha Patel',
    email: 'aisha.patel@students.microsphere.edu',
    program: 'B.S. Microbiology',
    year: '3rd Year',
    gpa: 3.51,
    standing: 'Good Standing',
    enrolledCourse: 'MICR-204: Microbial Genetics & Genomics',
    attendancePercent: 89,
    completedCredits: 72,
    quizAverage: 84.6,
  },
  {
    id: 'rec-008',
    studentId: 'STU-2026-0205',
    name: 'Liam Gallagher',
    email: 'liam.gallagher@students.microsphere.edu',
    program: 'B.S. Environmental Science',
    year: '2nd Year',
    gpa: 2.45,
    standing: 'Probation',
    enrolledCourse: 'MICR-101: Fundamentals of Microbiology',
    attendancePercent: 68,
    completedCredits: 38,
    quizAverage: 63.5,
  },
];

export const ACADEMIC_COURSES: AcademicCourse[] = [
  {
    code: 'MICR-101',
    name: 'Fundamentals of Microbiology',
    creditHours: 4,
    instructor: 'Dr. Sarah Mitchell, Ph.D.',
    semester: 'Fall / Spring 2026',
    schedule: 'Mon / Wed 10:00 AM – 11:30 AM + Lab Thu 2:00 PM',
    room: 'BioScience Hall 302 / Lab 104',
    enrolled: 48,
    capacity: 50,
    prerequisites: 'General Biology (BIOL-101) & Intro Chemistry (CHEM-101)',
    syllabusHighlights: [
      'Microbial taxonomy and domain classification',
      'Bacterial cell architecture and wall biochemistry',
      'Gram staining, spore staining, and darkfield microscopy',
      'Bacterial growth kinetics and selective/differential media',
    ],
  },
  {
    code: 'MICR-204',
    name: 'Microbial Genetics & Genomics',
    creditHours: 3,
    instructor: 'Prof. David Zhao, Ph.D.',
    semester: 'Spring 2026',
    schedule: 'Tue / Thu 1:00 PM – 2:30 PM',
    room: 'Science Complex 415',
    enrolled: 36,
    capacity: 40,
    prerequisites: 'MICR-101 & Organic Chemistry I',
    syllabusHighlights: [
      'Bacterial chromosome compaction and plasmid biology',
      'Horizontal Gene Transfer: Transformation, Transduction, Conjugation',
      'Mechanisms of antimicrobial resistance gene dissemination',
      'CRISPR-Cas9 adaptive immunity and RNA-guided nucleases',
    ],
  },
  {
    code: 'MICR-310',
    name: 'Clinical Pathogenesis & Immunology',
    creditHours: 4,
    instructor: 'Dr. Rebecca Vance, MD/Ph.D.',
    semester: 'Spring 2026',
    schedule: 'Mon / Wed / Fri 11:00 AM – 12:00 PM + Clinic Lab',
    room: 'Health Sciences C-12',
    enrolled: 29,
    capacity: 35,
    prerequisites: 'MICR-204 & Cell Biology',
    syllabusHighlights: [
      'Innate immunity: Toll-like receptors and phagocyte signaling',
      'Adaptive humoral and cell-mediated immune responses',
      'Bacterial virulence factors: Exotoxins, endotoxins, capsules',
      'Vaccine formulation platforms: mRNA, attenuated, subunit',
    ],
  },
  {
    code: 'MICR-420',
    name: 'Advanced Lab Techniques & Metagenomics',
    creditHours: 4,
    instructor: 'Prof. Henrik Lindqvist, Ph.D.',
    semester: 'Spring / Summer 2026',
    schedule: 'Wed / Fri 2:00 PM – 5:00 PM (Research Intensive)',
    room: 'Genomics Core Center G-08',
    enrolled: 18,
    capacity: 20,
    prerequisites: 'MICR-310 & Instructor Permission',
    syllabusHighlights: [
      'Next-Generation Sequencing (Illumina / Oxford Nanopore workflows)',
      '16S rRNA amplicon and shotgun metagenomic bioinformatic pipelines',
      'Multiplex flow cytometry and fluorescence-activated cell sorting',
      'Cryo-electron microscopy and high-throughput AMR surveillance',
    ],
  },
];

export const INITIAL_ANNOUNCEMENTS: AcademicAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Midterm Lab Practical Examination Schedule Announced',
    date: 'Sep 02, 2026',
    author: 'Academic Dean Office',
    priority: 'high',
    targetAudience: 'All',
    content:
      'The Midterm Laboratory Practicum for MICR-101 and MICR-204 will take place during Week 7 in BioScience Lab 104. Students will be assessed on Gram staining precision, unknown pathogen identification, and aseptic streak plating. Check student portal for assigned time slots.',
  },
  {
    id: 'ann-2',
    title: 'Dean\'s Honor List & Academic Distinction Eligibility for Fall 2026',
    date: 'Aug 28, 2026',
    author: 'Committee on Academic Standing',
    priority: 'normal',
    targetAudience: 'Undergraduate',
    content:
      'Undergraduate students maintaining a semester GPA >= 3.75 with at least 14 completed credit hours and no honor code infractions will be awarded Dean\'s List distinction. Certificates and research grant eligibility will be disbursed next week.',
  },
  {
    id: 'ann-3',
    title: 'Biosafety Level 2 (BSL-2) Protocol Refresh Mandatory Training',
    date: 'Aug 20, 2026',
    author: 'Department Safety Officer',
    priority: 'urgent',
    targetAudience: 'All',
    content:
      'All students and faculty working with clinical specimens or resistant bacterial strains must complete the updated annual BSL-2 autoclaving, aerosol containment, and waste disposal certification by Friday 5:00 PM.',
  },
];

// ============================================================
// DASHBOARD CONNECTED RULES & RBAC POLICIES
// ============================================================

export const DEFAULT_AUTH_RULES: AuthRulesConfig = {
  minNameLength: 3,
  minPasswordLength: 6,
  requireSpecialChar: false,
  allowRegistration: true,
  studentDefaultRoute: 'student-basics',
  adminDefaultRoute: 'admin-academic',
};

export const ROLE_PERMISSIONS_MATRIX: RolePermission[] = [
  {
    feature: 'Public Microbial Explorer',
    description: 'Explore 6 kingdoms, timeline, and lab equipment overview',
    guest: true,
    student: true,
    admin: true,
  },
  {
    feature: 'The Basics: Foundational Modules',
    description: 'Access core cell structures, Gram staining, and growth kinetics',
    guest: false,
    student: true,
    admin: true,
  },
  {
    feature: 'Interactive Flashcards & Terminology',
    description: 'Study 8 fundamental terminology flip-cards with examples',
    guest: false,
    student: true,
    admin: true,
  },
  {
    feature: 'Basics Knowledge Check Quiz',
    description: '5-question interactive self-assessment with score grading',
    guest: false,
    student: true,
    admin: true,
  },
  {
    feature: 'Student Study Checklist & Notes',
    description: 'Personal study milestones and auto-saved notes scratchpad',
    guest: false,
    student: true,
    admin: false,
  },
  {
    feature: 'Academic Student Rosters & GPAs',
    description: 'View full student database, standing, attendance, and grades',
    guest: false,
    student: false,
    admin: true,
  },
  {
    feature: 'Grade Ledger & GPA Editing',
    description: 'Modify student GPAs, update honors, or drop academic records',
    guest: false,
    student: false,
    admin: true,
  },
  {
    feature: 'Curriculum & Syllabi Management',
    description: 'Manage course credit hours, instructor assignments, and room schedules',
    guest: false,
    student: false,
    admin: true,
  },
  {
    feature: 'Academic Notice Publishing',
    description: 'Draft, prioritize, and broadcast official notices to students',
    guest: false,
    student: false,
    admin: true,
  },
  {
    feature: 'Authentication Rules & Role Control',
    description: 'Configure password/name rules, promote roles, and view audit logs',
    guest: false,
    student: false,
    admin: true,
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-01',
    timestamp: 'Today, 09:15 AM',
    userName: 'admin',
    role: 'admin',
    action: 'sign_in',
    status: 'success',
    details: 'Signed in successfully. Policy enforced: Name >= 3, Password >= 6 -> Routed to Academic Information Dashboard.',
  },
  {
    id: 'log-02',
    timestamp: 'Today, 10:40 AM',
    userName: 'student',
    role: 'student',
    action: 'sign_in',
    status: 'success',
    details: 'Signed in successfully. Policy enforced: Student account verified -> Routed to The Basics Learning Suite.',
  },
  {
    id: 'log-03',
    timestamp: 'Today, 11:05 AM',
    userName: 'Alex Rivera',
    role: 'student',
    action: 'sign_in',
    status: 'success',
    details: 'Student access authorized. Checklist and flashcards initialized.',
  },
  {
    id: 'log-04',
    timestamp: 'Yesterday, 04:30 PM',
    userName: 'Anonymous (Guest)',
    role: 'guest',
    action: 'sign_in',
    status: 'failed',
    details: 'Rejected: Password length (4) violated minimum required password rule (min 6 characters).',
  },
];
