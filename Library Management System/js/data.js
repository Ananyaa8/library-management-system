/**
 * Granthālaya (ग्रन्थालय) - Heritage Library Management System
 * Classical Indian Library Collection & Seed Records
 */

const INITIAL_BOOKS = [
  {
    id: "BK-101",
    title: "The God of Small Things",
    author: "Arundhati Roy",
    isbn: "978-0812979053",
    category: "Fiction",
    shelf: "Bay A-12",
    totalCopies: 4,
    availableCopies: 3,
    description: "Booker Prize-winning masterpiece exploring family, love, and the social fabric of Ayemenem, Kerala."
  },
  {
    id: "BK-102",
    title: "Midnight's Children",
    author: "Salman Rushdie",
    isbn: "978-0812976533",
    category: "Historical Fiction",
    shelf: "Bay A-15",
    totalCopies: 3,
    availableCopies: 2,
    description: "An epic tale of India's transition from British colonialism to independence through magic realism."
  },
  {
    id: "BK-103",
    title: "Malgudi Days",
    author: "R.K. Narayan",
    isbn: "978-0143039655",
    category: "Classics",
    shelf: "Bay B-04",
    totalCopies: 5,
    availableCopies: 4,
    description: "Heartwarming short stories portraying the humorous, touching rhythms of life in fictional Malgudi."
  },
  {
    id: "BK-104",
    title: "The Guide",
    author: "R.K. Narayan",
    isbn: "978-8185986074",
    category: "Classics",
    shelf: "Bay B-05",
    totalCopies: 4,
    availableCopies: 4,
    description: "Sahitya Akademi Award winner recounting Raju's transformation from tour guide to revered spiritual saint."
  },
  {
    id: "BK-105",
    title: "Train to Pakistan",
    author: "Khushwant Singh",
    isbn: "978-0143065883",
    category: "Historical Fiction",
    shelf: "Bay B-18",
    totalCopies: 3,
    availableCopies: 3,
    description: "Poignant historical novel depicting the human tragedy of the 1947 Partition in the village of Mano Majra."
  },
  {
    id: "BK-106",
    title: "The Palace of Illusions",
    author: "Chitra Banerjee Divakaruni",
    isbn: "978-1400096206",
    category: "Mythology & Epics",
    shelf: "Bay C-07",
    totalCopies: 4,
    availableCopies: 3,
    description: "A feminist reimagining of the world-famous Mahabharata through the eyes of Panchaali (Draupadi)."
  },
  {
    id: "BK-107",
    title: "The Discovery of India",
    author: "Jawaharlal Nehru",
    isbn: "978-0143031031",
    category: "Indian History",
    shelf: "Bay D-08",
    totalCopies: 4,
    availableCopies: 3,
    description: "Penned in Ahmednagar Fort prison, a profound journey through India's 5,000-year philosophical and cultural ethos."
  },
  {
    id: "BK-108",
    title: "Wings of Fire",
    author: "Dr. A.P.J. Abdul Kalam & Arun Tiwari",
    isbn: "978-8173711466",
    category: "Biography & Science",
    shelf: "Bay D-01",
    totalCopies: 6,
    availableCopies: 6,
    description: "Inspiring autobiography of India's Missile Man and beloved 11th President, tracing his humble beginnings in Rameswaram."
  },
  {
    id: "BK-109",
    title: "Autobiography of a Yogi",
    author: "Paramahansa Yogananda",
    isbn: "978-0876120835",
    category: "Philosophy & Spirituality",
    shelf: "Bay E-02",
    totalCopies: 4,
    availableCopies: 4,
    description: "Spiritual classic unveiling the ancient science of Kriya Yoga, saints of India, and cosmic meditation."
  },
  {
    id: "BK-110",
    title: "Gitanjali (Song Offerings)",
    author: "Rabindranath Tagore",
    isbn: "978-8129115713",
    category: "Poetry & Philosophy",
    shelf: "Bay E-11",
    totalCopies: 5,
    availableCopies: 5,
    description: "The Nobel Prize-winning collection of mystical poems celebrating divine communion, nature, and the human soul."
  },
  {
    id: "BK-111",
    title: "A Fine Balance",
    author: "Rohinton Mistry",
    isbn: "978-1400030651",
    category: "Fiction",
    shelf: "Bay C-14",
    totalCopies: 3,
    availableCopies: 3,
    description: "An emotional panoramic novel weaving four disparate lives together during the turbulent 1975 State of Emergency."
  },
  {
    id: "BK-112",
    title: "Raag Darbari",
    author: "Shrilal Shukla",
    isbn: "978-8126715463",
    category: "Classics & Satire",
    shelf: "Bay B-22",
    totalCopies: 4,
    availableCopies: 4,
    description: "Iconic Hindi satirical novel dissecting rural Indian politics, education, and bureaucratic culture in Shivpalganj."
  },
  {
    id: "BK-113",
    title: "The White Tiger",
    author: "Aravind Adiga",
    isbn: "978-1416562603",
    category: "Contemporary Fiction",
    shelf: "Bay C-19",
    totalCopies: 4,
    availableCopies: 4,
    description: "Man Booker Prize winner portraying Balram Halwai's dark, witty rise from Bihar's rooster coop to Bengaluru entrepreneur."
  },
  {
    id: "BK-114",
    title: "Arthashastra",
    author: "Kautilya (Chanakya)",
    isbn: "978-0140446036",
    category: "Ancient Polity & Philosophy",
    shelf: "Bay E-20",
    totalCopies: 3,
    availableCopies: 3,
    description: "Ancient 4th century BCE treatise on statecraft, economic policy, diplomacy, and administrative governance."
  },
  {
    id: "BK-115",
    title: "The Immortals of Meluha",
    author: "Amish Tripathi",
    isbn: "978-9380658742",
    category: "Mythology & Epics",
    shelf: "Bay A-25",
    totalCopies: 5,
    availableCopies: 4,
    description: "Bestselling Shiva Trilogy opener detailing the Tibetan tribal warrior Shiva's journey to the land of Meluha."
  }
];

