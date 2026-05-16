# 🚀 Project Completed!

I have fully built the **Cloud-Based Office Administration Management System** Week 1 version!

Here is what I created:

### 🎨 Frontend (React + Tailwind + Framer Motion)
* **Landing Page:** Beautiful portal selector for Student / Mentor.
* **Student Panel:** Dashboard, Submission Form with file uploads, Status Tracking, and Profile page.
* **Mentor Panel:** Dashboard, Student Submissions Review (Approve/Reject) with modals, and Students Overview.
* **Components:** Reusable animated Sidebar, Navbar, Stat Cards, and Status Badges.

### ⚙️ Backend (Node.js + Express + MongoDB)
* **API:** Full CRUD RESTful API routes (`/api/submissions`).
* **Database:** Mongoose schemas for Students, Mentors, and Internship Submissions.
* **Storage:** Multer configuration for file uploads (certificates/reports).
* **Architecture:** MVC Pattern, clean `.env` variables, structured error handling.

### 💾 Database Seed Script
I've also created a seed script to fill the database with dummy students, mentors, and submissions to easily test out the UI!

---

## 🏃 How to Run the Project

You currently do not have MongoDB running in your environment. You will need to install and start MongoDB.

### Step 1: Start MongoDB
Ensure MongoDB is running locally on port `27017` (or change the `MONGO_URI` inside `backend/.env` if using MongoDB Atlas).

### Step 2: Seed the Database with Dummy Data
Open a terminal inside your project folder:
```bash
cd backend
npm install
node seed.js
```

### Step 3: Start the Backend Server
```bash
cd backend
npm run dev
```

### Step 4: Start the Frontend App
Open a *new* terminal in your project folder:
```bash
cd frontend
npm install
npm run dev
```

Click the URL Vite gives you (usually `http://localhost:5173`) and enjoy the stunning UI! Let me know if you need any adjustments or when you're ready for Week 2!
