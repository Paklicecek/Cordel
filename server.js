 // Creating a simple server that cannot use html??? quest 1
// const PORT = process.env.PORT || 3696
// let server = require('http')
// server.createServer(function(req,res){
//   res.writeHead(200, {'Content-Type': 'text/html'})
//   res.end("iam a baller")
// }).listen(PORT)
// console.log("http://localhost:" + PORT)

// -----------

// Printing out random stuff... quest 2
// import os from 'os';

// function print(cordel) {
//   console.log(cordel)
// }
// privateEncrypt(process.cwd());         // returns current working directory
// console.log(process.pid);           // process ID
// console.log(process.platform);      // "darwin" on macOS
// print(process.argv);          // command-line arguments array

// ----------------

// Ai slop to demonstrate node 
// print(os.userInfo())
// import express from "express";
// const app = express();

// // serve files from ./public
// app.use(express.static("public"));

// app.get("/api/hello", (_req, res) => {
//   res.json({ msg: "Hello from Skibidi 👋" });
// });

// const PORT = process.env.PORT || 3696;
// app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT
let messages = []
let idMessage = 0
let reloadMessage
let name
let usersTyping = 0
app.use(express.static("public"))
app.use(express.json());

app.post('/api/send',(req, res) =>{
  const message = req.body.msg
  const user = req.body.user
  let now = new Date()
  let mergeTime = ""
  let time = now.toLocaleTimeString("en-GB")
  let date = now.toISOString().split("T")[0]
  mergeTime = date + " -> " + time
  idMessage += 1 
  console.log(now)
  const messageObject = {
    time: mergeTime,
    id: idMessage,
    user: user,
    msg: message
  };
  messages.push(messageObject)
  console.log("Received:", messages); 
  res.json({ ok: true });
})
app.post('/api/remove', (req, res) => {
  const idToRemove = Number(req.body.msgToRemove);   
  const index = messages.findIndex(msg => msg.id === idToRemove);

  if (index !== -1) {
    messages.splice(index, 1);  
  }
  res.json({ ok: true });
});
app.post('/api/update', (req, res) => {
  const newText = req.body.newMessage
  const idToUpdate = req.body.id
  const index = messages.findIndex(msg => msg.id === idToUpdate);
  reloadMessage = req.body.reload
  messages[index].msg = newText

  res.json({ ok: true });
});
app.get('/api/load',(req, res) =>{
    res.json({
      message: messages,
      rldMessage: reloadMessage
    });
})
app.get("/api/greet/:username", (req, res) => {
  name = req.params.username;   
  if(name != "" && name != undefined){
    res.json({ ok: true })
  }
  else{
    res.json({ ok: false})
  }
});

app.get("/api/type/:typing", (req, res) => {
  let userTyping = req.params.typing;
   res.json({ 
    type:`${name} is typing!`
    });
  });

app.listen(port, () =>{
  console.log(`freaky link do not touch! http://localhost:${port}`)
})
