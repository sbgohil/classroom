import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const existingUsers = await prisma.users.findMany();
  if (existingUsers.length === 0) {
    // Seed users
    const hashedPassword1 = await bcrypt.hash("Teacher1@123", 10);
    const user1 = await prisma.Users.create({
      data: {
        email: "teacher1@gmail.com",
        firstName: "Teacher",
        lastName: "1",
        password: hashedPassword1,
        role: "TEACHER",
      },
    });

    const hashedPassword2 = await bcrypt.hash("Student1@123", 10);
    const user2 = await prisma.Users.create({
      data: {
        email: "student1@gmail.com",
        firstName: "Student",
        lastName: "1",
        password: hashedPassword2,
        role: "STUDENT",
      },
    });

    // Seed classrooms
    const classroom1 = await prisma.Classrooms.create({
      data: {
        name: "Mathematics",
        teacherId: user1.id,
      },
    });

    // Seed assignments
    const assignment1 = await prisma.Assignments.create({
      data: {
        title: "Algebra Assignments",
        description: "Complete exercises 1-10",
        dueDate: new Date("2024-04-01"),
        totalScore: 100,
        teacherId: user1.id,
        classroomId: classroom1.id,
      },
    });

    // Seed submissions
    const submission1 = await prisma.StudentAssignmentSubmissions.create({
      data: {
        studentId: user2.id,
        assignmentId: assignment1.id,
        submissionUrl: "https://example.com/submission",
        score: 50,
      },
    });

    console.log("Seed data created successfully!");
  } else {
    console.log("Data already exists. Skipping seeding process.");
  }
}

main()
  .catch((error) => {
    console.log("Error seeding data:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
