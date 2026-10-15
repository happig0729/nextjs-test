import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseDateOnly } from "@/lib/date";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  let dueDate: Date | null | undefined;
  if (body?.dueDate !== undefined) {
    if (body.dueDate === null) {
      dueDate = null;
    } else {
      dueDate = typeof body.dueDate === "string" ? parseDateOnly(body.dueDate) : null;
      if (!dueDate) {
        return NextResponse.json(
          { error: "dueDate must be a date in YYYY-MM-DD format" },
          { status: 400 },
        );
      }
    }
  }

  const todo = await prisma.todo.update({
    where: { id: Number(id) },
    data: {
      ...(typeof body?.completed === "boolean" ? { completed: body.completed } : {}),
      ...(typeof body?.title === "string" && body.title.trim() ? { title: body.title.trim() } : {}),
      ...(dueDate !== undefined ? { dueDate } : {}),
    },
  });
  return NextResponse.json(todo);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.todo.delete({ where: { id: Number(id) } });
  return new NextResponse(null, { status: 204 });
}
