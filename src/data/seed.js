// Starting data and constants used across the app.
export const START_BOOKS = [
  { id: "b1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", isbn: "9780743273565", price: 135, stock: 20 },
  { id: "b2", title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", isbn: "9780061120084", price: 150, stock: 0 },
  { id: "b3", title: "1984", author: "George Orwell", genre: "Fiction", isbn: "9780451524935", price: 120, stock: 13 },
  { id: "b4", title: "Pride and Prejudice", author: "Jane Austen", genre: "Classic", isbn: "9780141439518", price: 110, stock: 1 },
  { id: "b5", title: "Eloquent JavaScript", author: "Marijn Haverbeke", genre: "Education", isbn: "9781593279509", price: 260, stock: 5 },
];

export const START_MEMBERS = [
  { id: "u1", name: "Motlatsi Chaka", membershipId: "LIB-001", role: "Admin" },
  { id: "u2", name: "Sam Rivera", membershipId: "LIB-002", role: "Member" },
  { id: "u3", name: "Lineo Mohapi", membershipId: "LIB-003", role: "Member" },
  { id: "u4", name: "Palesa Nkosi", membershipId: "LIB-004", role: "Librarian" },
];

export const ROLES = ["Admin", "Librarian", "Member"];

// Which pages each role may open.
export const ACCESS = {
  Admin: ["/", "/books", "/transactions", "/users"],
  Librarian: ["/", "/transactions"],
  Member: ["/"],
};

export const NAV = [
  ["/", "Dashboard"],
  ["/books", "Book Management"],
  ["/transactions", "Transactions"],
  ["/users", "User Management"],
];

export const DEMO = [
  ["Admin", "Motlatsi Chaka", "LIB-001"],
  ["Librarian", "Palesa Nkosi", "LIB-004"],
  ["Member", "Sam Rivera", "LIB-002"],
];

export const GENRES = ["Fiction", "Non-Fiction", "Dystopian", "Romance", "Science", "Technology", "History", "Education", "Biography", "Other"];

export const ACTION_LABEL = { borrow: "Borrowed / Deducted", return: "Returned", restock: "Added Stock" };

export const LOW_STOCK_LIMIT = 2; // fewer than 2 copies = low stock
