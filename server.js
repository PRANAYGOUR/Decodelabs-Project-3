const http = require('http');
const db = require('./database');

const server = http.createServer((req, res) => {
    // Set basic headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Extract user ID from URL
    const userIdMatch = req.url.match(/^\/users\/(\d+)$/);
    const id = userIdMatch ? parseInt(userIdMatch[1], 10) : null;

    // CREATE (POST /users)
    if (req.url === '/users' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const { name, email } = JSON.parse(body);
                if (!name || !email) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ error: 'Name and email are required' }));
                }
                
                // Using Parameterized Query to prevent SQL Injection
                const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
                db.run(sql, [name, email], function(err) {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            res.writeHead(409); // 409 Conflict
                            return res.end(JSON.stringify({ error: 'Email already exists' }));
                        }
                        res.writeHead(500);
                        return res.end(JSON.stringify({ error: 'Database error: ' + err.message }));
                    }
                    res.writeHead(201);
                    res.end(JSON.stringify({ id: this.lastID, name, email }));
                });
            } catch(e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
        });
    }
    // READ ALL (GET /users)
    else if (req.url === '/users' && req.method === 'GET') {
        db.all(`SELECT * FROM users`, [], (err, rows) => {
            if (err) {
                res.writeHead(500);
                return res.end(JSON.stringify({ error: 'Database error: ' + err.message }));
            }
            res.writeHead(200);
            res.end(JSON.stringify(rows));
        });
    }
    // READ SINGLE (GET /users/:id)
    else if (id && req.method === 'GET') {
        db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
            if (err) {
                res.writeHead(500);
                return res.end(JSON.stringify({ error: 'Database error: ' + err.message }));
            }
            if (row) {
                res.writeHead(200);
                res.end(JSON.stringify(row));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'User not found' }));
            }
        });
    }
    // UPDATE (PUT /users/:id)
    else if (id && req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const { name, email } = JSON.parse(body);
                if (!name || !email) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ error: 'Name and email are required' }));
                }

                const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
                db.run(sql, [name, email, id], function(err) {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            res.writeHead(409);
                            return res.end(JSON.stringify({ error: 'Email already exists' }));
                        }
                        res.writeHead(500);
                        return res.end(JSON.stringify({ error: 'Database error: ' + err.message }));
                    }
                    if (this.changes === 0) {
                        res.writeHead(404);
                        return res.end(JSON.stringify({ error: 'User not found' }));
                    }
                    res.writeHead(200);
                    res.end(JSON.stringify({ id, name, email }));
                });
            } catch(e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
        });
    }
    // DELETE (DELETE /users/:id)
    else if (id && req.method === 'DELETE') {
        db.run(`DELETE FROM users WHERE id = ?`, [id], function(err) {
            if (err) {
                res.writeHead(500);
                return res.end(JSON.stringify({ error: 'Database error: ' + err.message }));
            }
            if (this.changes === 0) {
                res.writeHead(404);
                return res.end(JSON.stringify({ error: 'User not found' }));
            }
            res.writeHead(204);
            res.end();
        });
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Endpoint Not Found' }));
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Test GET All: curl http://localhost:${PORT}/users`);
});
