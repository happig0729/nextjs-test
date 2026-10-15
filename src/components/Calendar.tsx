"use client";

import { useState } from "react";
import { toDateKey } from "@/lib/date";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

type CalendarTodo = {
  id: number;
  completed: boolean;
  dueDate: string | null;
};

type Props = {
  todos: CalendarTodo[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
};

export default function Calendar({ todos, selectedDate, onSelectDate }: Props) {
  const today = new Date();
  const todayKey = toDateKey(today)!;
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  function shiftMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  const stats = new Map<string, { total: number; done: number }>();
  let unscheduled = 0;
  for (const todo of todos) {
    const key = toDateKey(todo.dueDate);
    if (!key) {
      unscheduled += 1;
      continue;
    }
    const entry = stats.get(key) ?? { total: 0, done: 0 };
    entry.total += 1;
    if (todo.completed) entry.done += 1;
    stats.set(key, entry);
  }

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <section
      aria-label="日历"
      className="mt-8 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <header className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="上个月"
          className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          ‹
        </button>
        <h2 className="font-medium">
          {viewYear} 年 {viewMonth + 1} 月
        </h2>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="下个月"
          className="rounded-lg px-2 py-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          ›
        </button>
      </header>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} />;
          const key = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const stat = stats.get(key);
          const isToday = key === todayKey;
          const isSelected = key === selectedDate;
          const allDone = stat !== undefined && stat.done === stat.total;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(isSelected ? null : key)}
              aria-pressed={isSelected}
              className={`flex h-11 flex-col items-center justify-center gap-0.5 rounded-lg text-sm ${
                isSelected
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : isToday
                    ? "border border-zinc-900 dark:border-zinc-100"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <span>{day}</span>
              {stat && (
                <span className="flex gap-0.5" aria-hidden>
                  {allDone ? (
                    <span className="h-1 w-1 rounded-full bg-green-500" />
                  ) : (
                    <>
                      <span className="h-1 w-1 rounded-full bg-amber-500" />
                      {stat.total > 1 && (
                        <span className="h-1 w-1 rounded-full bg-amber-500/40" />
                      )}
                    </>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <footer className="mt-3 flex items-center justify-between text-xs text-zinc-500">
        <span>
          {stats.size > 0 ? `${stats.size} 天有安排` : "还没有带日期的待办"}
          {unscheduled > 0 && `，${unscheduled} 项未排期`}
        </span>
        {selectedDate && (
          <button
            type="button"
            onClick={() => onSelectDate(null)}
            className="rounded px-2 py-1 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            查看全部
          </button>
        )}
      </footer>
    </section>
  );
}
