import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// Nastavení cest pro soubory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializace
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// TADY JE TO KOUZLO: Servírujeme složku public (HTML, CSS, Obrázky)
app.use(express.static(path.join(__dirname, '../public')));

// Spuštění serveru na portu 3000
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server běží na portu ${PORT}`);
});