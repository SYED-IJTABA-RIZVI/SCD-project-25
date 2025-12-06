
# 🗄️ NodeVault – Secure CLI Based Record Vault

NodeVault is a **Node.js CLI application** that stores key-value records using **MongoDB** as backend.  
It supports **CRUD**, **search**, **sorting**, **export**, **statistics**, and is fully containerized using **Docker** & **Docker Compose**.

---

## 🚀 Features

| Feature | Description |
|--------|-------------|
| Add / View / Update / Delete Records | Complete CRUD support |
| Search | Lookup records by ID, name, or value |
| Sorting | Sort by Name / Value / ID (ASC/DESC) |
| Export | Export all records to `export.txt` |
| Statistics | Shows summary + insights |
| MongoDB | Persistent database-supported storage |
| Docker | Deployable as container |
| Docker Compose | Multi-container (App + DB) deployment |

---

## 🛠 Tech Stack

- Node.js
- MongoDB + Mongoose
- Docker & Docker Compose

---

Create `.env`:

```
MONGO_URI=mongodb://localhost:27017/nodevault
USE_MONGO=true
```

Run the app:

```bash
node main.js
```

---

## 🐳 Docker Deployment (Part-4)

### Build Docker image

```bash
docker build -t nodevault .
```

### Create network

```bash
docker network create vault-net
```

### Start MongoDB

```bash
docker run -d --name mongodb --network vault-net  -v mongo_data:/data/db  -e MONGO_INITDB_ROOT_USERNAME=root  -e MONGO_INITDB_ROOT_PASSWORD=pass123  mongo:4.4
```

### Start NodeVault

```bash
docker run -it --name nodevault --network vault-net  --env-file .env -p 3000:3000 nodevault
```

---

## 🐳 Docker Compose Deployment (Part-6)

```bash
docker compose up -d --build
```

View status:

```bash
docker compose ps
```

Attach to container:

```bash
docker attach nodevault
```

Stop containers:

```bash
docker compose down
```

---

## 📌 CLI Usage

```
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Record
6. Sort Records
7. Export Records
8. View Statistics
9. Exit
=====================
```

Example:

```
Choose option: 1
Enter name: Ali
Enter value: 100
```

---

## 🧪 MongoDB Data Verification

```bash
docker exec -it mongodb mongo -u root -p pass123
 
    use nodevault
    db.records.find()
```


## Author

**Syed Muhammad Ijtaba Rizvi 23i-0112 SE-B**  
Feel free to enhance & experiment 🚀
