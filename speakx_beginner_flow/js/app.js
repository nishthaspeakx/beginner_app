/* ============================================================
   APP ROUTER
   Full demo flow:
   Home → Task List → Lesson (Listen→Speak→Arrange→FillBlank→RealLife)
        → Task 1 complete → (demo) auto-complete rest → celebrate
        → Lesson Complete → Home (card completed + next card)
   ============================================================ */
(function () {
  const root = document.getElementById("app");
  const ui = window.SpeakX.ui;
  const state = window.SpeakX.state;

  const clear = () => (root.innerHTML = "");

  const router = {
    home() {
      clear();
      window.SpeakX.HomeScreen(root, { onStart: (sid) => router.taskList(sid) });
    },

    // taskList accepts a flag to run the demo auto-complete after task 1
    taskList(situationId, runDemo) {
      clear();
      window.SpeakX.SituationScreen(root, {
        situationId,
        runDemo: !!runDemo,
        onClose: () => router.home(),
        onOpenTask: (situation, task) => router.lesson(situation.id, task.id),
        onAllComplete: () => router.lessonComplete(situationId),
      });
    },

    lesson(situationId, taskId) {
      clear();
      window.SpeakX.LessonScreen(root, {
        situationId,
        taskId,
        onExit: (completed) => {
          if (completed) {
            state.markTask(situationId, taskId);
            // back to task list, which will run the demo auto-complete
            router.taskList(situationId, true);
          } else {
            router.taskList(situationId, false);
          }
        },
      });
    },

    lessonComplete(situationId) {
      clear();
      state.markLessonDone(situationId);
      window.SpeakX.LessonCompleteScreen(root, {
        situationId,
        onContinue: () => router.home(),
      });
    },
  };

  window.SpeakX.router = router;
  router.home();
})();
