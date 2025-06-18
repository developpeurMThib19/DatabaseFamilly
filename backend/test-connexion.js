const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erreur de connexion:', err);
    } else {
        console.error('Connexion reussie :', res.rows[0]);
    }
    pool.end();
})