
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'casa-manager-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`\n🌐 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = 'PASSWORD_NASCOSTA';
    console.log('Body:', logBody);
  }
  next();
});

// Database setup
const db = new sqlite3.Database('./casa_manager.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Expenses table
  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Documents table
  db.run(`CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    upload_date TEXT,
    due_date TEXT,
    required BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Notes table
  db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Checklist table
  db.run(`CREATE TABLE IF NOT EXISTS checklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    priority TEXT DEFAULT 'medium',
    due_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Admins table
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create default admin if not exists
  db.get('SELECT * FROM admins WHERE username = ?', ['admin'], (err, admin) => {
    if (!admin) {
      bcrypt.hash('admin123', 10, (err, hashedPassword) => {
        if (!err) {
          db.run('INSERT INTO admins (username, email, password) VALUES (?, ?, ?)', 
            ['admin', 'admin@casamanager.com', hashedPassword],
            (err) => {
              if (!err) {
                console.log('✅ Account admin predefinito creato: admin/admin123');
              }
            }
          );
        }
      });
    }
  });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token di accesso richiesto' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token non valido' });
    }
    req.user = user;
    next();
  });
};

// Middleware to verify admin token
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token di accesso amministratore richiesto' });
  }

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({ error: 'Token admin non valido' });
    }
    
    if (!admin.isAdmin) {
      return res.status(403).json({ error: 'Accesso negato: privilegi di amministratore richiesti' });
    }
    
    req.admin = admin;
    next();
  });
};

// Admin login route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM admins WHERE username = ?', [username], async (err, admin) => {
    if (err) {
      return res.status(500).json({ error: 'Errore del server' });
    }

    if (!admin) {
      return res.status(401).json({ error: 'Credenziali amministratore non valide' });
    }

    try {
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenziali amministratore non valide' });
      }

      const token = jwt.sign({ 
        adminId: admin.id, 
        username: admin.username, 
        isAdmin: true 
      }, JWT_SECRET);
      
      res.json({ 
        token, 
        admin: { id: admin.id, username: admin.username, email: admin.email } 
      });
    } catch (error) {
      res.status(500).json({ error: 'Errore del server' });
    }
  });
});

// Auth routes
app.post('/api/register', async (req, res) => {
  console.log('=== REGISTRAZIONE UTENTE ===');
  console.log('Dati ricevuti:', req.body);
  
  const { username, password } = req.body;

  if (!username || !password) {
    console.log('❌ Dati mancanti');
    return res.status(400).json({ error: 'Username e password sono obbligatori' });
  }

  try {
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashata con successo');
    
    console.log('💾 Inserimento nel database...');
    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      function(err) {
        if (err) {
          console.log('❌ Errore database:', err.message);
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username già esistente' });
          }
          return res.status(500).json({ error: 'Errore durante la registrazione' });
        }
        
        console.log('✅ Utente inserito con ID:', this.lastID);
        console.log('🎫 Generazione token...');
        
        const token = jwt.sign({ userId: this.lastID, username }, JWT_SECRET);
        const response = { token, user: { id: this.lastID, username } };
        
        console.log('✅ Registrazione completata con successo');
        console.log('Risposta inviata:', { ...response, token: 'TOKEN_NASCOSTO' });
        
        res.json(response);
      }
    );
  } catch (error) {
    console.log('❌ Errore catch:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Errore del server' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenziali non valide' });
      }

      const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET);
      res.json({ 
        token, 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      res.status(500).json({ error: 'Errore del server' });
    }
  });
});

// Expenses routes
app.get('/api/expenses', authenticateToken, (req, res) => {
  db.all('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC', [req.user.userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nel recupero delle spese' });
    }
    res.json(rows);
  });
});

app.post('/api/expenses', authenticateToken, (req, res) => {
  const { description, amount, category, date, paid } = req.body;
  
  db.run(
    'INSERT INTO expenses (user_id, description, amount, category, date, paid) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.userId, description, amount, category, date, paid || false],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Errore nell\'aggiunta della spesa' });
      }
      res.json({ id: this.lastID, description, amount, category, date, paid: paid || false });
    }
  );
});

app.put('/api/expenses/:id', authenticateToken, (req, res) => {
  const { description, amount, category, date, paid } = req.body;
  
  db.run(
    'UPDATE expenses SET description = ?, amount = ?, category = ?, date = ?, paid = ? WHERE id = ? AND user_id = ?',
    [description, amount, category, date, paid, req.params.id, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Errore nell\'aggiornamento della spesa' });
      }
      res.json({ success: true });
    }
  );
});

app.delete('/api/expenses/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM expenses WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Errore nell\'eliminazione della spesa' });
    }
    res.json({ success: true });
  });
});

// Documents routes
app.get('/api/documents', authenticateToken, (req, res) => {
  db.all('SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC', [req.user.userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nel recupero dei documenti' });
    }
    res.json(rows);
  });
});

app.post('/api/documents', authenticateToken, (req, res) => {
  const { name, category, status, upload_date, due_date, required } = req.body;
  
  db.run(
    'INSERT INTO documents (user_id, name, category, status, upload_date, due_date, required) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.user.userId, name, category, status || 'pending', upload_date, due_date, required || false],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Errore nell\'aggiunta del documento' });
      }
      res.json({ id: this.lastID, name, category, status: status || 'pending', upload_date, due_date, required: required || false });
    }
  );
});

// Notes routes
app.get('/api/notes', authenticateToken, (req, res) => {
  db.all('SELECT * FROM notes WHERE user_id = ? ORDER BY date DESC, time DESC', [req.user.userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nel recupero delle note' });
    }
    res.json(rows);
  });
});

