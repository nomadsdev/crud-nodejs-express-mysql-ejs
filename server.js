const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connection to database');
    } else {
        console.log('Connected to database');
    }
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    const sql = `SELECT * FROM users`;
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('index', { users: results });
    });
});

app.get('/edit', (req, res) => {
    res.render('edit');
});

app.post('/add', (req, res) => {
    const { name, occupation } = req.body;
    const sql = `INSERT INTO users (name, occupation) VALUES (?, ?)`;
    db.query(sql, [name, occupation], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/edit/:id', (req, res) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.render('edit', { user: result[0] });
    });
});

app.post('/update/:id', (req, res) => {
    const { name, occupation } = req.body;
    const sql = `UPDATE users SET name = ?, occupation = ? WHERE id = ?`;
    db.query(sql, [name, occupation, req.params.id], (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
});

app.listen(port, () => {
    console.log('Server is running');
});