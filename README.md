# Cordel

A real-time chat application inspired by Discord.

## 🚀 Features

* **Real-time Messaging:** Instant message delivery using Socket.io.
* **User Authentication:** Secure Signup and Login system with password hashing (bcrypt).
* **Random Avatars:** Automatic generation of unique user avatars via DiceBear API based on username seeds.
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

1.  **Settings Pop-up:** Ability to change password, profile picture, username, and view account stats.
2.  **Forgot Password:** Password recovery page.
3.  **Mobile Responsivity:** Full optimization for mobile devices.
4.  **Desktop App:** Wrapping the application as an Electron app.

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