app.post('/api/notes', authenticateToken, (req, res) => {
  const { title, content, category, priority, date, time } = req.body;
  
  db.run(
    'INSERT INTO notes (user_id, title, content, category, priority, date, time) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.user.userId, title, content, category, priority || 'medium', date, time],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Errore nell\'aggiunta della nota' });
      }
      res.json({ id: this.lastID, title, content, category, priority: priority || 'medium', date, time });
    }
  );
});

// Checklist routes
app.get('/api/checklist', authenticateToken, (req, res) => {
  db.all('SELECT * FROM checklist WHERE user_id = ? ORDER BY created_at DESC', [req.user.userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nel recupero della checklist' });
    }
    res.json(rows);
  });
});

app.post('/api/checklist', authenticateToken, (req, res) => {
  const { title, description, category, completed, priority, due_date } = req.body;
  
  db.run(
    'INSERT INTO checklist (user_id, title, description, category, completed, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.user.userId, title, description, category, completed || false, priority || 'medium', due_date],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Errore nell\'aggiunta dell\'elemento checklist' });
      }
      res.json({ id: this.lastID, title, description, category, completed: completed || false, priority: priority || 'medium', due_date });
    }
  );
});

// Password change route for users
app.put('/api/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Password attuale e nuova password sono obbligatorie' });
  }

  try {
    // Get current user
    db.get('SELECT * FROM users WHERE id = ?', [req.user.userId], async (err, user) => {
      if (err || !user) {
        return res.status(500).json({ error: 'Errore nel recupero utente' });
      }

      // Verify current password
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Password attuale non corretta' });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      db.run('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, req.user.userId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Errore nell\'aggiornamento della password' });
        }
        console.log(`✅ Password cambiata per utente ${user.username}`);
        res.json({ success: true, message: 'Password aggiornata con successo' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Errore del server' });
  }
});

// Admin route to change user password
app.put('/api/admin/users/:userId/password', authenticateAdmin, async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.params.userId;
  
  if (!newPassword) {
    return res.status(400).json({ error: 'Nuova password obbligatoria' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Errore nell\'aggiornamento della password' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }
      
      console.log(`✅ Admin ${req.admin.username} ha cambiato la password dell'utente ${userId}`);
      res.json({ success: true, message: 'Password utente aggiornata con successo' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Errore del server' });
  }
});

// Admin route to change admin password
app.put('/api/admin/change-password', authenticateAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Password attuale e nuova password sono obbligatorie' });
  }

  try {
    // Get current admin
    db.get('SELECT * FROM admins WHERE id = ?', [req.admin.adminId], async (err, admin) => {
      if (err || !admin) {
        return res.status(500).json({ error: 'Errore nel recupero admin' });
      }

      // Verify current password
      const validPassword = await bcrypt.compare(currentPassword, admin.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Password attuale non corretta' });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      db.run('UPDATE admins SET password = ? WHERE id = ?', [hashedNewPassword, req.admin.adminId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Errore nell\'aggiornamento della password admin' });
        }
        console.log(`✅ Admin ${admin.username} ha cambiato la sua password`);
        res.json({ success: true, message: 'Password admin aggiornata con successo' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Errore del server' });
  }
});

// Admin routes for user management
app.get('/api/admin/users', authenticateAdmin, (req, res) => {
  db.all('SELECT id, username, created_at FROM users ORDER BY created_at DESC', (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nel recupero degli utenti' });
    }
    res.json(users);
  });
});

app.delete('/api/admin/users/:userId', authenticateAdmin, (req, res) => {
  const userId = req.params.userId;
  
  console.log(`🗑️ Admin ${req.admin.username} sta eliminando l'utente ${userId}`);
  
  // Start transaction-like operations
  db.serialize(() => {
    // Delete all user data in correct order (foreign keys)
    db.run('DELETE FROM expenses WHERE user_id = ?', [userId], (err) => {
      if (err) console.log('Errore eliminazione expenses:', err);
    });
    
    db.run('DELETE FROM documents WHERE user_id = ?', [userId], (err) => {
      if (err) console.log('Errore eliminazione documents:', err);
    });
    
    db.run('DELETE FROM notes WHERE user_id = ?', [userId], (err) => {
      if (err) console.log('Errore eliminazione notes:', err);
    });
    
    db.run('DELETE FROM checklist WHERE user_id = ?', [userId], (err) => {
      if (err) console.log('Errore eliminazione checklist:', err);
    });
    
    // Finally delete the user
    db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
      if (err) {
        console.log('❌ Errore eliminazione utente:', err);
        return res.status(500).json({ error: 'Errore nell\'eliminazione dell\'utente' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }
      
      console.log(`✅ Utente ${userId} e tutti i suoi dati eliminati con successo`);
      res.json({ success: true, message: 'Utente e tutti i dati associati eliminati con successo' });
    });
  });
});

app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
  db.serialize(() => {
    let stats = {};
    
    db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
      if (!err) stats.totalUsers = result.count;
    });
    
    db.get('SELECT COUNT(*) as count FROM expenses', (err, result) => {
      if (!err) stats.totalExpenses = result.count;
    });
    
    db.get('SELECT COUNT(*) as count FROM documents', (err, result) => {
      if (!err) stats.totalDocuments = result.count;
    });
    
    db.get('SELECT COUNT(*) as count FROM notes', (err, result) => {
      if (!err) stats.totalNotes = result.count;
      
      // Send response after last query
      setTimeout(() => {
        res.json(stats);
      }, 100);
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server in esecuzione su localhost:${PORT}`);
});
