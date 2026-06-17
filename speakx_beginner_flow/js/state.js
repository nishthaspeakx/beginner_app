/* ============================================================
   APP STATE (in-memory, per session)
   Tracks task completion, lesson completion and coins so the
   Home + Task List screens reflect progress after a lesson.
   ============================================================ */
window.SpeakX = window.SpeakX || {};

window.SpeakX.state = {
  completedTasks: {},   // { [situationId]: Set<taskId> }
  lessonDone: {},       // { [situationId]: boolean } whole situation finished
  coins: 0,

  _set(sid) {
    if (!this.completedTasks[sid]) this.completedTasks[sid] = new Set();
    return this.completedTasks[sid];
  },
  taskDone(sid, tid) { return this._set(sid).has(tid); },
  markTask(sid, tid) { this._set(sid).add(tid); },
  completedCount(sid) { return this._set(sid).size; },

  isLessonDone(sid) { return !!this.lessonDone[sid]; },
  markLessonDone(sid) { this.lessonDone[sid] = true; },

  addCoins(n) { this.coins += n; return this.coins; },
};
