/**
 * GRANTHĀLAYA (ग्रन्थालय) - Classical Indian Library Management System
 * Main Application Controller & State Engine
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_KEYS = {
    AUTH: 'granthalaya_auth',
    BOOKS: 'granthalaya_books',
    STUDENTS: 'granthalaya_students',
    LIBRARIANS: 'granthalaya_librarians',
    BORROWINGS: 'granthalaya_borrowings'
  };

  // State
  let state = {
    currentUser: null,
    currentView: 'dashboard',
    books: [],
    students: [],
    librarians: [],
    borrowings: []
  };

  // DOM Elements
  const el = {
    loginWrapper: document.getElementById('loginWrapper'),
    appContainer: document.getElementById('appContainer'),
    loginForm: document.getElementById('loginForm'),
    usernameInput: document.getElementById('usernameInput'),
    passwordInput: document.getElementById('passwordInput'),
    loginError: document.getElementById('loginError'),
    navItems: document.querySelectorAll('.nav-item'),
    viewPanels: document.querySelectorAll('.view-panel'),
    signOutBtn: document.getElementById('signOutBtn'),
    toastContainer: document.getElementById('toastContainer'),

    // Modals
    modalBackdrop: document.getElementById('modalBackdrop'),
    modalTitle: document.getElementById('modalTitle'),
    modalForm: document.getElementById('modalForm'),
    modalBodyContent: document.getElementById('modalBodyContent'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),

    // Dashboard Elements
    statTotalBooks: document.getElementById('statTotalBooks'),
    statAvailable: document.getElementById('statAvailable'),
    statActiveLoans: document.getElementById('statActiveLoans'),
    statReturned: document.getElementById('statReturned'),
    statStudents: document.getElementById('statStudents'),
    statLibrarians: document.getElementById('statLibrarians'),
    recentActivityList: document.getElementById('recentActivityList'),

    // Table Containers
    booksTableBody: document.getElementById('booksTableBody'),
    studentsTableBody: document.getElementById('studentsTableBody'),
    librariansTableBody: document.getElementById('librariansTableBody'),
    borrowingsTableBody: document.getElementById('borrowingsTableBody'),

    // Search and Filters
    bookSearchInput: document.getElementById('bookSearchInput'),
    bookCategoryFilter: document.getElementById('bookCategoryFilter'),
    studentSearchInput: document.getElementById('studentSearchInput'),
    librarianSearchInput: document.getElementById('librarianSearchInput'),
    borrowingFilterSelect: document.getElementById('borrowingFilterSelect')
  };

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  function init() {
    loadStorageData();
    setupEventListeners();
    checkAuth();
  }

  function loadStorageData() {
    // Seed initial data if not present
    if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(window.INITIAL_DATA.books));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(window.INITIAL_DATA.students));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LIBRARIANS)) {
      localStorage.setItem(STORAGE_KEYS.LIBRARIANS, JSON.stringify(window.INITIAL_DATA.librarians));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BORROWINGS)) {
      localStorage.setItem(STORAGE_KEYS.BORROWINGS, JSON.stringify(window.INITIAL_DATA.borrowings));
    }

    try {
      state.books = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS)) || [];
      state.students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS)) || [];
      state.librarians = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIBRARIANS)) || [];
      state.borrowings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BORROWINGS)) || [];
      state.currentUser = localStorage.getItem(STORAGE_KEYS.AUTH);
    } catch (e) {
      console.error('Error loading storage data', e);
      resetDemoData();
    }
  }

  function saveData(key) {
    if (key === STORAGE_KEYS.BOOKS) {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(state.books));
    } else if (key === STORAGE_KEYS.STUDENTS) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(state.students));
    } else if (key === STORAGE_KEYS.LIBRARIANS) {
      localStorage.setItem(STORAGE_KEYS.LIBRARIANS, JSON.stringify(state.librarians));
    } else if (key === STORAGE_KEYS.BORROWINGS) {
      localStorage.setItem(STORAGE_KEYS.BORROWINGS, JSON.stringify(state.borrowings));
    }
    updateDashboardStats();
  }

  // =========================================================================
  // AUTHENTICATION
  // =========================================================================
  function checkAuth() {
    if (state.currentUser) {
      el.loginWrapper.style.display = 'none';
      el.appContainer.style.display = 'flex';
      switchView(state.currentView || 'dashboard');
    } else {
      el.loginWrapper.style.display = 'flex';
      el.appContainer.style.display = 'none';
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    const username = el.usernameInput.value.trim();
    const password = el.passwordInput.value.trim();

    // Default admin / admin123
    if (username === 'admin' && password === 'admin123') {
      state.currentUser = 'admin';
      localStorage.setItem(STORAGE_KEYS.AUTH, 'admin');
      el.loginError.style.display = 'none';
      el.loginForm.reset();
      showToast('Welcome to Granthālaya Library Desk');
      checkAuth();
    } else {
      el.loginError.textContent = 'Invalid credentials. Use admin / admin123';
      el.loginError.style.display = 'block';
    }
  }

  function handleSignOut() {
    state.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    showToast('Signed out successfully');
    checkAuth();
  }

  // =========================================================================
  // NAVIGATION & VIEW SWITCHING
  // =========================================================================
  function switchView(viewName) {
    state.currentView = viewName;

    // Update nav items
    el.navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update view panels
    el.viewPanels.forEach(panel => {
      if (panel.id === `view-${viewName}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Render corresponding view
    switch (viewName) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'books':
        renderBooksTable();
        break;
      case 'students':
        renderStudentsTable();
        break;
      case 'librarians':
        renderLibrariansTable();
        break;
      case 'borrowings':
        renderBorrowingsTable();
        break;
    }
  }

  // =========================================================================
  // DASHBOARD RENDERING
  // =========================================================================
  function renderDashboard() {
    updateDashboardStats();
    renderRecentActivity();
  }

  function updateDashboardStats() {
    const totalBooks = state.books.length;
    const availableBooks = state.books.filter(b => b.availableCopies > 0).length;
    const activeLoans = state.borrowings.filter(b => b.status === 'active').length;
    const returnedLoans = state.borrowings.filter(b => b.status === 'returned').length;
    const totalStudents = state.students.length;
    const totalLibrarians = state.librarians.length;

    if (el.statTotalBooks) el.statTotalBooks.textContent = totalBooks;
    if (el.statAvailable) el.statAvailable.textContent = availableBooks;
    if (el.statActiveLoans) el.statActiveLoans.textContent = activeLoans;
    if (el.statReturned) el.statReturned.textContent = returnedLoans;
    if (el.statStudents) el.statStudents.textContent = totalStudents;
    if (el.statLibrarians) el.statLibrarians.textContent = totalLibrarians;
  }

  function renderRecentActivity() {
    if (!el.recentActivityList) return;

    // Take the last 6 records (newest first)
    const recent = [...state.borrowings].reverse().slice(0, 6);

    if (recent.length === 0) {
      el.recentActivityList.innerHTML = `
        <li class="activity-item table-empty">
          <p>No recent borrowing activities recorded yet.</p>
        </li>
      `;
      return;
    }

    el.recentActivityList.innerHTML = recent.map(item => {
      const formattedDate = formatDateDisplay(item.borrowedDate);
      return `
        <li class="activity-item">
          <div class="activity-details">
            <h4>${escapeHtml(item.bookTitle)}</h4>
            <p>${escapeHtml(item.borrowerName)} · ${formattedDate}</p>
          </div>
          <span class="status-pill ${item.status}">${item.status}</span>
        </li>
      `;
    }).join('');
  }

  // =========================================================================
  // BOOKS VIEW (Catalogue)
  // =========================================================================
  function renderBooksTable() {
    if (!el.booksTableBody) return;

    const searchTerm = (el.bookSearchInput ? el.bookSearchInput.value : '').toLowerCase().trim();
    const categoryFilter = el.bookCategoryFilter ? el.bookCategoryFilter.value : 'all';

    let filtered = state.books.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.isbn.toLowerCase().includes(searchTerm) ||
        (book.shelf && book.shelf.toLowerCase().includes(searchTerm));

      const matchesCategory = (categoryFilter === 'all') || (book.category === categoryFilter);

      return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
      el.booksTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="table-empty">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p>No books found matching your search criteria.</p>
          </td>
        </tr>
      `;
      return;
    }

    el.booksTableBody.innerHTML = filtered.map(book => {
      const isAvailable = book.availableCopies > 0;
      return `
        <tr>
          <td>
            <div class="td-book-title" onclick="window.GranthalayaApp.viewBookDetails('${book.id}')" style="cursor: pointer; text-decoration: underline; text-decoration-color: transparent; transition: text-decoration-color 0.2s;" onmouseover="this.style.textDecorationColor='var(--primary-wine)'" onmouseout="this.style.textDecorationColor='transparent'" title="Click to view synopsis">${escapeHtml(book.title)}</div>
            <div class="td-book-author">by ${escapeHtml(book.author)}</div>
          </td>
          <td><span class="info-chip">${escapeHtml(book.category)}</span></td>
          <td style="font-family: monospace; font-size: 13px;">${escapeHtml(book.isbn)}</td>
          <td><span class="info-chip">${escapeHtml(book.shelf || 'Main Stacks')}</span></td>
          <td>
            <strong>${book.availableCopies}</strong> / ${book.totalCopies} copies
          </td>
          <td>
            <span class="status-pill ${isAvailable ? 'returned' : 'overdue'}">
              ${isAvailable ? 'available' : 'borrowed'}
            </span>
          </td>
          <td class="table-actions">
            ${isAvailable ? `
              <button class="btn-return-book" onclick="window.GranthalayaApp.openIssueBookModal('${book.id}')" title="Issue this book">
                + Issue
              </button>
            ` : ''}
            <button class="btn-icon-action" onclick="window.GranthalayaApp.openEditBookModal('${book.id}')" title="Edit book">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button class="btn-icon-action delete" onclick="window.GranthalayaApp.deleteBook('${book.id}')" title="Delete book">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // =========================================================================
  // STUDENTS VIEW (Patrons - Faithful to Screenshot 4)
  // =========================================================================
  function renderStudentsTable() {
    if (!el.studentsTableBody) return;

    const searchTerm = (el.studentSearchInput ? el.studentSearchInput.value : '').toLowerCase().trim();

    let filtered = state.students.filter(student => {
      return (
        student.name.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.phone.includes(searchTerm) ||
        (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm))
      );
    });

    if (filtered.length === 0) {
      el.studentsTableBody.innerHTML = `
        <tr>
          <td colspan="4" class="table-empty">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No student patrons found.</p>
          </td>
        </tr>
      `;
      return;
    }

    el.studentsTableBody.innerHTML = filtered.map(student => {
      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--text-title);">${escapeHtml(student.name)}</div>
            ${student.rollNo ? `<div style="font-size: 12px; color: var(--text-muted);">${escapeHtml(student.rollNo)}</div>` : ''}
          </td>
          <td>${escapeHtml(student.email)}</td>
          <td>${escapeHtml(student.phone)}</td>
          <td class="table-actions">
            <button class="btn-icon-action" onclick="window.GranthalayaApp.openEditStudentModal('${student.id}')" title="Edit student">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button class="btn-icon-action delete" onclick="window.GranthalayaApp.deleteStudent('${student.id}')" title="Delete student">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // =========================================================================
  // LIBRARIANS VIEW (Staff - Faithful to Screenshot 3)
  // =========================================================================
  function renderLibrariansTable() {
    if (!el.librariansTableBody) return;

    const searchTerm = (el.librarianSearchInput ? el.librarianSearchInput.value : '').toLowerCase().trim();

    let filtered = state.librarians.filter(lib => {
      return (
        lib.name.toLowerCase().includes(searchTerm) ||
        lib.phone.includes(searchTerm) ||
        (lib.role && lib.role.toLowerCase().includes(searchTerm))
      );
    });

    if (filtered.length === 0) {
      el.librariansTableBody.innerHTML = `
        <tr>
          <td colspan="4" class="table-empty">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p>No librarians on staff records.</p>
          </td>
        </tr>
      `;
      return;
    }

    el.librariansTableBody.innerHTML = filtered.map(lib => {
      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--text-title);">${escapeHtml(lib.name)}</div>
            ${lib.role ? `<div style="font-size: 12px; color: var(--text-muted);">${escapeHtml(lib.role)}</div>` : ''}
          </td>
          <td>${lib.age}</td>
          <td>${escapeHtml(lib.phone)}</td>
          <td class="table-actions">
            <button class="btn-icon-action" onclick="window.GranthalayaApp.openEditLibrarianModal('${lib.id}')" title="Edit librarian">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button class="btn-icon-action delete" onclick="window.GranthalayaApp.deleteLibrarian('${lib.id}')" title="Delete librarian">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // =========================================================================
  // BORROWINGS VIEW (Ledger - Faithful to Screenshot 2 & 5)
  // =========================================================================
  function renderBorrowingsTable() {
    if (!el.borrowingsTableBody) return;

    const filterVal = el.borrowingFilterSelect ? el.borrowingFilterSelect.value : 'all';

    let filtered = [...state.borrowings].reverse();

    if (filterVal !== 'all') {
      filtered = filtered.filter(b => b.status === filterVal);
    }

    if (filtered.length === 0) {
      el.borrowingsTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="table-empty">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No borrowing ledger entries matching filter.</p>
          </td>
        </tr>
      `;
      return;
    }

    el.borrowingsTableBody.innerHTML = filtered.map(item => {
      const isReturned = item.status === 'returned';
      return `
        <tr>
          <td class="td-book-title">${escapeHtml(item.bookTitle)}</td>
          <td style="font-weight: 500;">${escapeHtml(item.borrowerName)}</td>
          <td class="td-contact">
            <div class="email">${escapeHtml(item.borrowerEmail || '—')}</div>
            <div class="phone">${escapeHtml(item.borrowerPhone || '—')}</div>
          </td>
          <td>${formatDateDisplay(item.borrowedDate)}</td>
          <td>
            ${isReturned ? formatDateDisplay(item.returnedDate) : `
              <button class="btn-return-book" onclick="window.GranthalayaApp.returnBook('${item.id}')" title="Mark book as returned">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Mark Return
              </button>
            `}
          </td>
          <td>
            <span class="status-pill ${item.status}">${item.status}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // =========================================================================
  // BORROWING ACTIONS
  // =========================================================================
  function returnBook(borrowingId) {
    const loan = state.borrowings.find(b => b.id === borrowingId);
    if (!loan) return;

    if (loan.status === 'returned') {
      showToast('Book is already marked returned');
      return;
    }

    loan.status = 'returned';
    loan.returnedDate = new Date().toISOString().split('T')[0];

    // Restore book available copy
    const book = state.books.find(b => b.id === loan.bookId);
    if (book) {
      book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
      saveData(STORAGE_KEYS.BOOKS);
    }

    saveData(STORAGE_KEYS.BORROWINGS);
    renderBorrowingsTable();
    updateDashboardStats();
    showToast(`"${loan.bookTitle}" marked as returned`);
  }

  function issueNewBook(bookId, studentId, dueDate) {
    const book = state.books.find(b => b.id === bookId);
    const student = state.students.find(s => s.id === studentId);

    if (!book || !student) {
      showToast('Please select a valid book and student', 'error');
      return false;
    }

    if (book.availableCopies <= 0) {
      showToast('No copies currently available for this book', 'error');
      return false;
    }

    // Deduct copy
    book.availableCopies -= 1;
    saveData(STORAGE_KEYS.BOOKS);

    const newBorrowing = {
      id: `BRW-${Date.now().toString().slice(-4)}`,
      bookId: book.id,
      bookTitle: book.title,
      studentId: student.id,
      borrowerName: student.name,
      borrowerEmail: student.email,
      borrowerPhone: student.phone,
      borrowedDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      returnedDate: null,
      status: 'active'
    };

    state.borrowings.push(newBorrowing);
    saveData(STORAGE_KEYS.BORROWINGS);
    renderBorrowingsTable();
    updateDashboardStats();
    showToast(`Issued "${book.title}" to ${student.name}`);
    return true;
  }

  // =========================================================================
  // MODALS & CRUD FORMS
  // =========================================================================
  function openModal(title, formHtml, submitHandler) {
    el.modalTitle.textContent = title;
    el.modalBodyContent.innerHTML = formHtml;
    el.modalBackdrop.classList.add('open');

    el.modalForm.onsubmit = function (e) {
      e.preventDefault();
      const success = submitHandler();
      if (success !== false) {
        closeModal();
      }
    };
  }

  function closeModal() {
    el.modalBackdrop.classList.remove('open');
    el.modalBodyContent.innerHTML = '';
    el.modalForm.onsubmit = null;
  }

  // Books Modals
  function viewBookDetails(bookId) {
    const book = state.books.find(b => b.id === bookId);
    if (!book) return;

    const formHtml = `
      <div style="margin-bottom: 16px;">
        <span class="info-chip" style="margin-bottom: 8px;">${escapeHtml(book.category)}</span>
        <h2 style="font-size: 22px; margin-top: 4px; color: var(--text-title);">${escapeHtml(book.title)}</h2>
        <p style="font-size: 14px; color: var(--text-muted); font-style: italic;">By ${escapeHtml(book.author)}</p>
      </div>

      <div style="background-color: var(--bg-card-alt); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
        <p style="font-size: 14px; line-height: 1.6; color: var(--text-body);">${escapeHtml(book.description || 'Classical literature preserved in Granthālaya archives.')}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
        <div><strong>ISBN:</strong> <span style="font-family: monospace;">${escapeHtml(book.isbn)}</span></div>
        <div><strong>Shelf Location:</strong> ${escapeHtml(book.shelf || 'General Stacks')}</div>
        <div><strong>Total Copies:</strong> ${book.totalCopies}</div>
        <div><strong>Available Copies:</strong> <span style="color: ${book.availableCopies > 0 ? 'var(--status-returned-text)' : 'var(--status-overdue-text)'}; font-weight: 700;">${book.availableCopies}</span></div>
      </div>
    `;

    openModal('Volume Archival Details', formHtml, () => true);
  }

  function openAddBookModal() {
    const formHtml = `
      <div class="form-group">
        <label class="form-label">Book Title *</label>
        <input type="text" id="m_title" class="form-input" placeholder="e.g. Train to Pakistan" required />
      </div>
      <div class="form-group">
        <label class="form-label">Author Name *</label>
        <input type="text" id="m_author" class="form-input" placeholder="e.g. Khushwant Singh" required />
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Category *</label>
          <select id="m_category" class="form-input" required>
            <option value="Fiction">Fiction</option>
            <option value="Classics">Classics</option>
            <option value="Historical Fiction">Historical Fiction</option>
            <option value="Mythology & Epics">Mythology & Epics</option>
            <option value="Indian History">Indian History</option>
            <option value="Philosophy & Spirituality">Philosophy & Spirituality</option>
            <option value="Biography & Science">Biography & Science</option>
            <option value="Poetry & Philosophy">Poetry & Philosophy</option>
            <option value="Hindi Literature / Satire">Hindi Literature / Satire</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">ISBN Number *</label>
          <input type="text" id="m_isbn" class="form-input" placeholder="978-XXXXXXXXXX" required />
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Total Copies *</label>
          <input type="number" id="m_copies" class="form-input" min="1" max="100" value="3" required />
        </div>
        <div class="form-group">
          <label class="form-label">Shelf Bay / Section</label>
          <input type="text" id="m_shelf" class="form-input" placeholder="e.g. Bay B-14" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Description / Summary</label>
        <textarea id="m_desc" class="form-input" rows="2" placeholder="Brief outline of the volume..."></textarea>
      </div>
    `;

    openModal('Add Volume to Collection', formHtml, () => {
      const title = document.getElementById('m_title').value.trim();
      const author = document.getElementById('m_author').value.trim();
      const category = document.getElementById('m_category').value;
      const isbn = document.getElementById('m_isbn').value.trim();
      const copies = parseInt(document.getElementById('m_copies').value, 10) || 1;
      const shelf = document.getElementById('m_shelf').value.trim() || 'General Stacks';
      const desc = document.getElementById('m_desc').value.trim();

      const newBook = {
        id: `BK-${Date.now().toString().slice(-4)}`,
        title,
        author,
        category,
        isbn,
        totalCopies: copies,
        availableCopies: copies,
        shelf,
        description: desc
      };

      state.books.unshift(newBook);
      saveData(STORAGE_KEYS.BOOKS);
      renderBooksTable();
      showToast('Book added to collection');
      return true;
    });
  }

  function openEditBookModal(bookId) {
    const book = state.books.find(b => b.id === bookId);
    if (!book) return;

    const formHtml = `
      <div class="form-group">
        <label class="form-label">Book Title *</label>
        <input type="text" id="m_title" class="form-input" value="${escapeHtml(book.title)}" required />
      </div>
      <div class="form-group">
        <label class="form-label">Author Name *</label>
        <input type="text" id="m_author" class="form-input" value="${escapeHtml(book.author)}" required />
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Category *</label>
          <input type="text" id="m_category" class="form-input" value="${escapeHtml(book.category)}" required />
        </div>
        <div class="form-group">
          <label class="form-label">ISBN Number *</label>
          <input type="text" id="m_isbn" class="form-input" value="${escapeHtml(book.isbn)}" required />
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Total Copies *</label>
          <input type="number" id="m_copies" class="form-input" min="${book.totalCopies - book.availableCopies}" value="${book.totalCopies}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Shelf Bay</label>
          <input type="text" id="m_shelf" class="form-input" value="${escapeHtml(book.shelf || '')}" />
        </div>
      </div>
    `;

    openModal('Edit Book Details', formHtml, () => {
      const newTotal = parseInt(document.getElementById('m_copies').value, 10);
      const currentlyBorrowed = book.totalCopies - book.availableCopies;

      book.title = document.getElementById('m_title').value.trim();
      book.author = document.getElementById('m_author').value.trim();
      book.category = document.getElementById('m_category').value.trim();
      book.isbn = document.getElementById('m_isbn').value.trim();
      book.shelf = document.getElementById('m_shelf').value.trim();
      book.totalCopies = newTotal;
      book.availableCopies = Math.max(0, newTotal - currentlyBorrowed);

      saveData(STORAGE_KEYS.BOOKS);
      renderBooksTable();
      showToast('Book details updated');
      return true;
    });
  }

  function deleteBook(bookId) {
    const book = state.books.find(b => b.id === bookId);
    if (!book) return;

    const hasActiveLoan = state.borrowings.some(b => b.bookId === bookId && b.status === 'active');
    if (hasActiveLoan) {
      alert(`Cannot delete "${book.title}" because it currently has active borrowings.`);
      return;
    }

    if (confirm(`Are you sure you want to remove "${book.title}" from the library catalogue?`)) {
      state.books = state.books.filter(b => b.id !== bookId);
      saveData(STORAGE_KEYS.BOOKS);
      renderBooksTable();
      showToast('Book removed from catalogue');
    }
  }

  // Students Modals
  function openAddStudentModal() {
    const formHtml = `
      <div class="form-group">
        <label class="form-label">Student Name *</label>
        <input type="text" id="m_s_name" class="form-input" placeholder="e.g. Ananya Chawla" required />
      </div>
      <div class="form-group">
        <label class="form-label">Email Address *</label>
        <input type="email" id="m_s_email" class="form-input" placeholder="e.g. ananya.chawla@gmail.com" required />
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Phone Number *</label>
          <input type="tel" id="m_s_phone" class="form-input" placeholder="e.g. 9872947893" required />
        </div>
        <div class="form-group">
          <label class="form-label">Roll Number / ID</label>
          <input type="text" id="m_s_roll" class="form-input" placeholder="e.g. DU-2024-ENG-042" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Department / School</label>
        <input type="text" id="m_s_dept" class="form-input" placeholder="e.g. English Literature" />
      </div>
    `;

    openModal('Register Student Patron', formHtml, () => {
      const name = document.getElementById('m_s_name').value.trim();
      const email = document.getElementById('m_s_email').value.trim();
      const phone = document.getElementById('m_s_phone').value.trim();
      const rollNo = document.getElementById('m_s_roll').value.trim();
      const department = document.getElementById('m_s_dept').value.trim();

      const newStudent = {
        id: `STU-${Date.now().toString().slice(-4)}`,
        name,
        email,
        phone,
        rollNo,
        department
      };

      state.students.unshift(newStudent);
      saveData(STORAGE_KEYS.STUDENTS);
      renderStudentsTable();
      showToast('Student registered successfully');
      return true;
    });
  }

  function openEditStudentModal(studentId) {
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;

    const formHtml = `
      <div class="form-group">
        <label class="form-label">Student Name *</label>
        <input type="text" id="m_s_name" class="form-input" value="${escapeHtml(student.name)}" required />
      </div>
      <div class="form-group">
        <label class="form-label">Email Address *</label>
        <input type="email" id="m_s_email" class="form-input" value="${escapeHtml(student.email)}" required />
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Phone Number *</label>
          <input type="tel" id="m_s_phone" class="form-input" value="${escapeHtml(student.phone)}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Roll Number</label>
          <input type="text" id="m_s_roll" class="form-input" value="${escapeHtml(student.rollNo || '')}" />
        </div>
      </div>
    `;

    openModal('Edit Student Details', formHtml, () => {
      student.name = document.getElementById('m_s_name').value.trim();
      student.email = document.getElementById('m_s_email').value.trim();
      student.phone = document.getElementById('m_s_phone').value.trim();
      student.rollNo = document.getElementById('m_s_roll').value.trim();

      saveData(STORAGE_KEYS.STUDENTS);
      renderStudentsTable();
      showToast('Student record updated');
      return true;
    });
  }

  function deleteStudent(studentId) {
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;

    const hasActiveLoan = state.borrowings.some(b => b.studentId === studentId && b.status === 'active');
    if (hasActiveLoan) {
      alert(`Cannot delete patron "${student.name}" because they have unreturned borrowed volumes.`);
      return;
    }

    if (confirm(`Are you sure you want to remove patron "${student.name}"?`)) {
      state.students = state.students.filter(s => s.id !== studentId);
      saveData(STORAGE_KEYS.STUDENTS);
      renderStudentsTable();
      showToast('Student record removed');
    }
  }

  // Librarians Modals (Matches Screenshot 3)
  function openAddLibrarianModal() {
    const formHtml = `
      <div class="form-group">
        <label class="form-label">Librarian Name *</label>
        <input type="text" id="m_l_name" class="form-input" placeholder="e.g. Abhilasha Sen" required />
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Age *</label>
          <input type="number" id="m_l_age" class="form-input" min="18" max="80" placeholder="e.g. 27" required />
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number *</label>
          <input type="tel" id="m_l_phone" class="form-input" placeholder="e.g. 9873276387" required />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Role / Designation</label>
        <input type="text" id="m_l_role" class="form-input" placeholder="e.g. Senior Archivist & Curator" />
      </div>
    `;

    openModal('Add Librarian Staff', formHtml, () => {
      const name = document.getElementById('m_l_name').value.trim();
      const age = parseInt(document.getElementById('m_l_age').value, 10);
      const phone = document.getElementById('m_l_phone').value.trim();
      const role = document.getElementById('m_l_role').value.trim() || 'Library Associate';

      const newLib = {
        id: `LIB-${Date.now().toString().slice(-4)}`,
        name,
        age,
        phone,
        role,
        shift: 'General'
      };

      state.librarians.unshift(newLib);
      saveData(STORAGE_KEYS.LIBRARIANS);
      renderLibrariansTable();

      // Show exact toast from Screenshot 3
      showToast('Librarian added');
      return true;
    });
  }

  function openEditLibrarianModal(libId) {
    const lib = state.librarians.find(l => l.id === libId);
    if (!lib) return;

    const formHtml = `
      <div class="form-group">
        <label class="form-label">Librarian Name *</label>
        <input type="text" id="m_l_name" class="form-input" value="${escapeHtml(lib.name)}" required />
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Age *</label>
          <input type="number" id="m_l_age" class="form-input" min="18" max="80" value="${lib.age}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number *</label>
          <input type="tel" id="m_l_phone" class="form-input" value="${escapeHtml(lib.phone)}" required />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Role</label>
        <input type="text" id="m_l_role" class="form-input" value="${escapeHtml(lib.role || '')}" />
      </div>
    `;

    openModal('Edit Librarian Details', formHtml, () => {
      lib.name = document.getElementById('m_l_name').value.trim();
      lib.age = parseInt(document.getElementById('m_l_age').value, 10);
      lib.phone = document.getElementById('m_l_phone').value.trim();
      lib.role = document.getElementById('m_l_role').value.trim();

      saveData(STORAGE_KEYS.LIBRARIANS);
      renderLibrariansTable();
      showToast('Librarian details updated');
      return true;
    });
  }

  function deleteLibrarian(libId) {
    const lib = state.librarians.find(l => l.id === libId);
    if (!lib) return;

    if (confirm(`Are you sure you want to remove ${lib.name} from library staff?`)) {
      state.librarians = state.librarians.filter(l => l.id !== libId);
      saveData(STORAGE_KEYS.LIBRARIANS);
      renderLibrariansTable();
      showToast('Librarian removed from staff');
    }
  }

  // Issue Book Modal (Ledger)
  function openIssueBookModal(preselectedBookId = '') {
    const availableBooks = state.books.filter(b => b.availableCopies > 0);

    if (availableBooks.length === 0) {
      alert('There are currently no available copies of any book in the collection.');
      return;
    }

    if (state.students.length === 0) {
      alert('Please register at least one student patron first.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const defaultDue = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

    const bookOptions = availableBooks.map(b =>
      `<option value="${b.id}" ${b.id === preselectedBookId ? 'selected' : ''}>${escapeHtml(b.title)} (${b.availableCopies} available)</option>`
    ).join('');

    const studentOptions = state.students.map(s =>
      `<option value="${s.id}">${escapeHtml(s.name)} · ${escapeHtml(s.rollNo || s.email)}</option>`
    ).join('');

    const formHtml = `
      <div class="form-group">
        <label class="form-label">Select Book Volume *</label>
        <select id="m_issue_book" class="form-input" required>
          ${bookOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Select Student Patron *</label>
        <select id="m_issue_student" class="form-input" required>
          ${studentOptions}
        </select>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Date Issued</label>
          <input type="date" id="m_issue_date" class="form-input" value="${todayStr}" disabled />
        </div>
        <div class="form-group">
          <label class="form-label">Due Date *</label>
          <input type="date" id="m_due_date" class="form-input" value="${defaultDue}" required />
        </div>
      </div>
    `;

    openModal('Issue Volume to Reader', formHtml, () => {
      const bookId = document.getElementById('m_issue_book').value;
      const studentId = document.getElementById('m_issue_student').value;
      const dueDate = document.getElementById('m_due_date').value;

      return issueNewBook(bookId, studentId, dueDate);
    });
  }

  // =========================================================================
  // TOAST NOTIFICATIONS (Screenshot 3 style)
  // =========================================================================
  function showToast(message, type = 'success') {
    if (!el.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="toast-message">${escapeHtml(message)}</div>
      <button class="toast-close" title="Dismiss">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.onclick = () => toast.remove();

    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 3800);
  }

  // =========================================================================
  // UTILITIES & EVENT LISTENERS
  // =========================================================================
  function formatDateDisplay(dateString) {
    if (!dateString) return '—';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        // Return MM/DD/YYYY format matching screenshots (e.g. 7/30/2026)
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const year = parts[0];
        return `${month}/${day}/${year}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function resetDemoData() {
    if (confirm('Reset library records back to default Indian classical collection?')) {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(window.INITIAL_DATA.books));
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(window.INITIAL_DATA.students));
      localStorage.setItem(STORAGE_KEYS.LIBRARIANS, JSON.stringify(window.INITIAL_DATA.librarians));
      localStorage.setItem(STORAGE_KEYS.BORROWINGS, JSON.stringify(window.INITIAL_DATA.borrowings));
      loadStorageData();
      switchView(state.currentView || 'dashboard');
      showToast('Classical collection reset complete');
    }
  }

  function setupEventListeners() {
    // Login form
    if (el.loginForm) {
      el.loginForm.addEventListener('submit', handleLogin);
    }

    // Sign out
    if (el.signOutBtn) {
      el.signOutBtn.addEventListener('click', handleSignOut);
    }

    // Navigation items
    el.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        if (view) switchView(view);
      });
    });

    // Modal close buttons
    if (el.modalCancelBtn) el.modalCancelBtn.addEventListener('click', closeModal);
    if (el.modalCloseBtn) el.modalCloseBtn.addEventListener('click', closeModal);
    if (el.modalBackdrop) {
      el.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === el.modalBackdrop) closeModal();
      });
    }

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el.modalBackdrop.classList.contains('open')) {
        closeModal();
      }
    });

    // Books search and filters
    if (el.bookSearchInput) {
      el.bookSearchInput.addEventListener('input', renderBooksTable);
    }
    if (el.bookCategoryFilter) {
      el.bookCategoryFilter.addEventListener('change', renderBooksTable);
    }

    // Students search
    if (el.studentSearchInput) {
      el.studentSearchInput.addEventListener('input', renderStudentsTable);
    }

    // Librarians search
    if (el.librarianSearchInput) {
      el.librarianSearchInput.addEventListener('input', renderLibrariansTable);
    }

    // Borrowings filter
    if (el.borrowingFilterSelect) {
      el.borrowingFilterSelect.addEventListener('change', renderBorrowingsTable);
    }
  }

  // Expose API for inline button handlers
  window.GranthalayaApp = {
    switchView,
    viewBookDetails,
    openAddBookModal,
    openEditBookModal,
    deleteBook,
    openAddStudentModal,
    openEditStudentModal,
    deleteStudent,
    openAddLibrarianModal,
    openEditLibrarianModal,
    deleteLibrarian,
    openIssueBookModal,
    returnBook,
    resetDemoData
  };

  // Launch on DOM ready
  document.addEventListener('DOMContentLoaded', init);

})();
