"use client";

import { useCallback, useEffect, useState } from "react";
import Calendar from "@/components/Calendar";
import { toDateKey } from "@/lib/date";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
};

const WEEKDAYS_FULL = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function formatDateLabel(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00Z`);
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const weekday = WEEKDAYS_FULL[date.getUTCDay()];
  return `${month} 月 ${day} 日 ${weekday}`;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [newTodoDate, setNewTodoDate] = useState(() => toDateKey(new Date())!);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
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

  function selectDate(date: string | null) {
    setSelectedDate(date);
    if (date) setNewTodoDate(date);
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, dueDate: newTodoDate || null }),
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

  async function rescheduleTodo(todo: Todo, dueDate: string | null) {
    if (dueDate === toDateKey(todo.dueDate)) return;
    await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dueDate }),
    });
    fetchTodos();
  }

  async function removeTodo(id: number) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const visibleTodos = selectedDate
    ? todos.filter((t) => toDateKey(t.dueDate) === selectedDate)
    : todos;
  const remaining = visibleTodos.filter((t) => !t.completed).length;

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Todo Demo</h1>
      <p className="mt-2 text-zinc-500">
        Next.js App Router + Route Handlers + Prisma + SQLite
      </p>

      <Calendar
        todos={todos}
        selectedDate={selectedDate}
        onSelectDate={selectDate}
      />

      <form onSubmit={addTodo} className="mt-6 flex flex-wrap gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="添加一个待办事项…"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-4 py-2 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
        />
        <input
          type="date"
          value={newTodoDate}
          onChange={(e) => setNewTodoDate(e.target.value)}
          aria-label="待办日期"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-600 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:border-zinc-100"
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

      {selectedDate && (
        <h3 className="mt-8 text-sm font-medium text-zinc-500">
          {formatDateLabel(selectedDate)} 的待办
        </h3>
      )}

      {loading ? (
        <p className="mt-8 text-zinc-500">加载中…</p>
      ) : visibleTodos.length === 0 ? (
        <p className="mt-8 text-zinc-500">
          {selectedDate ? "这一天还没有待办事项。" : "还没有待办事项，添加一个试试。"}
        </p>
      ) : (
        <ul className="mt-8 space-y-2">
          {visibleTodos.map((todo) => {
            const dueKey = toDateKey(todo.dueDate);
            return (
              <li
                key={todo.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800"
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
                <input
                  type="date"
                  value={dueKey ?? ""}
                  onChange={(e) => rescheduleTodo(todo, e.target.value || null)}
                  aria-label="修改日期"
                  className="rounded border border-zinc-200 bg-transparent px-1 py-0.5 text-xs text-zinc-500 dark:border-zinc-700"
                />
                <button
                  onClick={() => removeTodo(todo.id)}
                  className="text-sm text-zinc-400 hover:text-red-500"
                >
                  删除
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {visibleTodos.length > 0 && (
        <p className="mt-6 text-sm text-zinc-500">
          {selectedDate ? "当日" : "总共"} {visibleTodos.length} 项，剩余 {remaining} 项未完成
        </p>
      )}
    </main>
  );
}