const INITIAL_STUDENTS = [
  {
    id: "STU-001",
    name: "Ananya Chawla",
    email: "ananyachawla08032004@gmail.com",
    phone: "8372947893",
    rollNo: "DU-2024-ENG-042",
    department: "English Literature"
  },
  {
    id: "STU-002",
    name: "Aarav Sharma",
    email: "aarav.sharma@iitd.ac.in",
    phone: "9820154321",
    rollNo: "IITD-2023-CS-118",
    department: "Computer Science"
  },
  {
    id: "STU-003",
    name: "Rohan Verma",
    email: "rohan.verma@delhiuni.ac.in",
    phone: "9811234567",
    rollNo: "DU-2024-HIS-089",
    department: "Indian History & Culture"
  },
  {
    id: "STU-004",
    name: "Priya Patel",
    email: "priya.patel@gujaratuni.ac.in",
    phone: "9723456789",
    rollNo: "GU-2023-ECO-205",
    department: "Economics & Public Policy"
  },
  {
    id: "STU-005",
    name: "Ishaan Mukherjee",
    email: "ishaan.m@presidency.ac.in",
    phone: "9830123456",
    rollNo: "PU-2024-PHIL-015",
    department: "Philosophy"
  },
  {
    id: "STU-006",
    name: "Kavya Sundaram",
    email: "kavya.sundaram@iitm.ac.in",
    phone: "9444123890",
    rollNo: "IITM-2024-IND-177",
    department: "Indology & Sanskrit"
  }
];

const INITIAL_LIBRARIANS = [
  {
    id: "LIB-001",
    name: "Abhilasha Sen",
    age: 27,
    phone: "9873276387",
    role: "Senior Archivist & Curator",
    shift: "Morning (08:00 - 16:00)"
  },
  {
    id: "LIB-002",
    name: "Rajesh Nambiar",
    age: 35,
    phone: "9812345678",
    role: "Chief Librarian",
    shift: "General (09:00 - 17:00)"
  },
  {
    id: "LIB-003",
    name: "Sunita Deshmukh",
    age: 42,
    phone: "9822456712",
    role: "Cataloguing Specialist",
    shift: "Day (10:00 - 18:00)"
  },
  {
    id: "LIB-004",
    name: "Vikramaditya Joshi",
    age: 31,
    phone: "9899123411",
    role: "Lending Desk In-charge",
    shift: "Evening (12:00 - 20:00)"
  }
];

const INITIAL_BORROWINGS = [
  {
    id: "BRW-001",
    bookId: "BK-101",
    bookTitle: "The God of Small Things",
    studentId: "STU-001",
    borrowerName: "Ananya Chawla",
    borrowerEmail: "ananyachawla08032004@gmail.com",
    borrowerPhone: "8372947893",
    borrowedDate: "2026-09-20",
    dueDate: "2026-10-04",
    returnedDate: "2026-10-02",
    status: "returned"
  },
  {
    id: "BRW-002",
    bookId: "BK-103",
    bookTitle: "Malgudi Days",
    studentId: "STU-002",
    borrowerName: "Aarav Sharma",
    borrowerEmail: "aarav.sharma@iitd.ac.in",
    borrowerPhone: "9820154321",
    borrowedDate: "2026-09-22",
    dueDate: "2026-10-06",
    returnedDate: "2026-10-03",
    status: "returned"
  },
  {
    id: "BRW-003",
    bookId: "BK-102",
    bookTitle: "Midnight's Children",
    studentId: "STU-003",
    borrowerName: "Rohan Verma",
    borrowerEmail: "rohan.verma@delhiuni.ac.in",
    borrowerPhone: "9811234567",
    borrowedDate: "2026-10-01",
    dueDate: "2026-10-15",
    returnedDate: null,
    status: "active"
  },
  {
    id: "BRW-004",
    bookId: "BK-106",
    bookTitle: "The Palace of Illusions",
    studentId: "STU-004",
    borrowerName: "Priya Patel",
    borrowerEmail: "priya.patel@gujaratuni.ac.in",
    borrowerPhone: "9723456789",
    borrowedDate: "2026-10-02",
    dueDate: "2026-10-16",
    returnedDate: null,
    status: "active"
  },
  {
    id: "BRW-005",
    bookId: "BK-115",
    bookTitle: "The Immortals of Meluha",
    studentId: "STU-006",
    borrowerName: "Kavya Sundaram",
    borrowerEmail: "kavya.sundaram@iitm.ac.in",
    borrowerPhone: "9444123890",
    borrowedDate: "2026-10-03",
    dueDate: "2026-10-17",
    returnedDate: null,
    status: "active"
  }
];

window.INITIAL_DATA = {
  books: INITIAL_BOOKS,
  students: INITIAL_STUDENTS,
  librarians: INITIAL_LIBRARIANS,
  borrowings: INITIAL_BORROWINGS
};
