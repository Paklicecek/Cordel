import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

app.post('/api/signup',(req, res) =>{
    const { user,password } = req.body
    try{
        if(user.length < 3 || password.length < 6){
        return res.json({short: true , error: "Username or password is too short."})
        }
        res.json({ short: false, message: "Account was succesfully created." })
    }
    catch(err){
        console.log(err)
    }
})
app.post('/api/signin',(req, res) =>{
    const { user,password } = req.body;
    try{
        if(user.length < 3 || password.length < 6){
        return res.json({ok: false, short: true , error: "Username or password is too short."})
        }   
        res.json({ok: true, short: false, message: "Logged in succesfully." })
    }
    catch(err){ 
        console.log(err)
    }
})

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server běží na portu ${PORT}`);
});