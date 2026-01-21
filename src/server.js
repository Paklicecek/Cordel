import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
import bcrypt from "bcryptjs"
import * as db from './config/db.js'

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

// REGISTER
app.post('/api/signup',async (req, res) =>{
    const { user,email,password } = req.body
    try{
        if(user.length < 3 || password.length < 6){
        // Change error displaying on the site
        return res.json({short: true , error: "Username or password is too short."})
        }
        const hash = await bcrypt.hash(password, 10)

        await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)', 
            [user, email, hash]
        )
        return res.json({ short: false, message: "Account was succesfully created." })
    }
    catch(err){
        console.log(err)
        //Error for duplicities (UNIQUE ON THE DB)
        if (err.code === '23505') {
            // Change error displaying on the site
            return res.json({ short: true, error: "Username or email is already taken." })
        }
        return res.status(500).json({ error: "Database error" });
    }
})
// LOGIN
app.post('/api/signin', async (req, res) =>{
    const { user,password } = req.body;
    try{
        if(user.length < 3 || password.length < 6){
        return res.json({ok: false, short: true , error: "Username or password is too short."})
        }   
        const result = await db.query(
            'SELECT * FROM users WHERE username = $1', 
            [user]
        )
        if(result.rows.length === 0){
            return res.json({ok: false, short: true , error: "User doesn't exist. Please register first."})
        }
        const foundUser = result.rows[0]
        const match = await bcrypt.compare(password,foundUser.password_hash)
        

        if (match) {
            return res.json({
                ok: true, 
                short: false, 
                message: "Logged in successfully.",
                user:{
                    id: foundUser.id,
                    username:foundUser.username
                }
            })
        } 
        else {
            return res.json({ ok: false, error: "Wrong password" });
        }
    }
    catch(err){ 
        console.log(err)
    }
})

const onlineUsers = {}

async function updateUsersList() {
    const rows = await db.query('SELECT username FROM users')
    const allUsers = rows.map(r => r.username)

    const onlineNames = Object.values(onlineUsers)
    const offlineNames = allUsers.filter(user => !onlineNames.includes(user))

    io.emit('updateUserList', { online: onlineNames, offline: offlineNames })
}

io.on("connection", async (socket) => {

    socket.on("join", (username) => {
        onlineUsers[socket.id] = username
        updateUsersList()
    })
    socket.on('disconnect', () => {
        delete onlineUsers[socket.id]
        updateUsersList()
    })

    try {
        const result = await db.query(`
            SELECT messages.content, users.username, messages.created_at 
            FROM messages 
            JOIN users ON messages.user_id = users.id 
            ORDER BY messages.created_at ASC 
        `);

        result.rows.forEach(row => {
            socket.emit('chatMessage', {
                user: row.username,  
                msg: row.content,
                time: row.created_at
            })
        })

    } 
    catch (err) {
        console.error("Error with loading:", err)
    }

    socket.on('chatMessage', async (data) => {
        try {
            const userResult = await db.query(
                'SELECT id FROM users WHERE username = $1',
                [data.user]
            )
            
            if (userResult.rows.length > 0) {
                const userId = userResult.rows[0].id

                await db.query(
                    'INSERT INTO messages (user_id, content) VALUES ($1, $2)',
                    [userId, data.msg]
                )
                io.emit('chatMessage', {
                    user: data.user,
                    msg: data.msg,
                    time: new Date() 
                })
            }
        } catch (err) {
            console.error("Error while sending a message:", err)
        }
    })

    socket.on("disconnect", () => {
        console.log("Somebody left.")
    })
})


const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
})