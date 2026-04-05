/* ========================================
   SmartLib - Application Logic
   Smart University Library Management System
   ======================================== */

// ==================== DATA INITIALIZATION ====================

const DEFAULT_USERS = [
    { id: 'U001', fullName: 'Dr. Sarah Mitchell', username: 'admin', password: 'admin', role: 'admin', email: 'admin@smartlib.edu', department: 'Administration', studentId: '' },
    { id: 'U002', fullName: 'James Rodriguez', username: 'librarian', password: 'lib123', role: 'librarian', email: 'james.r@smartlib.edu', department: 'Library Services', studentId: '' },
    { id: 'U003', fullName: 'Emily Chen', username: 'student', password: 'student', role: 'student', email: 'emily.chen@university.edu', department: 'Computer Science', studentId: 'STU-2024-0142' }
];

const DEFAULT_BOOKS = [
    { id: 'B001', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', category: 'Fiction', publisher: 'J.B. Lippincott & Co.', year: 1960, totalCopies: 5, availableCopies: 3, location: 'Shelf A1', description: 'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice. It views a world of great beauty and savage inequities through the eyes of a young girl.' },
    { id: 'B002', title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0-553-38016-3', category: 'Science', publisher: 'Bantam Books', year: 1988, totalCopies: 4, availableCopies: 2, location: 'Shelf B3', description: 'A landmark volume in science writing by one of the great minds of our time. It explores the mysteries of the universe, from the Big Bang to black holes.' },
    { id: 'B003', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0-13-235088-4', category: 'Technology', publisher: 'Prentice Hall', year: 2008, totalCopies: 6, availableCopies: 4, location: 'Shelf C2', description: 'A handbook of agile software craftsmanship. This book is a must-read for any developer, software engineer, project manager, team lead, or systems analyst.' },
    { id: 'B004', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '978-0-06-231609-7', category: 'History', publisher: 'Harper', year: 2015, totalCopies: 3, availableCopies: 1, location: 'Shelf D1', description: 'A narrative of humanity\'s creation and evolution that explores how biology and history have defined us and enhanced our understanding of what it means to be human.' },
    { id: 'B005', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0-262-03384-8', category: 'Mathematics', publisher: 'MIT Press', year: 2009, totalCopies: 4, availableCopies: 2, location: 'Shelf E2', description: 'A comprehensive textbook covering a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.' },
    { id: 'B006', title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', category: 'Fiction', publisher: 'Secker & Warburg', year: 1949, totalCopies: 5, availableCopies: 5, location: 'Shelf A2', description: 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism. It introduced the concepts of Big Brother, doublethink, and Newspeak.' },
    { id: 'B007', title: 'The Origin of Species', author: 'Charles Darwin', isbn: '978-0-451-52906-0', category: 'Science', publisher: 'John Murray', year: 1859, totalCopies: 3, availableCopies: 3, location: 'Shelf B1', description: 'A work of scientific literature considered the foundation of evolutionary biology, introducing the concept of natural selection.' },
    { id: 'B008', title: 'Design Patterns', author: 'Erich Gamma', isbn: '978-0-201-63361-0', category: 'Technology', publisher: 'Addison-Wesley', year: 1994, totalCopies: 4, availableCopies: 3, location: 'Shelf C1', description: 'Elements of Reusable Object-Oriented Software. A seminal book that describes simple and elegant solutions to specific problems in object-oriented software design.' },
    { id: 'B009', title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '978-0-393-31755-8', category: 'History', publisher: 'W.W. Norton', year: 1997, totalCopies: 3, availableCopies: 2, location: 'Shelf D2', description: 'An investigation into the factors that shaped the modern world, examining why certain civilizations have dominated others throughout history.' },
    { id: 'B010', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', isbn: '978-0-374-53355-7', category: 'Psychology', publisher: 'Farrar, Straus and Giroux', year: 2011, totalCopies: 4, availableCopies: 3, location: 'Shelf F1', description: 'A groundbreaking tour of the mind that explains the two systems that drive the way we think and make choices.' },
    { id: 'B011', title: 'The Republic', author: 'Plato', isbn: '978-0-14-044914-3', category: 'Philosophy', publisher: 'Penguin Classics', year: -380, totalCopies: 3, availableCopies: 2, location: 'Shelf G1', description: 'A Socratic dialogue concerning justice, the order and character of the just city-state, and the just man. One of the most influential works of philosophy and political theory.' },
    { id: 'B012', title: 'The Lean Startup', author: 'Eric Ries', isbn: '978-0-307-88789-4', category: 'Business', publisher: 'Crown Publishing', year: 2011, totalCopies: 5, availableCopies: 4, location: 'Shelf H1', description: 'A new approach to business that\'s being adopted around the world, changing the way companies are built and new products are launched.' },
    { id: 'B013', title: 'Calculus: Early Transcendentals', author: 'James Stewart', isbn: '978-1-285-74155-0', category: 'Mathematics', publisher: 'Cengage Learning', year: 2015, totalCopies: 6, availableCopies: 5, location: 'Shelf E1', description: 'This text is widely renowned for its mathematical precision and accuracy, clarity of exposition, and outstanding examples and problem sets.' },
    { id: 'B014', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', category: 'Fiction', publisher: 'Charles Scribner\'s Sons', year: 1925, totalCopies: 4, availableCopies: 4, location: 'Shelf A3', description: 'A novel that explores themes of decadence, idealism, social upheaval, and excess, creating a portrait of the Jazz Age that has been described as a cautionary tale regarding the American Dream.' },
    { id: 'B015', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', isbn: '978-0-13-604259-4', category: 'Technology', publisher: 'Pearson', year: 2020, totalCopies: 4, availableCopies: 2, location: 'Shelf C3', description: 'The most comprehensive, up-to-date introduction to the theory and practice of artificial intelligence. Used in over 1500 universities worldwide.' },
    { id: 'B016', title: 'Meditations', author: 'Marcus Aurelius', isbn: '978-0-14-044933-4', category: 'Philosophy', publisher: 'Penguin Classics', year: 180, totalCopies: 3, availableCopies: 3, location: 'Shelf G2', description: 'A series of personal writings by the Roman Emperor Marcus Aurelius, recording his private notes to himself and ideas on Stoic philosophy.' },
    { id: 'B017', title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: '978-0-19-857519-1', category: 'Science', publisher: 'Oxford University Press', year: 1976, totalCopies: 3, availableCopies: 2, location: 'Shelf B2', description: 'A gene-centred view of evolution, which builds upon the work of George C. Williams and argues that the gene is the principal unit of selection in evolution.' }
];

function getToday() {
    return new Date().toISOString().split('T')[0];
}

function dateOffset(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
}

const DEFAULT_BORROWINGS = [
    { id: 'BR001', userId: 'U003', bookId: 'B001', borrowDate: dateOffset(-10), dueDate: dateOffset(4), returnDate: null, status: 'Active' },
    { id: 'BR002', userId: 'U003', bookId: 'B002', borrowDate: dateOffset(-20), dueDate: dateOffset(-6), returnDate: null, status: 'Overdue' },
    { id: 'BR003', userId: 'U003', bookId: 'B003', borrowDate: dateOffset(-30), dueDate: dateOffset(-16), returnDate: dateOffset(-14), status: 'Returned' },
    { id: 'BR004', userId: 'U003', bookId: 'B005', borrowDate: dateOffset(-5), dueDate: dateOffset(9), returnDate: null, status: 'Active' },
    { id: 'BR005', userId: 'U003', bookId: 'B010', borrowDate: dateOffset(-45), dueDate: dateOffset(-31), returnDate: dateOffset(-29), status: 'Returned' },
    { id: 'BR006', userId: 'U003', bookId: 'B015', borrowDate: dateOffset(-3), dueDate: dateOffset(11), returnDate: null, status: 'Active' }
];

const DEFAULT_RESERVATIONS = [
    { id: 'RS001', userId: 'U003', bookId: 'B004', reservationDate: dateOffset(-2), status: 'Pending' },
    { id: 'RS002', userId: 'U003', bookId: 'B009', reservationDate: dateOffset(-5), status: 'Ready for Pickup' },
    { id: 'RS003', userId: 'U003', bookId: 'B012', reservationDate: dateOffset(-15), status: 'Expired' },
    { id: 'RS004', userId: 'U003', bookId: 'B008', reservationDate: dateOffset(-1), status: 'Pending' }
];

const DEFAULT_FINES = [
    { id: 'F001', userId: 'U003', bookId: 'B002', amount: 3.00, dateIssued: getToday(), status: 'Unpaid' },
    { id: 'F002', userId: 'U003', bookId: 'B010', amount: 7.50, dateIssued: dateOffset(-29), status: 'Paid' },
    { id: 'F003', userId: 'U003', bookId: 'B003', amount: 1.00, dateIssued: dateOffset(-14), status: 'Unpaid' }
];

const DEFAULT_SETTINGS = {
    libraryName: 'Smart University Library',
    maxBooksPerStudent: 5,
    loanPeriodDays: 14,
    finePerDay: 0.50,
    reservationExpiryDays: 3
};

// ==================== DATA ACCESS ====================

function initData() {
    if (!localStorage.getItem('smartlib_initialized')) {
        resetAllData();
    }
}

function resetAllData() {
    localStorage.setItem('smartlib_users', JSON.stringify(DEFAULT_USERS));
    localStorage.setItem('smartlib_books', JSON.stringify(DEFAULT_BOOKS));
    localStorage.setItem('smartlib_borrowings', JSON.stringify(DEFAULT_BORROWINGS));
    localStorage.setItem('smartlib_reservations', JSON.stringify(DEFAULT_RESERVATIONS));
    localStorage.setItem('smartlib_fines', JSON.stringify(DEFAULT_FINES));
    localStorage.setItem('smartlib_settings', JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem('smartlib_initialized', 'true');
}

function getData(key) {
    try { return JSON.parse(localStorage.getItem('smartlib_' + key)) || []; }
    catch { return []; }
}
function setData(key, data) {
    localStorage.setItem('smartlib_' + key, JSON.stringify(data));
}
function getSettings() {
    try { return JSON.parse(localStorage.getItem('smartlib_settings')) || DEFAULT_SETTINGS; }
    catch { return DEFAULT_SETTINGS; }
}
function genId(prefix) {
    return prefix + Date.now().toString(36).toUpperCase();
}

// ==================== UI HELPERS ====================

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '\u2714', error: '\u2716', warning: '\u26A0', info: '\u2139' };
    toast.innerHTML = `<span>${icons[type] || ''}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
}
function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}
function simulateAsync(fn, delay = 500) {
    showLoading();
    setTimeout(() => { fn(); hideLoading(); }, delay);
}

function showModal(title, bodyHtml, footerHtml) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-footer').innerHTML = footerHtml;
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal-backdrop').classList.remove('hidden');
}
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('modal-backdrop').classList.add('hidden');
}

function toggleMobileNav() {
    const page = document.querySelector('.page.active');
    if (page) {
        const links = page.querySelector('.nav-links');
        if (links) links.classList.toggle('open');
    }
}

function getCategoryClass(cat) {
    return 'cat-' + (cat || 'fiction').toLowerCase();
}

function getCategoryIcon(cat) {
    const icons = {
        'Fiction': '\uD83D\uDCD6', 'Science': '\uD83D\uDD2C', 'Technology': '\uD83D\uDCBB',
        'History': '\uD83C\uDFDB', 'Mathematics': '\uD83D\uDCC8', 'Philosophy': '\uD83E\uDD14',
        'Psychology': '\uD83E\uDDE0', 'Business': '\uD83D\uDCBC'
    };
    return icons[cat] || '\uD83D\uDCD5';
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ==================== NAVIGATION ====================

let currentUser = null;
let currentView = '';
let bookViewMode = 'grid';

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById('page-' + pageId);
    if (page) page.classList.add('active');
}

function navigateTo(viewName) {
    // Close mobile nav
    document.querySelectorAll('.nav-links.open').forEach(n => n.classList.remove('open'));

    const parts = viewName.split('-');
    const role = parts[0]; // student, librarian, admin
    const page = document.getElementById('page-' + role);
    if (!page) return;

    // Hide all views within this page
    page.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    // Show target view
    const view = document.getElementById('view-' + viewName);
    if (view) view.classList.add('active');

    // Update nav active state
    page.querySelectorAll('.nav-link').forEach(a => {
        a.classList.toggle('active', a.getAttribute('data-view') === viewName);
    });

    currentView = viewName;
    refreshView(viewName);
}

function refreshView(viewName) {
    switch (viewName) {
        case 'student-home': renderStudentHome(); break;
        case 'student-search': renderBookSearch(); break;
        case 'student-borrowings': renderBorrowings(); break;
        case 'student-reservations': renderReservations(); break;
        case 'student-fines': renderFines(); break;
        case 'student-profile': renderProfile(); break;
        case 'librarian-home': renderLibrarianHome(); break;
        case 'librarian-manage-books': renderManageBooks(); break;
        case 'librarian-issue': renderIssueForm(); break;
        case 'librarian-returns': renderReturns(); break;
        case 'librarian-reports': renderLibrarianReports(); break;
        case 'admin-home': renderAdminHome(); break;
        case 'admin-users': renderAdminUsers(); break;
        case 'admin-reports': renderAdminReports(); break;
        case 'admin-settings': renderAdminSettings(); break;
    }
}

// ==================== AUTH ====================

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    const users = getData('users');
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        errorEl.textContent = 'Invalid username or password. Please try again.';
        errorEl.classList.remove('hidden');
        return;
    }

    errorEl.classList.add('hidden');
    currentUser = user;
    localStorage.setItem('smartlib_currentUser', JSON.stringify(user));

    simulateAsync(() => {
        showPage(user.role);
        if (user.role === 'student') {
            document.getElementById('student-nav-name').textContent = user.fullName;
            navigateTo('student-home');
        } else if (user.role === 'librarian') {
            navigateTo('librarian-home');
        } else if (user.role === 'admin') {
            navigateTo('admin-home');
        }
        showToast(`Welcome, ${user.fullName}!`, 'success');
    }, 600);
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('smartlib_currentUser');
    showPage('login');
    document.getElementById('login-form').reset();
    showToast('You have been signed out.', 'info');
}

function checkSession() {
    const saved = localStorage.getItem('smartlib_currentUser');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            showPage(currentUser.role);
            if (currentUser.role === 'student') {
                document.getElementById('student-nav-name').textContent = currentUser.fullName;
                navigateTo('student-home');
            } else if (currentUser.role === 'librarian') {
                navigateTo('librarian-home');
            } else if (currentUser.role === 'admin') {
                navigateTo('admin-home');
            }
        } catch {
            showPage('login');
        }
    }
}

// ==================== STUDENT VIEWS ====================

function renderStudentHome() {
    if (!currentUser) return;
    const borrowings = getData('borrowings').filter(b => b.userId === currentUser.id);
    const reservations = getData('reservations').filter(r => r.userId === currentUser.id && (r.status === 'Pending' || r.status === 'Ready for Pickup'));
    const fines = getData('fines').filter(f => f.userId === currentUser.id && f.status === 'Unpaid');
    const books = getData('books');

    const active = borrowings.filter(b => b.status === 'Active');
    const overdue = borrowings.filter(b => b.status === 'Overdue');
    const totalFines = fines.reduce((s, f) => s + f.amount, 0);

    document.getElementById('student-welcome').textContent = `Welcome back, ${currentUser.fullName}!`;
    document.getElementById('stat-borrowed').textContent = active.length;
    document.getElementById('stat-reserved').textContent = reservations.length;
    document.getElementById('stat-fines').textContent = '$' + totalFines.toFixed(2);
    document.getElementById('stat-overdue').textContent = overdue.length;

    // Due Reminders
    const dueContainer = document.getElementById('due-reminders');
    const upcoming = active.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    if (upcoming.length === 0) {
        dueContainer.innerHTML = '<p class="text-muted">No upcoming due dates</p>';
    } else {
        dueContainer.innerHTML = upcoming.map(b => {
            const book = books.find(bk => bk.id === b.bookId);
            const daysLeft = Math.ceil((new Date(b.dueDate + 'T00:00:00') - new Date()) / 86400000);
            const urgent = daysLeft <= 3;
            return `<div class="reminder-item">
                <span class="reminder-book">${book ? book.title : 'Unknown'}</span>
                <span class="reminder-date badge ${urgent ? 'badge-danger' : 'badge-info'}">${daysLeft <= 0 ? 'Due today!' : daysLeft + ' days left'}</span>
            </div>`;
        }).join('');
    }

    // Recent Activity
    const actContainer = document.getElementById('recent-activity');
    const activities = [];
    borrowings.slice(-5).reverse().forEach(b => {
        const book = books.find(bk => bk.id === b.bookId);
        const title = book ? book.title : 'Unknown';
        if (b.status === 'Returned') {
            activities.push({ text: `Returned "${title}"`, color: 'green', date: b.returnDate });
        } else if (b.status === 'Overdue') {
            activities.push({ text: `"${title}" is overdue`, color: 'red', date: b.dueDate });
        } else {
            activities.push({ text: `Borrowed "${title}"`, color: 'blue', date: b.borrowDate });
        }
    });
    if (activities.length === 0) {
        actContainer.innerHTML = '<p class="text-muted">No recent activity</p>';
    } else {
        actContainer.innerHTML = '<div class="activity-list">' + activities.map(a =>
            `<div class="activity-item">
                <span class="activity-dot ${a.color}"></span>
                <div><div>${a.text}</div><small class="text-muted">${formatDate(a.date)}</small></div>
            </div>`
        ).join('') + '</div>';
    }
}

function renderBookSearch() {
    const books = getData('books');
    const query = (document.getElementById('search-input').value || '').toLowerCase();
    const catFilter = document.getElementById('filter-category').value;
    const availFilter = document.getElementById('filter-availability').value;

    let filtered = books.filter(b => {
        const matchesQuery = !query ||
            b.title.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query) ||
            b.isbn.includes(query);
        const matchesCat = !catFilter || b.category === catFilter;
        const matchesAvail = !availFilter ||
            (availFilter === 'available' && b.availableCopies > 0) ||
            (availFilter === 'unavailable' && b.availableCopies === 0);
        return matchesQuery && matchesCat && matchesAvail;
    });

    const container = document.getElementById('search-results');
    container.className = bookViewMode === 'list' ? 'book-grid list-view' : 'book-grid';

    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-muted" style="grid-column:1/-1;text-align:center;padding:2rem;">No books found matching your criteria.</p>';
        return;
    }

    container.innerHTML = filtered.map(b => `
        <div class="book-card" onclick="viewBookDetails('${b.id}')">
            <div class="book-cover ${getCategoryClass(b.category)}">
                ${getCategoryIcon(b.category)}
                <div class="cover-label">${b.category}</div>
            </div>
            <div class="book-card-body">
                <h4>${b.title}</h4>
                <div class="book-author">${b.author}</div>
                <div class="book-card-footer">
                    <span class="badge ${b.availableCopies > 0 ? 'badge-success' : 'badge-danger'}">${b.availableCopies > 0 ? b.availableCopies + ' Available' : 'Unavailable'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function handleSearch() {
    renderBookSearch();
}

function setViewMode(mode) {
    bookViewMode = mode;
    document.getElementById('btn-grid-view').classList.toggle('active', mode === 'grid');
    document.getElementById('btn-list-view').classList.toggle('active', mode === 'list');
    renderBookSearch();
}

function viewBookDetails(bookId) {
    const books = getData('books');
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const role = currentUser ? currentUser.role : 'student';
    // Navigate to book details view
    const page = document.getElementById('page-' + role);
    if (page) {
        page.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById('view-book-details').classList.add('active');
    }
    // Clear nav active states
    page.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));

    const yearDisplay = book.year < 0 ? Math.abs(book.year) + ' BC' : book.year;
    const borrowBtn = book.availableCopies > 0
        ? `<button class="btn btn-primary" onclick="borrowBook('${book.id}')">Borrow This Book</button>`
        : `<button class="btn btn-warning" onclick="reserveBook('${book.id}')">Reserve This Book</button>`;

    const related = books.filter(b => b.category === book.category && b.id !== book.id).slice(0, 4);

    document.getElementById('book-detail-content').innerHTML = `
        <div class="book-detail">
            <div class="book-detail-cover ${getCategoryClass(book.category)}">
                ${getCategoryIcon(book.category)}
            </div>
            <div class="book-detail-info">
                <h2>${book.title}</h2>
                <p class="detail-author">by ${book.author}</p>
                <div class="book-meta">
                    <div class="book-meta-item"><strong>ISBN</strong>${book.isbn}</div>
                    <div class="book-meta-item"><strong>Category</strong>${book.category}</div>
                    <div class="book-meta-item"><strong>Publisher</strong>${book.publisher || 'N/A'}</div>
                    <div class="book-meta-item"><strong>Year</strong>${yearDisplay}</div>
                    <div class="book-meta-item"><strong>Location</strong>${book.location || 'N/A'}</div>
                    <div class="book-meta-item"><strong>Availability</strong>
                        <span class="badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}">${book.availableCopies} of ${book.totalCopies} available</span>
                    </div>
                </div>
                <p class="book-detail-desc">${book.description || 'No description available.'}</p>
                ${currentUser && currentUser.role === 'student' ? `<div class="book-detail-actions">${borrowBtn}</div>` : ''}
            </div>
        </div>
        ${related.length > 0 ? `
        <div class="related-books">
            <h3>Related Books in ${book.category}</h3>
            <div class="related-grid">
                ${related.map(r => `
                    <div class="book-card" onclick="viewBookDetails('${r.id}')">
                        <div class="book-cover ${getCategoryClass(r.category)}" style="height:120px;font-size:2rem;">
                            ${getCategoryIcon(r.category)}
                            <div class="cover-label">${r.category}</div>
                        </div>
                        <div class="book-card-body">
                            <h4>${r.title}</h4>
                            <div class="book-author">${r.author}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>` : ''}
    `;
}

function borrowBook(bookId) {
    if (!currentUser) return;
    const books = getData('books');
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) {
        showToast('This book is not available for borrowing.', 'error');
        return;
    }

    // Check max limit
    const settings = getSettings();
    const activeBorrowings = getData('borrowings').filter(b => b.userId === currentUser.id && b.status === 'Active');
    if (activeBorrowings.length >= settings.maxBooksPerStudent) {
        showToast(`You have reached the maximum limit of ${settings.maxBooksPerStudent} books.`, 'warning');
        return;
    }

    // Check if already borrowed
    if (activeBorrowings.some(b => b.bookId === bookId)) {
        showToast('You have already borrowed this book.', 'warning');
        return;
    }

    showModal('Confirm Borrow', `<p>Are you sure you want to borrow <strong>"${book.title}"</strong>?</p><p class="text-muted" style="margin-top:0.5rem;">Due date will be ${formatDate(dateOffset(settings.loanPeriodDays))}.</p>`,
        `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="btn btn-primary" onclick="confirmBorrow('${bookId}')">Confirm</button>`);
}

function confirmBorrow(bookId) {
    closeModal();
    const settings = getSettings();
    const books = getData('books');
    const borrowings = getData('borrowings');
    const idx = books.findIndex(b => b.id === bookId);
    if (idx === -1 || books[idx].availableCopies <= 0) return;

    books[idx].availableCopies--;
    setData('books', books);

    borrowings.push({
        id: genId('BR'),
        userId: currentUser.id,
        bookId: bookId,
        borrowDate: getToday(),
        dueDate: dateOffset(settings.loanPeriodDays),
        returnDate: null,
        status: 'Active'
    });
    setData('borrowings', borrowings);

    showToast(`"${books[idx].title}" has been borrowed successfully!`, 'success');
    viewBookDetails(bookId);
}

function reserveBook(bookId) {
    if (!currentUser) return;
    const books = getData('books');
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const reservations = getData('reservations');
    if (reservations.some(r => r.userId === currentUser.id && r.bookId === bookId && (r.status === 'Pending' || r.status === 'Ready for Pickup'))) {
        showToast('You already have an active reservation for this book.', 'warning');
        return;
    }

    showModal('Confirm Reservation', `<p>Are you sure you want to reserve <strong>"${book.title}"</strong>?</p><p class="text-muted" style="margin-top:0.5rem;">You will be notified when it becomes available.</p>`,
        `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="btn btn-primary" onclick="confirmReserve('${bookId}')">Confirm</button>`);
}

function confirmReserve(bookId) {
    closeModal();
    const reservations = getData('reservations');
    const books = getData('books');
    const book = books.find(b => b.id === bookId);

    reservations.push({
        id: genId('RS'),
        userId: currentUser.id,
        bookId: bookId,
        reservationDate: getToday(),
        status: 'Pending'
    });
    setData('reservations', reservations);
    showToast(`"${book.title}" has been reserved successfully!`, 'success');
}

function renderBorrowings() {
    if (!currentUser) return;
    const borrowings = getData('borrowings').filter(b => b.userId === currentUser.id);
    const books = getData('books');
    const tbody = document.getElementById('borrowings-table-body');

    if (borrowings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;" class="text-muted">No borrowing records found.</td></tr>';
        return;
    }

    tbody.innerHTML = borrowings.sort((a, b) => b.borrowDate.localeCompare(a.borrowDate)).map(br => {
        const book = books.find(b => b.id === br.bookId);
        const statusClass = br.status === 'Active' ? 'badge-success' : br.status === 'Overdue' ? 'badge-danger' : 'badge-secondary';
        const action = (br.status === 'Active' || br.status === 'Overdue')
            ? `<button class="btn btn-sm btn-primary" onclick="returnBook('${br.id}')">Return</button>`
            : '';
        return `<tr>
            <td>${book ? book.title : 'Unknown'}</td>
            <td>${formatDate(br.borrowDate)}</td>
            <td>${formatDate(br.dueDate)}</td>
            <td>${formatDate(br.returnDate)}</td>
            <td><span class="badge ${statusClass}">${br.status}</span></td>
            <td>${action}</td>
        </tr>`;
    }).join('');
}

function returnBook(borrowingId) {
    const borrowings = getData('borrowings');
    const br = borrowings.find(b => b.id === borrowingId);
    if (!br) return;
    const books = getData('books');
    const book = books.find(b => b.id === br.bookId);

    showModal('Confirm Return', `<p>Return <strong>"${book ? book.title : 'this book'}"</strong>?</p>`,
        `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="btn btn-primary" onclick="confirmReturn('${borrowingId}')">Confirm Return</button>`);
}

function confirmReturn(borrowingId) {
    closeModal();
    simulateAsync(() => {
        const borrowings = getData('borrowings');
        const books = getData('books');
        const br = borrowings.find(b => b.id === borrowingId);
        if (!br) return;

        br.returnDate = getToday();
        br.status = 'Returned';

        const bookIdx = books.findIndex(b => b.id === br.bookId);
        if (bookIdx !== -1) books[bookIdx].availableCopies++;

        // Check if overdue and create fine
        if (new Date(getToday()) > new Date(br.dueDate + 'T00:00:00')) {
            const settings = getSettings();
            const daysOverdue = Math.ceil((new Date(getToday()) - new Date(br.dueDate + 'T00:00:00')) / 86400000);
            const fineAmount = daysOverdue * settings.finePerDay;
            const fines = getData('fines');
            fines.push({
                id: genId('F'),
                userId: br.userId,
                bookId: br.bookId,
                amount: fineAmount,
                dateIssued: getToday(),
                status: 'Unpaid'
            });
            setData('fines', fines);
            showToast(`Book returned. Late fine of $${fineAmount.toFixed(2)} has been applied.`, 'warning');
        } else {
            showToast('Book returned successfully!', 'success');
        }

        setData('borrowings', borrowings);
        setData('books', books);
        renderBorrowings();
    });
}

function renderReservations() {
    if (!currentUser) return;
    const reservations = getData('reservations').filter(r => r.userId === currentUser.id);
    const books = getData('books');
    const tbody = document.getElementById('reservations-table-body');

    if (reservations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:2rem;" class="text-muted">No reservation records found.</td></tr>';
        return;
    }

    const statusClassMap = {
        'Pending': 'badge-warning',
        'Ready for Pickup': 'badge-success',
        'Expired': 'badge-secondary',
        'Cancelled': 'badge-secondary'
    };

    tbody.innerHTML = reservations.sort((a, b) => b.reservationDate.localeCompare(a.reservationDate)).map(r => {
        const book = books.find(b => b.id === r.bookId);
        const canCancel = r.status === 'Pending' || r.status === 'Ready for Pickup';
        return `<tr>
            <td>${book ? book.title : 'Unknown'}</td>
            <td>${formatDate(r.reservationDate)}</td>
            <td><span class="badge ${statusClassMap[r.status] || 'badge-secondary'}">${r.status}</span></td>
            <td>${canCancel ? `<button class="btn btn-sm btn-danger" onclick="cancelReservation('${r.id}')">Cancel</button>` : ''}</td>
        </tr>`;
    }).join('');
}

function cancelReservation(resId) {
    showModal('Cancel Reservation', '<p>Are you sure you want to cancel this reservation?</p>',
        `<button class="btn btn-secondary" onclick="closeModal()">No</button>
         <button class="btn btn-danger" onclick="confirmCancelReservation('${resId}')">Yes, Cancel</button>`);
}

function confirmCancelReservation(resId) {
    closeModal();
    const reservations = getData('reservations');
    const r = reservations.find(r => r.id === resId);
    if (r) {
        r.status = 'Cancelled';
        setData('reservations', reservations);
        showToast('Reservation cancelled.', 'info');
        renderReservations();
    }
}

function renderFines() {
    if (!currentUser) return;
    const fines = getData('fines').filter(f => f.userId === currentUser.id);
    const books = getData('books');
    const tbody = document.getElementById('fines-table-body');

    const totalUnpaid = fines.filter(f => f.status === 'Unpaid').reduce((s, f) => s + f.amount, 0);
    document.getElementById('total-fines').textContent = '$' + totalUnpaid.toFixed(2);

    if (fines.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;" class="text-muted">No fine records found.</td></tr>';
        return;
    }

    tbody.innerHTML = fines.sort((a, b) => b.dateIssued.localeCompare(a.dateIssued)).map(f => {
        const book = books.find(b => b.id === f.bookId);
        return `<tr>
            <td>${book ? book.title : 'Unknown'}</td>
            <td>$${f.amount.toFixed(2)}</td>
            <td>${formatDate(f.dateIssued)}</td>
            <td><span class="badge ${f.status === 'Paid' ? 'badge-success' : 'badge-danger'}">${f.status}</span></td>
            <td>${f.status === 'Unpaid' ? `<button class="btn btn-sm btn-success" onclick="payFine('${f.id}')">Pay</button>` : ''}</td>
        </tr>`;
    }).join('');
}

function payFine(fineId) {
    const fines = getData('fines');
    const f = fines.find(f => f.id === fineId);
    if (!f) return;
    showModal('Pay Fine', `<p>Pay fine of <strong>$${f.amount.toFixed(2)}</strong>?</p><p class="text-muted" style="margin-top:0.5rem;">This is a simulated payment.</p>`,
        `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="btn btn-success" onclick="confirmPayFine('${fineId}')">Pay Now</button>`);
}

function confirmPayFine(fineId) {
    closeModal();
    simulateAsync(() => {
        const fines = getData('fines');
        const f = fines.find(f => f.id === fineId);
        if (f) {
            f.status = 'Paid';
            setData('fines', fines);
            showToast('Fine paid successfully!', 'success');
            renderFines();
        }
    });
}

function renderProfile() {
    if (!currentUser) return;
    document.getElementById('profile-name').value = currentUser.fullName;
    document.getElementById('profile-email').value = currentUser.email;
    document.getElementById('profile-studentid').value = currentUser.studentId || 'N/A';
    document.getElementById('profile-dept').value = currentUser.department || '';
    document.getElementById('profile-avatar-letter').textContent = currentUser.fullName.charAt(0).toUpperCase();
}

function handleProfileUpdate(e) {
    e.preventDefault();
    const users = getData('users');
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx === -1) return;

    users[idx].fullName = document.getElementById('profile-name').value.trim();
    users[idx].email = document.getElementById('profile-email').value.trim();
    users[idx].department = document.getElementById('profile-dept').value.trim();
    setData('users', users);

    currentUser = users[idx];
    localStorage.setItem('smartlib_currentUser', JSON.stringify(currentUser));
    document.getElementById('student-nav-name').textContent = currentUser.fullName;
    showToast('Profile updated successfully!', 'success');
}

// ==================== LIBRARIAN VIEWS ====================

function renderLibrarianHome() {
    const books = getData('books');
    const borrowings = getData('borrowings');
    const users = getData('users');

    const totalBooks = books.reduce((s, b) => s + b.totalCopies, 0);
    const issued = borrowings.filter(b => b.status === 'Active' || b.status === 'Overdue').length;
    const overdue = borrowings.filter(b => b.status === 'Overdue').length;
    const students = users.filter(u => u.role === 'student').length;

    document.getElementById('lib-stat-total').textContent = totalBooks;
    document.getElementById('lib-stat-issued').textContent = issued;
    document.getElementById('lib-stat-overdue').textContent = overdue;
    document.getElementById('lib-stat-members').textContent = students;

    // Recent transactions
    const container = document.getElementById('lib-recent-transactions');
    const recent = borrowings.slice(-8).reverse();
    if (recent.length === 0) {
        container.innerHTML = '<p class="text-muted">No transactions yet.</p>';
    } else {
        container.innerHTML = '<div class="activity-list">' + recent.map(b => {
            const book = books.find(bk => bk.id === b.bookId);
            const user = users.find(u => u.id === b.userId);
            const color = b.status === 'Active' ? 'blue' : b.status === 'Overdue' ? 'red' : 'green';
            const action = b.status === 'Returned' ? 'Returned' : b.status === 'Overdue' ? 'Overdue' : 'Borrowed';
            return `<div class="activity-item">
                <span class="activity-dot ${color}"></span>
                <div><div>${user ? user.fullName : 'Unknown'} - ${action}: "${book ? book.title : 'Unknown'}"</div>
                <small class="text-muted">${formatDate(b.status === 'Returned' ? b.returnDate : b.borrowDate)}</small></div>
            </div>`;
        }).join('') + '</div>';
    }
}

function renderManageBooks() {
    const books = getData('books');
    const query = (document.getElementById('manage-book-search')?.value || '').toLowerCase();
    const filtered = books.filter(b =>
        !query ||
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.isbn.includes(query)
    );
    const tbody = document.getElementById('manage-books-table');

    tbody.innerHTML = filtered.map(b => `<tr>
        <td>${b.title}</td>
        <td>${b.author}</td>
        <td>${b.isbn}</td>
        <td><span class="badge badge-info">${b.category}</span></td>
        <td>${b.totalCopies}</td>
        <td><span class="badge ${b.availableCopies > 0 ? 'badge-success' : 'badge-danger'}">${b.availableCopies}</span></td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="editBook('${b.id}')" style="margin-right:0.25rem;">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteBook('${b.id}')">Delete</button>
        </td>
    </tr>`).join('');
}

function handleBookForm(e) {
    e.preventDefault();
    const books = getData('books');
    const editId = document.getElementById('book-edit-id').value;

    const bookData = {
        title: document.getElementById('book-title').value.trim(),
        author: document.getElementById('book-author').value.trim(),
        isbn: document.getElementById('book-isbn').value.trim(),
        category: document.getElementById('book-category').value,
        publisher: document.getElementById('book-publisher').value.trim(),
        year: parseInt(document.getElementById('book-year').value) || 2024,
        totalCopies: parseInt(document.getElementById('book-copies').value) || 1,
        location: document.getElementById('book-location').value.trim(),
        description: document.getElementById('book-description').value.trim()
    };

    if (editId) {
        const idx = books.findIndex(b => b.id === editId);
        if (idx !== -1) {
            const diff = bookData.totalCopies - books[idx].totalCopies;
            bookData.availableCopies = Math.max(0, books[idx].availableCopies + diff);
            books[idx] = { ...books[idx], ...bookData };
            setData('books', books);
            showToast('Book updated successfully!', 'success');
        }
    } else {
        bookData.id = genId('B');
        bookData.availableCopies = bookData.totalCopies;
        books.push(bookData);
        setData('books', books);
        showToast('Book added successfully!', 'success');
    }

    resetBookForm();
    renderManageBooks();
}

function editBook(bookId) {
    const books = getData('books');
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    document.getElementById('book-edit-id').value = book.id;
    document.getElementById('book-title').value = book.title;
    document.getElementById('book-author').value = book.author;
    document.getElementById('book-isbn').value = book.isbn;
    document.getElementById('book-category').value = book.category;
    document.getElementById('book-publisher').value = book.publisher || '';
    document.getElementById('book-year').value = book.year || '';
    document.getElementById('book-copies').value = book.totalCopies;
    document.getElementById('book-location').value = book.location || '';
    document.getElementById('book-description').value = book.description || '';

    document.getElementById('book-form-title').textContent = 'Edit Book';
    document.getElementById('book-form-btn').textContent = 'Update Book';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetBookForm() {
    document.getElementById('book-form').reset();
    document.getElementById('book-edit-id').value = '';
    document.getElementById('book-form-title').textContent = 'Add New Book';
    document.getElementById('book-form-btn').textContent = 'Add Book';
}

function deleteBook(bookId) {
    const books = getData('books');
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    showModal('Delete Book', `<p>Are you sure you want to delete <strong>"${book.title}"</strong>?</p><p class="text-muted" style="margin-top:0.5rem;">This action cannot be undone.</p>`,
        `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="btn btn-danger" onclick="confirmDeleteBook('${bookId}')">Delete</button>`);
}

function confirmDeleteBook(bookId) {
    closeModal();
    const books = getData('books').filter(b => b.id !== bookId);
    setData('books', books);
    showToast('Book deleted successfully.', 'info');
    renderManageBooks();
}

function renderIssueForm() {
    const users = getData('users').filter(u => u.role === 'student');
    const books = getData('books').filter(b => b.availableCopies > 0);

    const studentSelect = document.getElementById('issue-student');
    studentSelect.innerHTML = '<option value="">Select Student</option>' + users.map(u =>
        `<option value="${u.id}">${u.fullName} (${u.studentId || u.username})</option>`
    ).join('');

    const bookSelect = document.getElementById('issue-book');
    bookSelect.innerHTML = '<option value="">Select Book</option>' + books.map(b =>
        `<option value="${b.id}">${b.title} (${b.availableCopies} available)</option>`
    ).join('');

    const settings = getSettings();
    document.getElementById('issue-date').value = getToday();
    document.getElementById('issue-due-date').value = dateOffset(settings.loanPeriodDays);
}

function handleIssueBook(e) {
    e.preventDefault();
    const studentId = document.getElementById('issue-student').value;
    const bookId = document.getElementById('issue-book').value;
    const issueDate = document.getElementById('issue-date').value;
    const dueDate = document.getElementById('issue-due-date').value;

    if (!studentId || !bookId) {
        showToast('Please select both a student and a book.', 'error');
        return;
    }

    const books = getData('books');
    const bookIdx = books.findIndex(b => b.id === bookId);
    if (bookIdx === -1 || books[bookIdx].availableCopies <= 0) {
        showToast('This book is no longer available.', 'error');
        return;
    }

    simulateAsync(() => {
        books[bookIdx].availableCopies--;
        setData('books', books);

        const borrowings = getData('borrowings');
        borrowings.push({
            id: genId('BR'),
            userId: studentId,
            bookId: bookId,
            borrowDate: issueDate,
            dueDate: dueDate,
            returnDate: null,
            status: 'Active'
        });
        setData('borrowings', borrowings);

        showToast(`Book issued successfully!`, 'success');
        document.getElementById('issue-form').reset();
        renderIssueForm();
    });
}

function renderReturns() {
    const borrowings = getData('borrowings').filter(b => b.status === 'Active' || b.status === 'Overdue');
    const books = getData('books');
    const users = getData('users');
    const tbody = document.getElementById('returns-table-body');

    if (borrowings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;" class="text-muted">No active borrowings to process.</td></tr>';
        return;
    }

    tbody.innerHTML = borrowings.map(br => {
        const book = books.find(b => b.id === br.bookId);
        const user = users.find(u => u.id === br.userId);
        const isOverdue = new Date(getToday()) > new Date(br.dueDate + 'T00:00:00');
        return `<tr>
            <td>${user ? user.fullName : 'Unknown'}</td>
            <td>${book ? book.title : 'Unknown'}</td>
            <td>${formatDate(br.borrowDate)}</td>
            <td>${formatDate(br.dueDate)}</td>
            <td><span class="badge ${isOverdue ? 'badge-danger' : 'badge-success'}">${isOverdue ? 'Overdue' : 'Active'}</span></td>
            <td><button class="btn btn-sm btn-success" onclick="processReturn('${br.id}')">Process Return</button></td>
        </tr>`;
    }).join('');
}

function processReturn(borrowingId) {
    const borrowings = getData('borrowings');
    const br = borrowings.find(b => b.id === borrowingId);
    if (!br) return;
    const books = getData('books');
    const book = books.find(b => b.id === br.bookId);

    showModal('Process Return', `<p>Process return for <strong>"${book ? book.title : 'Unknown'}"</strong>?</p>`,
        `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="btn btn-success" onclick="confirmProcessReturn('${borrowingId}')">Confirm Return</button>`);
}

function confirmProcessReturn(borrowingId) {
    closeModal();
    simulateAsync(() => {
        const borrowings = getData('borrowings');
        const books = getData('books');
        const br = borrowings.find(b => b.id === borrowingId);
        if (!br) return;

        br.returnDate = getToday();
        br.status = 'Returned';

        const bookIdx = books.findIndex(b => b.id === br.bookId);
        if (bookIdx !== -1) books[bookIdx].availableCopies++;

        // Check overdue fine
        if (new Date(getToday()) > new Date(br.dueDate + 'T00:00:00')) {
            const settings = getSettings();
            const daysOverdue = Math.ceil((new Date(getToday()) - new Date(br.dueDate + 'T00:00:00')) / 86400000);
            const fineAmount = daysOverdue * settings.finePerDay;
            const fines = getData('fines');
            fines.push({
                id: genId('F'),
                userId: br.userId,
                bookId: br.bookId,
                amount: fineAmount,
                dateIssued: getToday(),
                status: 'Unpaid'
            });
            setData('fines', fines);
            showToast(`Return processed. Late fine of $${fineAmount.toFixed(2)} applied.`, 'warning');
        } else {
            showToast('Return processed successfully!', 'success');
        }

        setData('borrowings', borrowings);
        setData('books', books);
        renderReturns();
    });
}

function renderLibrarianReports() {
    const books = getData('books');
    const borrowings = getData('borrowings');

    // Books by category
    const catCounts = {};
    books.forEach(b => { catCounts[b.category] = (catCounts[b.category] || 0) + b.totalCopies; });
    const maxCat = Math.max(...Object.values(catCounts), 1);
    document.getElementById('lib-chart-categories').innerHTML = Object.entries(catCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, count]) => `
            <div class="bar-row">
                <span class="bar-label">${cat}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${(count / maxCat * 100)}%">${count}</div></div>
            </div>
        `).join('');

    // Popular books
    const borrowCounts = {};
    borrowings.forEach(b => { borrowCounts[b.bookId] = (borrowCounts[b.bookId] || 0) + 1; });
    const sorted = Object.entries(borrowCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const popContainer = document.getElementById('lib-popular-books');
    if (sorted.length === 0) {
        popContainer.innerHTML = '<p class="text-muted">No borrowing data yet.</p>';
    } else {
        popContainer.innerHTML = '<div class="activity-list">' + sorted.map(([bookId, count], i) => {
            const book = books.find(b => b.id === bookId);
            return `<div class="activity-item">
                <span class="activity-dot blue"></span>
                <div><div><strong>#${i + 1}</strong> ${book ? book.title : 'Unknown'}</div>
                <small class="text-muted">${count} times borrowed</small></div>
            </div>`;
        }).join('') + '</div>';
    }
}

// ==================== ADMIN VIEWS ====================

function renderAdminHome() {
    const books = getData('books');
    const users = getData('users');
    const borrowings = getData('borrowings');
    const fines = getData('fines');

    document.getElementById('admin-stat-books').textContent = books.reduce((s, b) => s + b.totalCopies, 0);
    document.getElementById('admin-stat-users').textContent = users.length;
    document.getElementById('admin-stat-borrows').textContent = borrowings.filter(b => b.status === 'Active' || b.status === 'Overdue').length;
    document.getElementById('admin-stat-fines').textContent = '$' + fines.filter(f => f.status === 'Paid').reduce((s, f) => s + f.amount, 0).toFixed(2);

    // Monthly chart
    const monthCounts = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Show last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        const label = monthNames[d.getMonth()] + ' ' + d.getFullYear();
        monthCounts[key] = { label, count: 0 };
    }
    borrowings.forEach(b => {
        const key = b.borrowDate.substring(0, 7);
        if (monthCounts[key]) monthCounts[key].count++;
    });
    const maxMonth = Math.max(...Object.values(monthCounts).map(v => v.count), 1);
    document.getElementById('admin-chart-monthly').innerHTML = Object.values(monthCounts).map(v => `
        <div class="bar-row">
            <span class="bar-label">${v.label}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${(v.count / maxMonth * 100)}%">${v.count}</div></div>
        </div>
    `).join('');
}

function renderAdminUsers() {
    const users = getData('users');
    const tbody = document.getElementById('users-table-body');

    tbody.innerHTML = users.map(u => {
        const roleBadge = u.role === 'admin' ? 'badge-danger' : u.role === 'librarian' ? 'badge-warning' : 'badge-info';
        return `<tr>
            <td>${u.fullName}</td>
            <td>${u.username}</td>
            <td>${u.email}</td>
            <td><span class="badge ${roleBadge}">${u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span></td>
            <td>${u.department || '-'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editUser('${u.id}')" style="margin-right:0.25rem;">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser('${u.id}')">Delete</button>
            </td>
        </tr>`;
    }).join('');
}

function handleUserForm(e) {
    e.preventDefault();
    const users = getData('users');
    const editId = document.getElementById('user-edit-id').value;

    const userData = {
        fullName: document.getElementById('user-fullname').value.trim(),
        username: document.getElementById('user-username').value.trim(),
        email: document.getElementById('user-email').value.trim(),
        role: document.getElementById('user-role').value,
        department: document.getElementById('user-department').value.trim()
    };

    const pwd = document.getElementById('user-password').value;

    // Validate unique username
    const dup = users.find(u => u.username === userData.username && u.id !== editId);
    if (dup) {
        showToast('Username already exists.', 'error');
        return;
    }

    if (editId) {
        const idx = users.findIndex(u => u.id === editId);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...userData };
            if (pwd) users[idx].password = pwd;
            setData('users', users);
            showToast('User updated successfully!', 'success');
        }
    } else {
        if (!pwd) {
            showToast('Password is required for new users.', 'error');
            return;
        }
        userData.id = genId('U');
        userData.password = pwd;
        userData.studentId = userData.role === 'student' ? 'STU-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000) : '';
        users.push(userData);
        setData('users', users);
        showToast('User added successfully!', 'success');
    }

    resetUserForm();
    renderAdminUsers();
}

function editUser(userId) {
    const users = getData('users');
    const user = users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('user-edit-id').value = user.id;
    document.getElementById('user-fullname').value = user.fullName;
    document.getElementById('user-username').value = user.username;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-role').value = user.role;
    document.getElementById('user-department').value = user.department || '';
    document.getElementById('user-password').value = '';

    document.getElementById('user-form-title').textContent = 'Edit User';
    document.getElementById('user-form-btn').textContent = 'Update User';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetUserForm() {
    document.getElementById('user-form').reset();
    document.getElementById('user-edit-id').value = '';
    document.getElementById('user-form-title').textContent = 'Add New User';
    document.getElementById('user-form-btn').textContent = 'Add User';
}

function deleteUser(userId) {
    const users = getData('users');
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.username === 'admin') {
        showToast('Cannot delete the primary admin account.', 'error');
        return;
    }

    showModal('Delete User', `<p>Are you sure you want to delete user <strong>"${user.fullName}"</strong>?</p>`,
        `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="btn btn-danger" onclick="confirmDeleteUser('${userId}')">Delete</button>`);
}

function confirmDeleteUser(userId) {
    closeModal();
    const users = getData('users').filter(u => u.id !== userId);
    setData('users', users);
    showToast('User deleted.', 'info');
    renderAdminUsers();
}

function renderAdminReports() {
    const books = getData('books');
    const borrowings = getData('borrowings');

    // Category chart
    const catCounts = {};
    books.forEach(b => { catCounts[b.category] = (catCounts[b.category] || 0) + b.totalCopies; });
    const maxCat = Math.max(...Object.values(catCounts), 1);
    document.getElementById('admin-chart-categories').innerHTML = Object.entries(catCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, count]) => `
            <div class="bar-row">
                <span class="bar-label">${cat}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${(count / maxCat * 100)}%">${count}</div></div>
            </div>
        `).join('');

    // Overdue stats
    const overdue = borrowings.filter(b => b.status === 'Overdue');
    const active = borrowings.filter(b => b.status === 'Active');
    const returned = borrowings.filter(b => b.status === 'Returned');
    document.getElementById('admin-overdue-stats').innerHTML = `
        <div class="system-status">
            <div class="status-row"><span>Total Borrowings</span><span class="badge badge-info">${borrowings.length}</span></div>
            <div class="status-row"><span>Active</span><span class="badge badge-success">${active.length}</span></div>
            <div class="status-row"><span>Overdue</span><span class="badge badge-danger">${overdue.length}</span></div>
            <div class="status-row"><span>Returned</span><span class="badge badge-secondary">${returned.length}</span></div>
            <div class="status-row"><span>Overdue Rate</span><span class="badge ${overdue.length > 0 ? 'badge-warning' : 'badge-success'}">${borrowings.length > 0 ? ((overdue.length / borrowings.length) * 100).toFixed(1) : 0}%</span></div>
        </div>`;

    // Popular books
    const borrowCounts = {};
    borrowings.forEach(b => { borrowCounts[b.bookId] = (borrowCounts[b.bookId] || 0) + 1; });
    const sorted = Object.entries(borrowCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const popContainer = document.getElementById('admin-popular-books');
    if (sorted.length === 0) {
        popContainer.innerHTML = '<p class="text-muted">No borrowing data.</p>';
    } else {
        const maxBorrow = sorted[0][1];
        popContainer.innerHTML = '<div class="bar-chart">' + sorted.map(([bookId, count]) => {
            const book = books.find(b => b.id === bookId);
            return `<div class="bar-row">
                <span class="bar-label">${book ? (book.title.length > 18 ? book.title.substring(0, 18) + '...' : book.title) : 'Unknown'}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${(count / maxBorrow * 100)}%">${count}</div></div>
            </div>`;
        }).join('') + '</div>';
    }
}

function renderAdminSettings() {
    const settings = getSettings();
    document.getElementById('setting-lib-name').value = settings.libraryName;
    document.getElementById('setting-max-books').value = settings.maxBooksPerStudent;
    document.getElementById('setting-loan-days').value = settings.loanPeriodDays;
    document.getElementById('setting-fine-rate').value = settings.finePerDay;
    document.getElementById('setting-reservation-days').value = settings.reservationExpiryDays;
}

function handleSettingsForm(e) {
    e.preventDefault();
    const settings = {
        libraryName: document.getElementById('setting-lib-name').value.trim(),
        maxBooksPerStudent: parseInt(document.getElementById('setting-max-books').value),
        loanPeriodDays: parseInt(document.getElementById('setting-loan-days').value),
        finePerDay: parseFloat(document.getElementById('setting-fine-rate').value),
        reservationExpiryDays: parseInt(document.getElementById('setting-reservation-days').value)
    };
    setData('settings', settings);
    // Also update the raw key for getSettings
    localStorage.setItem('smartlib_settings', JSON.stringify(settings));
    showToast('Settings saved successfully!', 'success');
}

function confirmResetData() {
    showModal('Reset All Data', '<p>This will reset <strong>all data</strong> to the default sample data. All changes you have made will be lost.</p><p class="text-muted" style="margin-top:0.5rem;">This action cannot be undone.</p>',
        `<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
         <button class="btn btn-danger" onclick="doResetData()">Reset Everything</button>`);
}

function doResetData() {
    closeModal();
    simulateAsync(() => {
        resetAllData();
        showToast('All data has been reset to defaults.', 'info');
        renderAdminHome();
        renderAdminSettings();
    }, 800);
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    initData();
    checkSession();
});
