import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import * as db from "./config/db.js"
import nodemailer from "nodemailer"


dotenv.config()


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

let code = null
function generateCode() {
    const code = Math.floor(Math.random() * 1000000);
    return code.toString().padStart(6, '0');
}

app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))

// REGISTER
app.post("/api/signup",async (req, res) =>{
    const { user,email,password } = req.body
    try{
        if(user.length < 3 || password.length < 6){
        return res.json({ok: false, short: true , error: "Username or password is too short."})
        }
        const hash = await bcrypt.hash(password, 10)

        await db.query(
            'INSERT INTO users (username, email, password_hash, is_admin) VALUES ($1, $2, $3, $4)', 
            [user, email, hash, false]
        )
        return res.json({ok: true, short: false, message: "Account was succesfully created." })
    }
    catch(err){
        console.error("Auth Error: " + err)
        //Error for duplicities (UNIQUE ON THE DB)
        if (err.code === "23505") {
            return res.json({ short: true, error: "Username or email is already taken." })
        }
        return res.status(500).json({ error: "Database error" })
    }
})
// LOGIN
app.post("/api/signin", async (req, res) =>{
    const { user,password } = req.body
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
                    username:foundUser.username,
                    isAdmin: foundUser.is_admin
                }
            })
        } 
        else {
            return res.json({ ok: false, error: "Wrong password" })
        }
    }
    catch(err){ 
        console.log(err)
    }
})
app.post("/api/setAdmin",async (req, res) =>{
    const { toSetAdmin } = req.body
    try {
        const result = await db.query(
            'UPDATE users SET is_admin = true WHERE username = $1', 
            [toSetAdmin]
        )

        if (result.rowCount > 0) {
            return res.json({ ok: true, message: "User was successfully admined." })
        } 
        else {
            return res.json({ ok: false, message: "User doesn't exist." })
        }
    }
    catch (err) {
        console.error("Error: " + err)
        return res.status(500).json({ error: "Database error" })
    }
})

app.post("/api/email",async (req, res) =>{
    const { email } = req.body
    try {
        const result = await db.query(
            'SELECT username FROM users WHERE email = $1', 
            [email]
        )
        if(result.rows.length === 0){
            return res.json({ok: false, error: "Account with this email adress doesn't exist."})
        }
        if(result.rows.length > 0){
            code = generateCode()
            console.log(code)
            const result = await db.query(
                'UPDATE users SET recovery_code = $1, recovery_expires = NOW() + INTERVAL \'1 hour\' WHERE email = $2', 
                [code, email]
            )
            return res.json({ok: true, message: "Recovery code sent to email."})
        }
    }
    catch (err) {
        console.error("Error: " + err)
        return res.status(500).json({ error: "Database error" })
    }
})

app.post("/api/code",async (req, res) =>{
    const { code, email } = req.body
    try {
        const result = await db.query(
            'SELECT recovery_code FROM users WHERE recovery_code = $1 AND email = $2', 
            [code,email]
        )
        if(result.rows.length === 0){
            return res.json({ok: false, message: "Invalid recovery code or email."})
        }
        if(result.rows.length > 0){
            if(result.rows[0].recovery_code === code){
                return res.json({ok: true, message: "Recovery code is valid."})
            }
        }
    }
    catch (err) {
        console.error("Error: " + err)
        return res.status(500).json({ok: false, message: "Database error" })
    }
})

const onlineUsers = {}

async function updateUsersList() {
    const result = await db.query('SELECT username, is_admin FROM users')
    const allUsers = result.rows 

    const onlineUsernames = Object.values(onlineUsers)
    const online = []
    const offline = []

    allUsers.forEach(user => {
        if (onlineUsernames.includes(user.username)) {
            online.push(user)
        } else {
            offline.push(user)
        }
    })

    io.emit("updateUserList", { online, offline})
}

io.on("connection", async (socket) => {

    socket.on("join", (username) => {
        onlineUsers[socket.id] = username
        updateUsersList()
    })
    socket.on("disconnect", () => {
        delete onlineUsers[socket.id]
        updateUsersList()
    })
    // Loading messages from DB 
    try {
        const result = await db.query(`
            SELECT messages.id, messages.content, users.username, users.is_admin, messages.created_at 
            FROM messages 
            JOIN users ON messages.user_id = users.id 
            ORDER BY messages.created_at ASC 
        `)

        result.rows.forEach(row => {
            socket.emit("chatMessage", {
                user: row.username, 
                isAdmin: row.is_admin,
                msgId: row.id, 
                msg: row.content,
                time: row.created_at
            })
        })

    } 
    catch (err) {
        console.error("Error with loading:", err)
    }

    socket.on("chatMessage", async (data) => {
        try {
            const userResult = await db.query(
                'SELECT id,is_admin FROM users WHERE username = $1',
                [data.user]
            )
            
            if (userResult.rows.length > 0) {
                const userId = userResult.rows[0].id

                const result = await db.query(
                    'INSERT INTO messages (user_id, content) VALUES ($1, $2) RETURNING id',
                    [userId, data.msg]
                )
                io.emit("chatMessage", {
                    user: data.user,
                    isAdmin: userResult.rows[0].is_admin,
                    msgId: result.rows[0].id,
                    msg: data.msg,
                    time: new Date()
                })
            }
        } catch (err) {
            console.error("Error while sending a message:", err)
        }
    })
    socket.on("deleteMessage", async (msgId) => {
        try {
            if (!msgId) return
            await db.query(
                'DELETE FROM messages WHERE id = $1',
                [msgId]
            )
            io.emit("deleteMessage", msgId)
        } 
        catch (err) {
            console.error("Error while deleting a message:", err)
        }
    })
    socket.on("typing",()=>{
        try {
            let username = onlineUsers[socket.id]
            if(username) socket.broadcast.emit("typing", username)
        } 
        catch (err) {
            console.error("Error while sending user that is typing:", err)
        }
    })
    socket.on("stopTyping",()=>{
        try {
            let username = onlineUsers[socket.id]
            if(username) socket.broadcast.emit("stopTyping", username)
        } 
        catch (err) {
            console.error("Error while sending user that stopped typing:", err)
        }
    })
})

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT} at ${new Date().toLocaleTimeString()}`)
})