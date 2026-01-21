# Cordel - Real-time Chat Application

Cordel is a web-based messaging application built to demonstrate **full-stack development** principles using **Node.js** and **PostgreSQL**.

Initially designed as a simple polling-based chat, the project has been upgraded to use **Socket.io** for bi-directional, real-time communication. It features user authentication, live presence tracking (Online/Offline users), and persistent message storage.

## 🚀 Features
* **Real-time Messaging:** Instant message delivery using WebSockets (no page refresh required).
* **User Authentication:** Secure Sign Up and Login system using `bcrypt` for password hashing.
* **Live User Status:** Sidebar automatically updates to show who is currently Online or Offline.
* **Persistent Data:** All users and messages are stored in a **PostgreSQL** database.

## 🛠️ Tech Stack
* **Backend:** Node.js, Express
* **Real-time Engine:** Socket.io
* **Database:** PostgreSQL (`pg` library)
* **Frontend:** Vanilla JavaScript, HTML5, CSS3

## 📦 How to Run

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Paklicecek/Cordel.git](https://github.com/Paklicecek/Cordel.git)
    cd Cordel
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Database Setup**
    Ensure you have PostgreSQL installed and running.
    * Create a database named `cordel_db`.
    * Import the schema (tables `users` and `messages`) or run the SQL setup commands.

4.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    DATABASE_URL=postgres://user:password@localhost:5432/cordel_db
    ```

5.  **Start the server**
    ```bash
    npm start
    ```

6.  **Open in Browser**
    Visit `http://localhost:3000`

## 📝 Future Improvements
* Add dynamic profile pictures (currently using placeholders).
* Implement private messaging rooms.
* Add option to remove or edit your message.