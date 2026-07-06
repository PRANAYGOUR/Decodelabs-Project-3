<div align="center">

# 🗄️ Project 3: Database & API Integration
**Persistent Memory and Data Management**

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](#)
[![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](#)

*Connecting the server to a persistent database to create an accessible vault.*

</div>

---

## 🌟 Overview

Welcome to **Project 3**! Building upon the backend foundations, this 
project introduces **Database Management**. A server without memory is just 
a router; by integrating an **SQLite** database, we empower our Node.js 
backend to store, retrieve, update, and delete information dynamically.

This project creates the isolated APIs required for a true "Cognitive Vault".

---

## ✨ Key Features

- **💾 SQLite Integration**: A lightweight, disk-based database that doesn't 
  require a separate server process.
- **🔄 CRUD Operations**: Full capability to Create, Read, Update, and Delete 
  records via the server logic.
- **🧩 Modular Architecture**: Separation of concerns by splitting database 
  logic (`database.js`) from server configuration (`server.js`).
- **🔗 API Readiness**: Endpoints structured to deliver JSON data, preparing 
  for eventual frontend integration.

---

## 📂 Project Structure

```text
📁 Project_3
├── 📄 server.js             # API Routes & Server Config
├── 📄 database.js           # SQLite Connection & Logic
├── 🗃️ users.db              # The SQLite Database File
├── 📄 package.json          # Dependency Manifest
└── 📄 README.md             # Project Documentation
```

---

## 🛠️ Installation & Setup

### 1. Install Dependencies
Navigate into the project directory and install the required packages:
```bash
npm install
```

### 2. Start the Server
Boot up the Node server to initialize the API and connect to the database:
```bash
node server.js
```

<br>

<div align="center">
  <b>Made with ❤️ for DecodeLabs</b>
</div>
