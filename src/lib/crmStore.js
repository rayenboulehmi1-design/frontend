/**
 * CRM local store — Base44 frontend phase.
 *
 * Records, tasks, meetings, notes, and activities are persisted to localStorage
 * so the frontend experience is fully functional. This is NOT the production
 * source of truth. The Replit backend will own secure persistence, cross-device
 * sync, workspace authorization, and audit logging.
 *
 * No data is fabricated — all records are created by the user through real
 * actions (Add to CRM, create task, etc.).
 */

const KEYS = {
  records: "pipeline",
  tasks: "tasks",
  meetings: "meetings",
  notes: "notes",
  activities: "activities",
};

function isDemoRoute() {
  return typeof window !== "undefined" && window.location.pathname.startsWith("/demo");
}

function fullKey(shortKey) {
  return (isDemoRoute() ? "scouty_demo_crm_" : "scouty_crm_") + shortKey;
}

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(fullKey(key)) || "[]");
  } catch {
    return [];
  }
}

function write(key, data) {
  localStorage.setItem(fullKey(key), JSON.stringify(data));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ─── Records ───

export function getRecords() {
  return read(KEYS.records);
}

export function getRecord(id) {
  return read(KEYS.records).find((r) => r.id === id) || null;
}

export function createRecord(data) {
  const records = read(KEYS.records);
  const now = new Date().toISOString();
  const record = {
    id: uid(),
    signalId: data.signalId || null,
    title: data.title || "Untitled Record",
    category: data.category || "",
    location: data.location || "",
    entity_name: data.entity_name || "",
    confidence: data.confidence || null,
    stage: data.stage || "Discovered",
    priority: data.priority || "medium",
    owner: data.owner || "",
    nextAction: data.nextAction || "",
    nextActionDate: data.nextActionDate || "",
    note: data.note || "",
    companyId: data.companyId || null,
    companyName: data.companyName || "",
    personId: data.personId || null,
    personName: data.personName || "",
    leadId: data.leadId || null,
    missionId: data.missionId || null,
    intelligenceStatus: data.intelligenceStatus || "monitoring",
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
  };
  write(KEYS.records, [record, ...records]);
  addActivity({
    crmRecordId: record.id,
    type: "CRM Record Created",
    description: `CRM record "${record.title}" created at stage ${record.stage}.`,
  });
  return record;
}

export function updateRecord(id, patch) {
  const records = read(KEYS.records);
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  records[idx] = { ...records[idx], ...patch, updatedAt: new Date().toISOString(), lastActivityAt: new Date().toISOString() };
  write(KEYS.records, records);
  return records[idx];
}

export function changeStage(id, newStage) {
  const record = getRecord(id);
  if (!record || record.stage === newStage) return record;
  const updated = updateRecord(id, { stage: newStage });
  addActivity({
    crmRecordId: id,
    type: "Stage Changed",
    description: `Stage changed from ${record.stage} to ${newStage}.`,
    metadata: { from: record.stage, to: newStage },
  });
  if (newStage === "Won") addActivity({ crmRecordId: id, type: "Record Won", description: "Record marked as Won." });
  if (newStage === "Lost") addActivity({ crmRecordId: id, type: "Record Lost", description: "Record marked as Lost." });
  return updated;
}

export function deleteRecord(id) {
  write(KEYS.records, read(KEYS.records).filter((r) => r.id !== id));
  write(KEYS.tasks, read(KEYS.tasks).filter((t) => t.crmRecordId !== id));
  write(KEYS.meetings, read(KEYS.meetings).filter((m) => m.crmRecordId !== id));
  write(KEYS.notes, read(KEYS.notes).filter((n) => n.crmRecordId !== id));
  write(KEYS.activities, read(KEYS.activities).filter((a) => a.crmRecordId !== id));
}

// ─── Tasks ───

export function getTasks(recordId) {
  return read(KEYS.tasks).filter((t) => t.crmRecordId === recordId).sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
}

export function createTask(data) {
  const tasks = read(KEYS.tasks);
  const task = {
    id: uid(),
    crmRecordId: data.crmRecordId,
    title: data.title || "",
    description: data.description || "",
    dueDate: data.dueDate || "",
    priority: data.priority || "medium",
    status: data.status || "Pending",
    assignedTo: data.assignedTo || "",
    companyId: data.companyId || null,
    personId: data.personId || null,
    createdAt: new Date().toISOString(),
  };
  write(KEYS.tasks, [task, ...tasks]);
  addActivity({ crmRecordId: task.crmRecordId, type: "Task Created", description: `Task "${task.title}" created.` });
  return task;
}

export function updateTask(id, patch) {
  const tasks = read(KEYS.tasks);
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...patch };
  write(KEYS.tasks, tasks);
  if (patch.status === "Completed") {
    addActivity({ crmRecordId: tasks[idx].crmRecordId, type: "Task Completed", description: `Task "${tasks[idx].title}" completed.` });
  }
  return tasks[idx];
}

