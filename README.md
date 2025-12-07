# Cordel - Chat Application Prototype

Cordel is a web-based messaging application I am building to learn backend development with **Node.js** and **Express**. 

Currently, the application functions using client-side polling to fetch messages. My next goal is to refactor this logic to use **Socket.io** for true bi-directional, real-time communication.

## 🚧 Status: Work in Progress
This project is currently in the development phase. The basic messaging loop works, but I am actively working on optimizing the backend logic.

## 🛠️ Technologies
* **Backend:** Node.js, Express
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Planned Upgrades:** Socket.io (for WebSockets integration)

## 📦 How to Run

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Paklicecek/Cordel.git](https://github.com/Paklicecek/Cordel.git)
    ```
2.  **Install dependencies**
    ```bash
    cd Cordel
    npm install
    ```
3.  **Start the server**
    ```bash
    npm start
    ```
    *(Note: Ensure you have created a `.env` file with `PORT=3000` or similar)*

4.  **Open in Browser**
    Visit `http://localhost:3000`

## 📝 Learning Goals
* Building RESTful APIs (`/api/send`, `/api/load`).
* Understanding client-server data flow.
* Moving from polling (setInterval) to WebSockets.
