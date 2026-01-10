import express from 'express';
import { createServer } from 'http'; // Potřeba pro spojení Expressu a Socket.io
import { Server } from 'socket.io';  // Hlavní knihovna pro WebSockety
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Nastavení cest (Protože v ES Modulech nemáme __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Inicializace aplikace
const app = express();
const httpServer = createServer(app); // Vytvoříme HTTP server
const io = new Server(httpServer);    // "Nalepíme" na něj WebSockety

// 3. Servírování statických souborů (Frontend)
// Říkáme: "Když někdo přijde na web, dej mu soubory ze složky public"
app.use(express.static(path.join(__dirname, '../public')));

// ==========================================
// 4. WEBSOCKET LOGIKA (To, co jsi chtěl vysvětlit)
// ==========================================
io.on('connection', (socket) => {
    // Tohle se spustí POKAŽDÉ, když někdo otevře stránku
    console.log(`🔌 Nový klient připojen! ID: ${socket.id}`);

    // NASLOUCHÁNÍ (Server čeká na zprávu 'test-connection' od klienta)
    socket.on('test-connection', (data) => {
        console.log('📩 Přišla zpráva od klienta:', data);
        
        // ODPOVĚĎ (Server pošle zprávu zpátky jen tomuto klientovi)
        socket.emit('server-reply', { 
            text: 'Ahoj z Windows Serveru! Spojení funguje.', 
            time: new Date().toLocaleTimeString() 
        });
    });

    // Když klient zavře okno
    socket.on('disconnect', () => {
        console.log(`❌ Klient odpojen: ${socket.id}`);
    });
});

// 5. Spuštění serveru
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server běží na http://localhost:${PORT}`);
});