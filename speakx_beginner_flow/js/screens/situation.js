/* ============================================================
   SCREEN 2 — SITUATION (TASK LIST)
   Reads shared state so progress persists across the lesson.
   - Tap a task with a lesson -> opens the lesson pipeline.
   - opts.runDemo: after returning from task 1, auto-completes the
     remaining tasks (demo), celebrates, then opens Lesson Complete.
   ============================================================ */
window.SpeakX = window.SpeakX || {};

window.SpeakX.SituationScreen = function (root, opts) {
  const { situationId, onClose, onOpenTask, runDemo, onAllComplete } = opts;
  const ui = window.SpeakX.ui;
  const el = ui.el.bind(ui);
  const state = window.SpeakX.state;
  const situation = window.SpeakX.situations[situationId];
  const total = situation.tasks.length;

  // ---- Header ----
  const progressFill = el("div", { class: "progress-fill" });
  const header = el("div", { class: "lesson-appbar" }, [
    el("button", { class: "close-btn", title: "Close", onClick: onClose }, "✕"),
    el("div", { class: "progress-track" }, [progressFill]),
    ui.translatePill(),
    ui.coinPill(state.coins),
  ]);

  // ---- Media (video / image / placeholder) ----
  const media = buildMedia(situation.media);

  function buildMedia(m) {
    if (m.type === "video") {
      const video = el("video", { src: m.src, muted: "", loop: "", autoplay: "", playsinline: "", preload: "auto", poster: m.poster || "" });
      video.muted = true;
      const soundBtn = el("button", { class: "sound-toggle", title: "Sound" }, "🔇");
      soundBtn.addEventListener("click", () => {
        video.muted = !video.muted;
        soundBtn.textContent = video.muted ? "🔇" : "🔊";
        if (!video.muted) video.play().catch(() => {});
      });
      return el("div", { class: "lesson-media" }, [video, el("div", { class: "media-badge" }, m.badge || "Lesson"), soundBtn]);
    }
    if (m.type === "image") {
      return el("div", { class: "lesson-media" }, [
        el("img", { src: m.src, style: "width:100%;height:100%;object-fit:cover", alt: m.badge || "Lesson" }),
        el("div", { class: "media-badge" }, m.badge || "Lesson"),
      ]);
    }
    // placeholder (no video yet) — TODO: replace with real video upload
    return el("div", { class: "lesson-media placeholder" }, [
      el("div", { class: "media-badge" }, m.badge || "Practice"),
      el("div", { class: "ph-inner" }, [el("div", { class: "ph-emoji" }, "🎬"), el("div", { class: "ph-sub" }, "Video coming soon")]),
    ]);
  }

  // ---- Context ----
  const context = el("div", { class: "lesson-section" }, [
    el("p", { class: "eyebrow" }, situation.learnTitle),
    el("p", { class: "context-line" }, [el("span", { class: "emoji" }, situation.contextEmoji), situation.contextText]),
    situation.contextSub ? el("p", { class: "context-sub" }, situation.contextSub) : null,
  ]);

  // ---- Progress label ----
  const progressCount = el("span", { class: "count" }, "");
  const progressRow = el("div", { class: "progress-row" }, [el("span", { class: "label" }, "Progress"), progressCount]);

  // ---- Task list ----
  const list = el("div", { class: "task-list" });
  const cardById = {};

  function refresh() {
    const done = state.completedCount(situationId);
    progressCount.textContent = `${done}/${total} Complete`;
    progressFill.style.width = `${(done / total) * 100}%`;
  }

  function markDone(taskId) {
    state.markTask(situationId, taskId);
    cardById[taskId].classList.add("done");
    refresh();
  }

  situation.tasks.forEach((task) => {
    const card = el("div", { class: "task-card", "data-task": task.id, role: "button", tabindex: "0" }, [
      el("div", { class: "task-icon" }, task.icon),
      el("div", { class: "task-title" }, task.title),
      el("div", { class: "task-right" }, [el("span", { class: "chevron" }, "›"), el("span", { class: "task-check" }, "✓")]),
    ]);
    if (state.taskDone(situationId, task.id)) card.classList.add("done");

    const handle = () => {
      if (state.taskDone(situationId, task.id)) return;
      if (task.lesson) {
        console.log("Task Selected:", task.logLabel, "| modules:", task.modules);
        onOpenTask(situation, task);
      } else {
        ui.toast("Pehle Task 1 complete karo 🙂");
      }
    };
    card.addEventListener("click", handle);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handle(); } });
    list.appendChild(card);
    cardById[task.id] = card;
  });

  const body = el("div", { class: "screen-body" }, [media, context, progressRow, list]);
  root.appendChild(header);
  root.appendChild(body);
  refresh();

  // ---- DEMO: auto-complete remaining tasks then celebrate ----
  if (runDemo) {
    const remaining = situation.tasks.filter((t) => !state.taskDone(situationId, t.id));
    setTimeout(() => {
      remaining.forEach((t, i) => setTimeout(() => markDone(t.id), i * 550));
      const afterAll = remaining.length * 550 + 500;
      setTimeout(() => {
        celebrate(root);
        setTimeout(() => onAllComplete && onAllComplete(), 1400);
      }, afterAll);
    }, 1000);
  }
};

/* simple confetti burst reused on the task list */
function celebrate(root) {
  const ui = window.SpeakX.ui;
  const burst = ui.el("div", { class: "celebrate" });
  const colors = ["#F4701E", "#37B24D", "#6A5BFF", "#F6C544", "#FF7AA8"];
  for (let i = 0; i < 36; i++) {
    const c = ui.el("div", { class: "confetti" });
    c.style.left = Math.round((i / 36) * 100) + "%";
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 1.7 + (i % 6) * 0.25 + "s";
    c.style.animationDelay = (i % 8) * 0.07 + "s";
    burst.appendChild(c);
  }
  root.appendChild(burst);
  setTimeout(() => burst.remove(), 4000);
}
