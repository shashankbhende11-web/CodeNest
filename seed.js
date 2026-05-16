// =============================================================
// SEED DATABASE
// Run this script to populate MongoDB with dummy data for Week 1
// Usage: node backend/seed.js
// =============================================================

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load models
const Student = require("./models/Student");
const Mentor = require("./models/Mentor");
const InternshipSubmission = require("./models/InternshipSubmission");

// Load env vars
dotenv.config({ path: path.join(__dirname, ".env") });

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for Seeding");

    // Clear existing data
    await Student.deleteMany();
    await Mentor.deleteMany();
    await InternshipSubmission.deleteMany();
    console.log("🧹 Cleared existing data");

    // Create Mentors
    const mentor1 = await Mentor.create({
      name: "Dr. Priya Nair",
      employeeId: "EMP001",
      email: "priya.nair@college.edu",
      department: "CSE",
      designation: "Associate Professor",
      role: "mentor"
    });

    const mentor2 = await Mentor.create({
      name: "Prof. Rahul Verma",
      employeeId: "EMP002",
      email: "rahul.verma@college.edu",
      department: "ECE",
      designation: "Assistant Professor",
      role: "mentor"
    });
    console.log("👨‍🏫 Mentors created");

    // Create Students
    const student1 = await Student.create({
      name: "Arjun Sharma",
      rollNumber: "21CS001",
      email: "arjun.sharma@college.edu",
      department: "CSE",
      year: 3,
      mentor: mentor1._id
    });

    const student2 = await Student.create({
      name: "Neha Gupta",
      rollNumber: "21EC015",
      email: "neha.gupta@college.edu",
      department: "ECE",
      year: 3,
      mentor: mentor2._id
    });
    console.log("🎓 Students created");

    // Create Submissions
    await InternshipSubmission.create([
      {
        studentName: student1.name,
        rollNumber: student1.rollNumber,
        department: student1.department,
        companyName: "Google India",
        internshipDuration: "8 Weeks",
        startDate: new Date("2024-05-15"),
        endDate: new Date("2024-07-15"),
        mentorName: mentor1.name,
        mentor: mentor1._id,
        student: student1._id,
        status: "Approved",
        reviewComments: "Excellent internship choice. Keep up the good work.",
        reviewedAt: new Date()
      },
      {
        studentName: student1.name,
        rollNumber: student1.rollNumber,
        department: student1.department,
        companyName: "Microsoft",
        internshipDuration: "4 Weeks",
        startDate: new Date("2023-12-01"),
        endDate: new Date("2023-12-31"),
        mentorName: mentor1.name,
        mentor: mentor1._id,
        student: student1._id,
        status: "Pending"
      },
      {
        studentName: student2.name,
        rollNumber: student2.rollNumber,
        department: student2.department,
        companyName: "Intel",
        internshipDuration: "6 Weeks",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-07-15"),
        mentorName: mentor2.name,
        mentor: mentor2._id,
        student: student2._id,
        status: "Under Review"
      }
    ]);
    console.log("📄 Submissions created");

    console.log("🎉 Database Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
