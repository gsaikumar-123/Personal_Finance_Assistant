# Personal Finance Assistant

The Personal Finance Assistant is a full-stack web application that helps users manage income and expenses, categorize transactions, and gain insights into their financial activities. It also supports receipt uploads and automatic data extraction using AI.

## Tech Stack

### Frontend
- React 18 (with Hooks & Vite)
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for Authentication
- Multer for file uploads

---

[Click here to watch the demo](https://youtu.be/CVLi5-oYRP8)

## How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/gsaikumar-123/Personal_Finance_Assistant.git
cd Personal_Finance_Assistant
````

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit the `.env` file with your config:

```
PORT=1234
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key (optional)
```

Run the backend:

```bash
npm run dev
```

> Server will run at: `http://localhost:1234`

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Update `.env` if needed:

```
VITE_API_URL=http://localhost:1234
```
---

### 4. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## API Endpoints

### Authentication

* `POST /api/auth/signup` – Register a new user
* `POST /api/auth/login` – Log in and receive a token
* `GET /api/auth/profile` – Get the logged-in user profile

### Transactions

* `GET /api/transactions` – Fetch all user transactions
* `POST /api/transactions` – Create a new transaction
* `PUT /api/transactions/:id` – Update a specific transaction
* `DELETE /api/transactions/:id` – Delete a transaction

### Receipt Extraction

* `POST /api/extract-receipt` – Upload a receipt to extract transaction data
