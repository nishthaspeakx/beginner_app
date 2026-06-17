/* ============================================================
   SCREEN 2 — SITUATION LEARNING
   Data-driven from window.SpeakX.situations[id].
   - Top media (kirana video) ~38% screen height
   - "Aaj hum seekhenge" + context line
   - Progress: x/3 Complete
   - Exactly 3 clean task cards (icon + title + chevron only)
   - Tapping a task: console.log + placeholder, marks complete,
     updates progress. Modular: future video/speaking/roleplay/
     AI screens attach via task.modules without changing layout.
   ============================================================ */
window.SpeakX = window.SpeakX || {};

window.SpeakX.SituationScreen = function (root, { situationId, onClose, onOpenTask }) {
  const ui = window.SpeakX.ui;
  const el = ui.el.bind(ui);
  const situation = window.SpeakX.situations[situationId];

  // per-session progress state
  const completed = new Set();
  const total = situation.tasks.length;

  // ---- Header: close + progress bar + translate + coins ----
  const progressFill = el("div", { class: "progress-fill" });
  const header = el("div", { class: "lesson-appbar" }, [
    el("button", { class: "close-btn", title: "Close", onClick: onClose }, "✕"),
    el("div", { class: "progress-track" }, [progressFill]),
    ui.translatePill(),
    ui.coinPill(2),
  ]);

  // ---- Media area ----
  let media;
  if (situation.media.type === "video") {
    const video = el("video", {
      src: situation.media.src,
      muted: "",
      loop: "",
      autoplay: "",
      playsinline: "",
      preload: "auto",
    });
    video.muted = true;
    const soundBtn = el("button", { class: "sound-toggle", title: "Sound" }, "🔇");
    soundBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      soundBtn.textContent = video.muted ? "🔇" : "🔊";
      if (!video.muted) video.play().catch(() => {});
    });
    media = el("div", { class: "lesson-media" }, [
      video,
      el("div", { class: "media-badge" }, situation.media.badge || "Lesson"),
      soundBtn,
    ]);
  } else {
    // image placeholder fallback
    media = el("div", { class: "lesson-media" }, [
      el("img", {
        src: situation.media.src,
        style: "width:100%;height:100%;object-fit:cover;",
        alt: situation.media.badge || "Lesson",
      }),
      el("div", { class: "media-badge" }, situation.media.badge || "Lesson"),
    ]);
  }

  // ---- Context ----
  const context = el("div", { class: "lesson-section" }, [
    el("p", { class: "eyebrow" }, situation.learnTitle), // "Aaj hum seekhenge"
    el("p", { class: "context-line" }, [
      el("span", { class: "emoji" }, situation.contextEmoji),
      situation.contextText, // "Shopkeeper se English mein baat karna"
    ]),
  ]);

  // ---- Progress label ----
  const progressCount = el("span", { class: "count" }, `0/${total} Complete`);
  const progressRow = el("div", { class: "progress-row" }, [
    el("span", { class: "label" }, "Progress"),
    progressCount,
  ]);

  // ---- Task list (icon + title + chevron only) ----
  const list = el("div", { class: "task-list" });

  function refreshProgress() {
    const done = completed.size;
    progressCount.textContent = `${done}/${total} Complete`;
    progressFill.style.width = `${(done / total) * 100}%`;
  }

  situation.tasks.forEach((task) => {
    const card = el(
      "div",
      { class: "task-card", "data-task": task.id, role: "button", tabindex: "0" },
      [
        el("div", { class: "task-icon" }, task.icon),
        el("div", { class: "task-title" }, task.title),
        el("div", { class: "task-right" }, [
          el("span", { class: "chevron" }, "›"),
          el("span", { class: "task-check" }, "✓"),
        ]),
      ]
    );

    const handle = () => {
      // ---- placeholder navigation hook (modular) ----
      console.log("Task Selected:", task.logLabel, "| modules:", task.modules);
      onOpenTask(situation, task);

      // mark complete + update progress
      if (!completed.has(task.id)) {
        completed.add(task.id);
        card.classList.add("done");
        refreshProgress();
      }
    };
    card.addEventListener("click", handle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handle(); }
    });
    list.appendChild(card);
  });

  const body = el("div", { class: "screen-body" }, [media, context, progressRow, list]);

  root.appendChild(header);
  root.appendChild(body);

  refreshProgress();
};
