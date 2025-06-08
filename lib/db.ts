// This file now uses SQLite instead of MongoDB
// We'll set up the SQLite database and tables here

import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.resolve(process.cwd(), 'rsn-news.db')
const db = new Database(dbPath)

db.exec(`
CREATE TABLE IF NOT EXISTS profile (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  author_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES profile(id)
);
`)

// Remove all mock data and mock-based functions below, and replace with real SQLite CRUD helpers

// --- Profile CRUD ---
export function createProfile({ id, email, password, role = 'user' }: { id: string, email: string, password: string, role?: string }) {
  const stmt = db.prepare('INSERT INTO profile (id, email, password, role) VALUES (?, ?, ?, ?)');
  stmt.run(id, email, password, role);
}

export function getProfileByEmail(email: string) {
  const stmt = db.prepare('SELECT * FROM profile WHERE email = ?');
  return stmt.get(email);
}

export function getProfileById(id: string) {
  const stmt = db.prepare('SELECT * FROM profile WHERE id = ?');
  return stmt.get(id);
}

export function updateProfileRole(id: string, role: string) {
  const stmt = db.prepare('UPDATE profile SET role = ? WHERE id = ?');
  stmt.run(role, id);
}

export function deleteProfile(id: string) {
  const stmt = db.prepare('DELETE FROM profile WHERE id = ?');
  stmt.run(id);
}

// --- News CRUD ---
export function createNews({ title, content, category, image_url, author_id }: { title: string, content: string, category: string, image_url?: string, author_id?: string }) {
  const stmt = db.prepare('INSERT INTO news (title, content, category, image_url, author_id) VALUES (?, ?, ?, ?, ?)');
  stmt.run(title, content, category, image_url || '', author_id || null);
}

export function getAllNews() {
  const stmt = db.prepare('SELECT * FROM news ORDER BY created_at DESC');
  return stmt.all();
}

export function getNewsById(id: number) {
  const stmt = db.prepare('SELECT * FROM news WHERE id = ?');
  return stmt.get(id);
}

export function updateNews({ id, title, content, category, image_url }: { id: number, title: string, content: string, category: string, image_url?: string }) {
  const stmt = db.prepare('UPDATE news SET title = ?, content = ?, category = ?, image_url = ? WHERE id = ?');
  stmt.run(title, content, category, image_url || '', id);
}

export function deleteNews(id: number) {
  const stmt = db.prepare('DELETE FROM news WHERE id = ?');
  stmt.run(id);
}

export default db;
