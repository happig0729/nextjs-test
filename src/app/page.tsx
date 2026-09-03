"use client";

import { useCallback, useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTodos(await res.json());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      setTitle("");
      fetchTodos();
    }
  }

  async function toggleTodo(todo: Todo) {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    fetchTodos();
  }

  async function removeTodo(id: number) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Todo Demo</h1>
      <p className="mt-2 text-zinc-500">
        Next.js App Router + Route Handlers + Prisma + SQLite
      </p>

      <form onSubmit={addTodo} className="mt-8 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="添加一个待办事项…"
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-5 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          添加
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-zinc-500">加载中…</p>
      ) : todos.length === 0 ? (
        <p className="mt-8 text-zinc-500">还没有待办事项，添加一个试试。</p>
      ) : (
        <ul className="mt-8 space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
                className="h-4 w-4 accent-zinc-900 dark:accent-zinc-100"
              />
              <span
                className={`flex-1 ${
                  todo.completed ? "text-zinc-400 line-through" : ""
                }`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                className="text-sm text-zinc-400 hover:text-red-500"
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <p className="mt-6 text-sm text-zinc-500">
          共 {todos.length} 项，剩余 {remaining} 项未完成
        </p>
      )}
    </main>
  );
}
