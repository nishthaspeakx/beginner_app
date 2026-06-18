/* ============================================================
   LESSON SCREEN (orchestrator)
   Runs a task's lesson.steps pipeline generically:
     Listen → Speak → Arrange → Fill Blank → Real Life → done
   The pipeline is whatever the data says — no step is hardcoded.
   ============================================================ */
window.SpeakX = window.SpeakX || {};

window.SpeakX.LessonScreen = function (root, { situationId, taskId, onExit }) {
  const ui = window.SpeakX.ui;
  const el = ui.el.bind(ui);
  const state = window.SpeakX.state;
  const situation = window.SpeakX.situations[situationId];
  const task = situation.tasks.find((t) => t.id === taskId);
  const lesson = task.lesson;
  const steps = lesson.steps;
  const total = steps.length;

  // one audio element reused for the whole lesson; speechSynthesis fallback
  const audioEl = new Audio(lesson.audio);
  function playAudio() {
    // Mute the lesson video for good once Listen is tapped, so the sentence
    // audio never overlaps the video and the video stays silent afterward.
    const video = body.querySelector(".lesson-photo video");
    if (video) video.muted = true;
    try {
      audioEl.currentTime = 0;
      audioEl.play().catch(() => speak());
    } catch (e) { speak(); }
  }
  function speak() {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(lesson.sentence.en);
    u.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  // ----- header: close + progress + translate + coins -----
  const progressFill = el("div", { class: "progress-fill" });
  let coinPill = ui.coinPill(state.coins);
  const header = el("div", { class: "lesson-appbar" }, [
    el("button", { class: "close-btn", title: "Close", onClick: () => onExit(false) }, "✕"),
    el("div", { class: "progress-track" }, [progressFill]),
    ui.translatePill(),
    coinPill,
  ]);

  const body = el("div", { class: "lesson-body screen-body" });
  root.appendChild(header);
  root.appendChild(body);

  let index = 0;

  function setProgress() {
    progressFill.style.width = `${(index / total) * 100}%`;
  }

  function render() {
    body.innerHTML = "";
    setProgress();
    const step = steps[index];
    const renderer = window.SpeakX.steps[step.type];

    const ctx = {
      lesson, step, index, total, ui,
      playAudio,
      addCoins: () => { coinPill.replaceWith((coinPill = ui.coinPill(state.addCoins(lesson.coinPerStep || 0)))); },
      done: () => {
        index += 1;
        if (index >= total) {
          progressFill.style.width = "100%";
          onExit(true); // task lesson complete
        } else {
          render();
        }
      },
    };

    if (!renderer) { console.warn("Unknown step type:", step.type); ctx.done(); return; }
    renderer(ctx, body);
  }

  render();
};
