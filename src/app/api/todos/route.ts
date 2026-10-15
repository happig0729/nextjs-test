import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseDateOnly } from "@/lib/date";

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  let dueDate: Date | null = null;
  if (body?.dueDate !== undefined && body?.dueDate !== null) {
    dueDate = typeof body.dueDate === "string" ? parseDateOnly(body.dueDate) : null;
    if (!dueDate) {
      return NextResponse.json(
        { error: "dueDate must be a date in YYYY-MM-DD format" },
        { status: 400 },
      );
    }
  }

  const todo = await prisma.todo.create({
    data: dueDate ? { title, dueDate } : { title },
  });
  return NextResponse.json(todo, { status: 201 });
}
