import React, { useState } from "react";
import { Plus, Trash2, Calendar, Check } from "lucide-react";
import { PRIORITIES, TASK_STATUSES, TASK_STATUS_META, PRIORITY_META } from "@/lib/crmConfig";
import { createTask, updateTask, deleteTask } from "@/lib/crmStore";
import EnginePlaceholder from "@/components/opportunity/EnginePlaceholder";

function MiniForm({ recordId, onDone }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  const submit = () => {
    if (!title.trim()) return;
    createTask({ crmRecordId: recordId, title: title.trim(), dueDate, priority });
    setTitle(""); setDueDate(""); setPriority("medium");
    onDone();
  };

  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-3 space-y-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-400 bg-white dark:bg-slate-900"
        autoFocus
      />
      <div className="flex items-center gap-2">
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-400 bg-white dark:bg-slate-900" />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-400 bg-white dark:bg-slate-900 capitalize">
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <button onClick={submit} className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-200">
          <Check className="w-3.5 h-3.5" /> Add
        </button>
      </div>
    </div>
  );
}

export default function CRMTaskPanel({ recordId, tasks, onChanged }) {
  const [adding, setAdding] = useState(false);

  if (!recordId) {
    return <EnginePlaceholder message="Tasks will appear here once the CRM record is saved." />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-400 dark:text-slate-500">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</p>
        {!adding && (
          <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        )}
      </div>

      {adding && <MiniForm recordId={recordId} onDone={() => { setAdding(false); onChanged(); }} />}

      {tasks.length === 0 && !adding ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">No tasks yet. Create one to track follow-ups and actions.</p>
      ) : (
        <div className="space-y-1.5">
          {tasks.map((task) => {
            const statusMeta = TASK_STATUS_META[task.status] || TASK_STATUS_META["Pending"];
            const prioMeta = PRIORITY_META[task.priority] || PRIORITY_META.medium;
            const done = task.status === "Completed";
            const overdue = task.dueDate && !done && new Date(task.dueDate) < new Date(new Date().toDateString());
            return (
              <div key={task.id} className="flex items-center gap-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5">
                <button
                  onClick={() => { updateTask(task.id, { status: done ? "Pending" : "Completed" }); onChanged(); }}
                  aria-label={done ? "Mark task as pending" : "Mark task as completed"}
                  className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${done ? "bg-emerald-500 border-emerald-500" : "border-slate-300 dark:border-slate-600 hover:border-slate-400"}`}
                >
                  {done && <Check className="w-3 h-3 text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${done ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-700 dark:text-slate-300"}`}>{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`inline-flex items-center gap-0.5 text-[10px] ${overdue ? "text-rose-500 dark:text-rose-400" : "text-slate-400 dark:text-slate-500"}`}>
                      {task.dueDate && <><Calendar className="w-2.5 h-2.5" /> {new Date(task.dueDate).toLocaleDateString()}</>}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${prioMeta.cls} capitalize`}>{task.priority}</span>
                  </div>
                </div>
                <select
                  value={task.status}
                  onChange={(e) => { updateTask(task.id, { status: e.target.value }); onChanged(); }}
                  className={`text-[10px] px-1.5 py-1 rounded border border-slate-100 dark:border-slate-800 focus:outline-none ${statusMeta.text} bg-slate-50 dark:bg-slate-800`}
                >
                  {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => { deleteTask(task.id); onChanged(); }} aria-label="Delete task" className="text-slate-300 dark:text-slate-600 hover:text-rose-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}