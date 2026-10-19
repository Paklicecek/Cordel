# Cordel

Real-time web chat app built as a personal project inspired by Discord.

Includes account login (bcrypt), live chat over Socket.io, online/offline status, typing indicators, message history in PostgreSQL, and custom profile pictures (with DiceBear fallback).

## Stack
- Node.js, Express, Socket.io
- PostgreSQL
- HTML, CSS, JavaScript
- Docker

## Running locally
```bash
docker compose up --build
```
Then open `http://localhost:3000`.
