/* ============================================================
   APP ROUTER
   Minimal screen router. Each screen is a pure render function
   that paints into #app. Swapping the Vocabulary flow for the
   new Situation flow happens entirely here (onStart).
   ============================================================ */
(function () {
  const root = document.getElementById("app");
  const ui = window.SpeakX.ui;

  function clear() {
    root.innerHTML = "";
  }

  const router = {
    home() {
      clear();
      window.SpeakX.HomeScreen(root, {
        // Start button no longer opens "Vocabulary" — opens the situation lesson.
        onStart: (situationId) => router.situation(situationId),
      });
    },

    situation(situationId) {
      clear();
      window.SpeakX.SituationScreen(root, {
        situationId,
        onClose: () => router.home(),
        onOpenTask: (situation, task) => {
          // PLACEHOLDER for future lesson screens (video / speaking /
          // read along / role play / AI). Architecture is ready —
          // just route here based on task.modules later.
          ui.toast(`▶ ${task.title}  ·  (placeholder)`);
        },
      });
    },
  };

  window.SpeakX.router = router;
  router.home();
})();
