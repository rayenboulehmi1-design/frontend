import React, { useState } from "react";
import { Plus, Trash2, Send } from "lucide-react";
import { createNote, deleteNote } from "@/lib/crmStore";
import EnginePlaceholder from "@/components/opportunity/EnginePlaceholder";

export default function CRMNotesPanel({ recordId, notes, onChanged }) {
  const [content, setContent] = useState("");

  if (!recordId) {
    return <EnginePlaceholder message="Notes will appear here once the CRM record is saved." />;
  }

  const submit = () => {
    if (!content.trim()) return;
    createNote({ crmRecordId: recordId, content: content.trim() });
    setContent("");
    onChanged();
  };

  return (
    <div>
      <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-3 mb-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note to this record..."
          className="w-full min-h-[60px] px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-400 bg-white dark:bg-slate-900 resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">Notes are stored locally in the frontend phase. Secure server-side storage is pending Replit backend activation.</p>
          <button onClick={submit} disabled={!content.trim()} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed">
            <Send className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">No notes yet.</p>
      ) : (
        <div className="space-y-1.5">
          {notes.map((note) => (
            <div key={note.id} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap flex-1">{note.content}</p>
                <button onClick={() => { deleteNote(note.id); onChanged(); }} aria-label="Delete note" className="text-slate-300 dark:text-slate-600 hover:text-rose-400 transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-1.5">{new Date(note.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}