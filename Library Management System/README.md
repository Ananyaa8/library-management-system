# Granthālaya (ग्रन्थालय) — Heritage Classical Indian Library System

> *"A quiet room, an open volume. Manage your collection, patrons, and lending with the care of an old library."*

**Granthālaya** is a library management system inspired by classical library archives and antique parchment aesthetics. It is designed to faithfully reflect the vintage warm-terracotta palette, classical typography, card layouts, and workflows shown in the reference designs, enriched with authentic Indian literature, scholars, and librarians.

---

## 🎨 Design & Aesthetic Elements
- **Color Palette**: Warm antique parchment background (`#FAF7F2`), deep terracotta wine accents (`#612618`), soft cream card containers (`#FFFFFF` / `#FBF8F3`), and sage green status pills (`#E3F2ED`).
- **Typography**: Dual-font typography pairing classical **Playfair Display** serifs for headings with modern, legible **Plus Jakarta Sans** for metadata and tables.
- **Micro-Interactions**:
  - Exact pill navigation with subtle wine drop shadow
  - Metric cards with circular badge cutouts
  - Soft green toast notifications with checkmark icon (`✓ Librarian added`)
  - Smooth modal overlays for adding and modifying records

---

## 📖 Curated Indian Literature & Catalog
The system comes pre-seeded with 15 renowned works of Indian literature across multiple genres:
- **Fiction & Classics**: *The God of Small Things* (Arundhati Roy), *Midnight's Children* (Salman Rushdie), *Malgudi Days* & *The Guide* (R.K. Narayan), *A Fine Balance* (Rohinton Mistry), *The White Tiger* (Aravind Adiga)
- **Historical Epics & Mythology**: *Train to Pakistan* (Khushwant Singh), *The Palace of Illusions* (Chitra Banerjee Divakaruni), *The Immortals of Meluha* (Amish Tripathi)
- **Philosophy, History & Biography**: *The Discovery of India* (Jawaharlal Nehru), *Wings of Fire* (Dr. A.P.J. Abdul Kalam), *Autobiography of a Yogi* (Paramahansa Yogananda), *Gitanjali* (Rabindranath Tagore), *Arthashastra* (Kautilya), *Raag Darbari* (Shrilal Shukla)

---

## 👥 Patrons & Archival Staff
- **Students (Patrons)**: Ananya Chawla, Aarav Sharma, Rohan Verma, Priya Patel, Ishaan Mukherjee, Kavya Sundaram (with institutional emails and roll numbers).
- **Librarians (Staff)**: Abhilasha Sen (Senior Archivist), Rajesh Nambiar (Chief Librarian), Sunita Deshmukh (Cataloguing Specialist), Vikramaditya Joshi (Lending Desk Lead).

---

## ⚙️ Core Functionality

1. **Authentication Desk**:
   - Access desk with username `admin` and password `admin123`.
   - Remembers login state and provides one-click sign out.

2. **Librarian's Dashboard**:
   - Dynamic real-time counters: **Total Books**, **Available Books**, **Active Loans**, **Returned**, **Students**, and **Librarians**.
   - Recent activity ledger showing the last 6 circulation records with live status badges (`returned`, `active`, `overdue`).

3. **Books Management (Catalogue)**:
   - Live real-time search by Title, Author, ISBN, or Shelf bay.
   - Genre and Category filtering.
   - Add new volumes, update details, or remove books.
   - Direct "+ Issue" action from the catalogue table for any available title.

4. **Students Management (Patrons)**:
   - View student registry with contact details (email and phone).
   - Register new student patrons with custom roll numbers and department.
   - Edit and delete patron profiles.

5. **Librarians Management (Staff)**:
   - Exact table layout matching the reference (`NAME`, `AGE`, `PHONE`, `ACTIONS`).
   - Add new staff members with age, phone, and role.
   - Triggers the green floating toast notification: `✓ Librarian added`.

6. **Borrowings Ledger**:
   - Track circulating volumes, borrower names, contacts, and issue/return dates.
   - Single-click **"Mark Return"** button that automatically restores available book count, marks return timestamp, and updates statistics across the dashboard.
   - Filter ledger by Active loans, Returned loans, or All records.

7. **Data Persistence**:
   - Uses browser `localStorage` to save all additions, edits, loans, and returns.
   - Includes a **"Reset Classical Demo Data"** link in the sidebar to reset the database at any time.

---


