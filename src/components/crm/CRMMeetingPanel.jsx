import React, { useState } from "react";
import { Plus, Trash2, Calendar, Users, Clock } from "lucide-react";
import { createMeeting, deleteMeeting } from "@/lib/crmStore";
import EnginePlaceholder from "@/components/opportunity/EnginePlaceholder";

function MeetingForm({ recordId, onDone }) {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [participants, setParticipants] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    createMeeting({ crmRecordId: recordId, title: title.trim(), dateTime, participants });
    setTitle(""); setDateTime(""); setParticipants("");
    onDone();
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 space-y-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Meeting title..." className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-400 bg-white" autoFocus />
      <div className="flex items-center gap-2">
        <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-400 bg-white" />
        <input value={participants} onChange={(e) => setParticipants(e.target.value)} placeholder="Participants..." className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-blue-400 bg-white" />
      </div>
      <button onClick={submit} className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800">
        Schedule Meeting
      </button>
      <p className="text-[10px] text-slate-400 text-center">Calendar integration (Google, Outlook) will be available when the Replit backend connects these services.</p>
    </div>
  );
}

export default function CRMMeetingPanel({ recordId, meetings, onChanged }) {
  const [adding, setAdding] = useState(false);

  if (!recordId) {
    return <EnginePlaceholder message="Meetings will appear here once the CRM record is saved." />;
  }

  const upcoming = meetings.filter((m) => m.dateTime && new Date(m.dateTime) >= new Date());
  const past = meetings.filter((m) => !m.dateTime || new Date(m.dateTime) < new Date());

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-400">{upcoming.length} upcoming · {past.length} past</p>
        {!adding && (
          <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:border-slate-300 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Schedule
          </button>
        )}
      </div>

      {adding && <MeetingForm recordId={recordId} onDone={() => { setAdding(false); onChanged(); }} />}

      {meetings.length === 0 && !adding ? (
        <p className="text-xs text-slate-400 text-center py-6">No meetings scheduled yet.</p>
      ) : (
        <div className="space-y-1.5">
          {meetings.map((m) => {
            const isPast = !m.dateTime || new Date(m.dateTime) < new Date();
            return (
              <div key={m.id} className="rounded-xl border border-slate-100 bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700">{m.title}</p>
                    {m.dateTime && (
                      <div className={`flex items-center gap-1 mt-0.5 text-[11px] ${isPast ? "text-slate-400" : "text-blue-500"}`}>
                        <Calendar className="w-3 h-3" /> {new Date(m.dateTime).toLocaleString()}
                      </div>
                    )}
                    {m.participants && (
                      <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-400">
                        <Users className="w-3 h-3" /> {m.participants}
                      </div>
                    )}
                  </div>
                  <button onClick={() => { deleteMeeting(m.id); onChanged(); }} className="text-slate-300 hover:text-rose-400 transition-colors shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {m.prepNotes && <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-50">Prep: {m.prepNotes}</p>}
                {m.outcomeNotes && <p className="text-[11px] text-emerald-600 mt-1">Outcome: {m.outcomeNotes}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}