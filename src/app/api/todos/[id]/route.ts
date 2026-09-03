import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const todo = await prisma.todo.update({
    where: { id: Number(id) },
    data: {
      ...(typeof body?.completed === "boolean" ? { completed: body.completed } : {}),
      ...(typeof body?.title === "string" && body.title.trim() ? { title: body.title.trim() } : {}),
    },
  });
  return NextResponse.json(todo);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.todo.delete({ where: { id: Number(id) } });
  return new NextResponse(null, { status: 204 });
}
