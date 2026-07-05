const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Ruxsat etilgan emaillar ro'yxati
const ALLOWED_EMAILS = [
    'student1@example.com',
    'student2@brightfuture.org',
    'talaba@gmail.com'
];

// Chat xabarlarini vaqtinchalik xotirada saqlash uchun massiv
let messages = [];

const server = http.createServer((req, res) => {
    // 1. Bosh sahifani (index.html) yuklash
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('index.html fayli public papkasi ichida topilmadi!');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } 
    // 2. Emailni tekshirish (Login)
    else if (req.method === 'POST' && req.url === '/api/login') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { email } = JSON.parse(body);
            if (ALLOWED_EMAILS.includes(email.toLowerCase().trim())) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } else {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: "Kechirasiz, emailingiz ro'yxatda yo'q!" }));
            }
        });
    }
    // 3. Yangi xabar yuborish API
    else if (req.method === 'POST' && req.url === '/api/messages') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { user, text } = JSON.parse(body);
            messages.push({ user, text });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        });
    }
    // 4. Xabarlarni yangilab turish API
    else if (req.method === 'GET' && req.url === '/api/messages') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(messages));
    }
    // Boshqa har qanday noto'g'ri so'rovlar uchun
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Sahifa topilmadi');
    }
});

server.listen(PORT, () => {
    console.log(`Server muvaffaqiyatli yoqildi! Brauzerda oching: http://localhost:${PORT}`);
});