# Cordel

A real-time chat application inspired by Discord.
**Project completed as of 18.2.2026.** The PFP upload feature was entirely vibe coded.

## 🚀 Features

* **Real-time Messaging:** Instant message delivery using Socket.io.
* **User Authentication:** Secure Signup and Login system with password hashing (bcrypt).
* **Custom & Random Avatars:** Users can upload their own PFPs or get automatic DiceBear avatars.
* **Live Status:** See who is Online and Offline in real-time.
* **Typing Indicators:** See when other users are typing.
* **Message History:** Persistent chat history stored in PostgreSQL.
* **Admin Privileges:** Admins can delete any message (Users can delete their own).

## 🛠️ Tech Stack

* **Backend:** Node.js, Express
* **Real-time Engine:** Socket.io
* **Database:** PostgreSQL
* **Frontend:** Vanilla JavaScript, HTML5, CSS3
* **Containerization:** Docker & Docker Compose

## 🔮 Planned / Removed Features

These features were originally planned but were removed or postponed to finalize the project:

1.  **Mobile Responsivity:** Full optimization for mobile devices.
2.  **Desktop App:** Wrapping the application as an Electron app.

## 📦 How to Run

### Prerequisites
* Docker Desktop installed

### Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/Paklicek/Cordel.git](https://github.com/Paklicek/Cordel.git)
    cd Cordel
    ```

2.  Create `.env` file (optional, defaults are set in docker-compose):
    ```ini
    PORT=3000
    DATABASE_URL=postgres://cordel_dev:password@db:5432/cordel_db
    ```

3.  Run with Docker:
    ```bash
    docker-compose up --build
    ```

4.  Open your browser and visit:
    `http://localhost:3000`

---
*Created by Paklicek*