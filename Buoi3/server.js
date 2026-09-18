const http = require('http');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'db.json');
const PORT = 3000;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const sendData = (key) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Lỗi máy chủ khi đọc file' }));
                return;
            }
            
            const jsonData = JSON.parse(data);
            res.writeHead(200);
            
            const responseData = key ? jsonData[key] : jsonData;
            res.end(JSON.stringify(responseData));
        });
    };

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Chào mừng đến với API. Thử truy cập /api/articles hoặc /api/videos' }));
    } 
    else if (req.method === 'GET' && req.url === '/api/all') {
        sendData(); 
    }
    else if (req.method === 'GET' && req.url === '/api/articles') {
        sendData('articles'); 
    }
    else if (req.method === 'GET' && req.url === '/api/videos') {
        sendData('videos'); 
    } 
    else {
        
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Không tìm thấy API (404 Not Found)' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});