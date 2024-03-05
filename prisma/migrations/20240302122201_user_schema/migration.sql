-- CreateTable
CREATE TABLE "_Student" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Student_AB_unique" ON "_Student"("A", "B");

-- CreateIndex
CREATE INDEX "_Student_B_index" ON "_Student"("B");

-- AddForeignKey
ALTER TABLE "_Student" ADD CONSTRAINT "_Student_A_fkey" FOREIGN KEY ("A") REFERENCES "Classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Student" ADD CONSTRAINT "_Student_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
