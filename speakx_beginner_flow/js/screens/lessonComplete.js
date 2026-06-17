/* ============================================================
   LESSON COMPLETE SCREEN
   Shown after all tasks in a situation are complete.
   Data-driven: takes the sentence(s) the learner mastered.
   ============================================================ */
window.SpeakX = window.SpeakX || {};

window.SpeakX.LessonCompleteScreen = function (root, { situationId, onContinue }) {
  const ui = window.SpeakX.ui;
  const el = ui.el.bind(ui);
  const situation = window.SpeakX.situations[situationId];

  // collect the sentences learned from tasks that had a lesson
  const learned = situation.tasks
    .filter((t) => t.lesson)
    .map((t) => t.lesson.sentence.en);

  const learnedPills = learned.map((s) =>
    el("div", { class: "learned-pill" }, [el("span", {}, "✅"), s])
  );

  const complete = situation.complete || { title: "Lesson Complete", message: "" };
  const screen = el("div", { class: "complete-screen" }, [
    el("div", { class: "complete-body" }, [
      el("div", { class: "complete-emoji" }, "🎉"),
      el("h1", {}, complete.title),
      el("p", { class: "msg" }, complete.message),
      ...learnedPills,
    ]),
    el("div", { class: "lesson-footer" }, [
      el("button", { class: "btn-continue", onClick: onContinue }, "Continue"),
    ]),
  ]);

  root.appendChild(screen);

  // confetti
  const burst = el("div", { class: "celebrate" });
  const colors = ["#F4701E", "#37B24D", "#6A5BFF", "#F6C544", "#FF7AA8"];
  for (let i = 0; i < 40; i++) {
    const c = el("div", { class: "confetti" });
    c.style.left = Math.round((i / 40) * 100) + "%";
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 1.8 + (i % 7) * 0.25 + "s";
    c.style.animationDelay = (i % 10) * 0.08 + "s";
    burst.appendChild(c);
  }
  root.appendChild(burst);
  setTimeout(() => burst.remove(), 4500);
};
