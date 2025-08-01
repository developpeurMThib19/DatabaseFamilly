const jwt = require('jsonwebtoken');

function authorizeAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
   
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({ error: 'Accès interdit. Admin uniquement.' });
    }
    next();
    
    if (!token) return res.status(401).json({ error: 'Token manquant' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    if (!user.is_admin) return res.status(403).json({ error: 'Accès refusé' });

    req.user = user;
    next();
  });
}

module.exports = authorizeAdmin;