export function deleteTask(id) {
  write(KEYS.tasks, read(KEYS.tasks).filter((t) => t.id !== id));
}

// ─── Meetings ───

export function getMeetings(recordId) {
  return read(KEYS.meetings).filter((m) => m.crmRecordId === recordId).sort((a, b) => (b.dateTime || "").localeCompare(a.dateTime || ""));
}

export function createMeeting(data) {
  const meetings = read(KEYS.meetings);
  const meeting = {
    id: uid(),
    crmRecordId: data.crmRecordId,
    title: data.title || "",
    dateTime: data.dateTime || "",
    participants: data.participants || "",
    companyId: data.companyId || null,
    personId: data.personId || null,
    prepNotes: data.prepNotes || "",
    outcomeNotes: data.outcomeNotes || "",
    nextAction: data.nextAction || "",
    createdAt: new Date().toISOString(),
  };
  write(KEYS.meetings, [meeting, ...meetings]);
  addActivity({ crmRecordId: meeting.crmRecordId, type: "Meeting Scheduled", description: `Meeting "${meeting.title}" scheduled.` });
  return meeting;
}

export function updateMeeting(id, patch) {
  const meetings = read(KEYS.meetings);
  const idx = meetings.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  meetings[idx] = { ...meetings[idx], ...patch };
  write(KEYS.meetings, meetings);
  if (patch.outcomeNotes) {
    addActivity({ crmRecordId: meetings[idx].crmRecordId, type: "Meeting Completed", description: `Meeting "${meetings[idx].title}" completed.` });
  }
  return meetings[idx];
}

export function deleteMeeting(id) {
  write(KEYS.meetings, read(KEYS.meetings).filter((m) => m.id !== id));
}

// ─── Notes ───

export function getNotes(recordId) {
  return read(KEYS.notes).filter((n) => n.crmRecordId === recordId).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export function createNote(data) {
  const notes = read(KEYS.notes);
  const note = {
    id: uid(),
    crmRecordId: data.crmRecordId || null,
    opportunityId: data.opportunityId || null,
    companyId: data.companyId || null,
    personId: data.personId || null,
    leadId: data.leadId || null,
    meetingId: data.meetingId || null,
    content: data.content || "",
    createdAt: new Date().toISOString(),
  };
  write(KEYS.notes, [note, ...notes]);
  if (note.crmRecordId) {
    addActivity({ crmRecordId: note.crmRecordId, type: "Note Added", description: "A note was added to this record." });
  }
  return note;
}

export function deleteNote(id) {
  write(KEYS.notes, read(KEYS.notes).filter((n) => n.id !== id));
}

// ─── Activities ───

export function getActivities(recordId) {
  return read(KEYS.activities)
    .filter((a) => a.crmRecordId === recordId)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export function addActivity(data) {
  const activities = read(KEYS.activities);
  const activity = {
    id: uid(),
    crmRecordId: data.crmRecordId || null,
    type: data.type || "CRM Record Created",
    description: data.description || "",
    metadata: data.metadata || null,
    createdAt: new Date().toISOString(),
  };
  write(KEYS.activities, [activity, ...activities]);
  if (activity.crmRecordId) {
    updateRecord(activity.crmRecordId, {});
  }
  return activity;
}