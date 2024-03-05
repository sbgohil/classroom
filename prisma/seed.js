import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const existingUsers = await prisma.users.findMany();
  if (existingUsers.length === 0) {
    // Seed users
    const hashedPasswordAdmin = await bcrypt.hash("Admin@123", 10);
    const adminUser = await prisma.users.create({
      data: {
        email: "admin@example.com",
        firstName: "Admin",
        lastName: "User",
        password: hashedPasswordAdmin,
        role: "ADMIN",
      },
    });

    const hashedPasswordTeacher1 = await bcrypt.hash("Teacher1@123", 10);
    const teacherUser1 = await prisma.users.create({
      data: {
        email: "teacher1@example.com",
        firstName: "Teacher",
        lastName: "1",
        password: hashedPasswordTeacher1,
        role: "TEACHER",
      },
    });

    const hashedPasswordTeacher2 = await bcrypt.hash("Teacher2@123", 10);
    const teacherUser2 = await prisma.users.create({
      data: {
        email: "teacher2@example.com",
        firstName: "Teacher",
        lastName: "2",
        password: hashedPasswordTeacher2,
        role: "TEACHER",
      },
    });

    const hashedPasswordStudent1 = await bcrypt.hash("Student1@123", 10);
    const studentUser1 = await prisma.users.create({
      data: {
        email: "student1@example.com",
        firstName: "Student",
        lastName: "1",
        password: hashedPasswordStudent1,
        role: "STUDENT",
      },
    });

    const hashedPasswordStudent2 = await bcrypt.hash("Student2@123", 10);
    const studentUser2 = await prisma.users.create({
      data: {
        email: "student2@example.com",
        firstName: "Student",
        lastName: "2",
        password: hashedPasswordStudent2,
        role: "STUDENT",
      },
    });

    // Seed classrooms
    const classroom1 = await prisma.classrooms.create({
      data: {
        name: "Mathematics",
        teacherId: teacherUser1.id,
      },
    });

    const classroom2 = await prisma.classrooms.create({
      data: {
        name: "Physics",
        teacherId: teacherUser2.id,
      },
    });

    // Seed assignments
    const assignmentsData = [];
    for (let i = 0; i < 5; i++) {
      const assignment1 = await prisma.assignments.create({
        data: {
          title: `Assignment ${i + 1} for Mathematics`,
          description: `Complete exercises ${i * 10 + 1}-${(i + 1) * 10}`,
          dueDate: new Date("2024-04-01"),
          totalScore: 100,
          teacherId: teacherUser1.id,
          classroomId: classroom1.id,
        },
      });
      const assignment2 = await prisma.assignments.create({
        data: {
          title: `Assignment ${i + 1} for Physics`,
          description: `Complete exercises ${i * 10 + 1}-${(i + 1) * 10}`,
          dueDate: new Date("2024-04-01"),
          totalScore: 100,
          teacherId: teacherUser2.id,
          classroomId: classroom2.id,
        },
      });
      assignmentsData.push({ assignment1, assignment2 });
    }

    // Seed submissions
    for (const { assignment1, assignment2 } of assignmentsData) {
      const submission1 = await prisma.studentAssignmentSubmissions.create({
        data: {
          studentId: studentUser1.id,
          assignmentId: assignment1.id,
          submissionUrl: "https://example.com/submission",
          score: 50,
        },
      });
      const submission2 = await prisma.studentAssignmentSubmissions.create({
        data: {
          studentId: studentUser2.id,
          assignmentId: assignment1.id,
          submissionUrl: "https://example.com/submission",
          score: 50,
        },
      });
      const submission3 = await prisma.studentAssignmentSubmissions.create({
        data: {
          studentId: studentUser1.id,
          assignmentId: assignment2.id,
          submissionUrl: "https://example.com/submission",
          score: 50,
        },
      });
      const submission4 = await prisma.studentAssignmentSubmissions.create({
        data: {
          studentId: studentUser2.id,
          assignmentId: assignment2.id,
          submissionUrl: "https://example.com/submission",
          score: 50,
        },
      });
    }

    console.log("Seed data created successfully!");
  } else {
    console.log("Data already exists. Skipping seeding process.");
  }
}

main()
  .catch((error) => {
    console.error("Error seeding data:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
