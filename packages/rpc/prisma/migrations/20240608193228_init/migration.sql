-- CreateTable
CREATE TABLE "TodoProject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TodoGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "todoProjectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "TodoGroup_todoProjectId_fkey" FOREIGN KEY ("todoProjectId") REFERENCES "TodoProject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TodoItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "todoGroupId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL,
    CONSTRAINT "TodoItem_todoGroupId_fkey" FOREIGN KEY ("todoGroupId") REFERENCES "TodoGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
