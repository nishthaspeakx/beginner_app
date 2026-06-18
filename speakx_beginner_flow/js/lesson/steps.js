/* ============================================================
   REUSABLE LESSON STEP COMPONENTS
   Each step renders into a container and is fully data-driven
   (reads ctx.lesson / ctx.step). No lesson content is hardcoded.

   ctx = {
     lesson, step, index, total, ui,
     playAudio(),        // play the sentence audio
     addCoins(),         // reward coins for finishing this step
     done(),             // advance to next step / finish
   }

   Components: ListenStep, SpeakStep, ArrangeWordsStep,
   FillBlankStep, RealLifePracticeStep, SuccessPanel.
   ============================================================ */
window.SpeakX = window.SpeakX || {};

(function () {
  const S = (window.SpeakX.steps = {});
  const ui = window.SpeakX.ui;
  const el = ui.el.bind(ui);

  /* ---- shared bits ---- */
  function sentenceCard(lesson, variant) {
    return el("div", { class: `sentence-card ${variant || ""}` }, [
      el("div", { class: "en" }, lesson.sentence.en),
      el("div", { class: "divider" }),
      el("div", { class: "hi" }, lesson.sentence.hi),
    ]);
  }

  function audioButton(ctx, opts = {}) {
    const btn = el(
      "button",
      { class: `audio-btn ${opts.primary ? "primary" : ""} ${opts.cls || ""}`, title: "Listen" },
      "🔊"
    );
    btn.addEventListener("click", () => {
      btn.classList.add("playing");
      ctx.playAudio();
      setTimeout(() => btn.classList.remove("playing"), 1400);
    });
    return btn;
  }

  // Top media: real image if the lesson has one, else a placeholder card.
  // (Grammar lesson uses a placeholder until a real video is uploaded.)
  function mediaBlock(ctx) {
    const lesson = ctx.lesson;
    if (lesson.video) {
      const v = el("video", { src: lesson.video, loop: "", autoplay: "", playsinline: "", preload: "auto" });
      v.muted = false;
      v.play().catch(() => {});
      return el("div", { class: "lesson-photo" }, [v]);
    }
    if (lesson.images && lesson.images.shop) {
      return el("div", { class: "lesson-photo" }, [el("img", { src: lesson.images.shop, alt: "Lesson" })]);
    }
    return el("div", { class: "lesson-photo placeholder" }, [
      el("div", { class: "media-badge" }, lesson.placeholderLabel || "Practice"),
      el("div", { class: "ph-inner" }, [
        el("div", { class: "ph-emoji" }, "🎬"),
        el("div", { class: "ph-sub" }, "Video coming soon"),
      ]),
    ]);
  }

  // Speaker avatar: shopkeeper image if present, else an emoji avatar.
  function avatarBlock(ctx) {
    const lesson = ctx.lesson;
    if (lesson.images && lesson.images.shopkeeper) {
      return el("div", { class: "lesson-photo avatar" }, [el("img", { src: lesson.images.shopkeeper, alt: "Speaker" })]);
    }
    return el("div", { class: "lesson-photo avatar emoji-avatar" }, [el("span", {}, "🗣️")]);
  }

  // Green success footer used by most steps
  S.SuccessPanel = function (message, onContinue) {
    const panel = el("div", { class: "success-panel" }, [
      el("div", { class: "head" }, [el("span", { class: "check" }, "✓"), message]),
      el("button", { class: "btn-continue green", onClick: onContinue }, "CONTINUE"),
    ]);
    return panel;
  };

  /* ---------------- SCREEN 1: Listen & Understand ---------------- */
  S.listen = function (ctx, mount) {
    const media = mediaBlock(ctx);
    mount.appendChild(media);
    mount.appendChild(sentenceCard(ctx.lesson));
    // optional context chip (e.g. "Abhi / Now") — beginner-friendly "when to say it"
    if (ctx.step.chip) {
      mount.appendChild(
        el("div", { class: "chip-row" }, [el("span", { class: "context-chip" }, ctx.step.chip)])
      );
    }
    const listenBtn = audioButton(ctx, { primary: true });
    mount.appendChild(
      el("div", { class: "listen-line" }, [listenBtn, el("span", { class: "lbl" }, "Listen")])
    );
    mount.appendChild(el("div", { class: "grow" }));
    mount.appendChild(
      el("div", { class: "lesson-footer" }, [
        el("button", {
          class: "btn-continue",
          onClick: () => { ctx.addCoins(); ctx.done(); },
        }, "Continue"),
      ])
    );
    // Sentence audio plays only when the user taps Listen (no auto-play on entry).

    // Glow the Listen button when the video reaches its "tap the button below"
    // cue, guiding the user to tap. The glow stops once the user taps.
    const video = media.querySelector("video");
    const cue = ctx.lesson.listenCueTime;
    if (video && typeof cue === "number") {
      let tapped = false;
      listenBtn.addEventListener("click", () => { tapped = true; listenBtn.classList.remove("glow"); });
      video.addEventListener("timeupdate", () => {
        if (tapped) return;
        listenBtn.classList.toggle("glow", video.currentTime >= cue);
      });
    }
  };

  /* ---------------- SCREEN 2: Speak Now ---------------- */
  S.speak = function (ctx, mount) {
    mount.appendChild(audioButton(ctx, { cls: "center" }));
    mount.appendChild(avatarBlock(ctx));
    const card = sentenceCard(ctx.lesson, "active");
    mount.appendChild(card);
    mount.appendChild(el("div", { class: "grow" }));

    const controls = el("div", {}, [
      el("div", { class: "speak-label" }, [el("span", { class: "speak-tooltip" }, "Speak Now")]),
      el("div", { class: "mic-row" }, []),
    ]);
    const micRow = controls.querySelector(".mic-row");
    const retry = el("button", { class: "side-btn", title: "Retry" }, "↺");
    const mic = el("button", { class: "mic-btn", title: "Speak" }, "🎤");
    const skip = el("button", { class: "side-btn" }, "Skip");
    micRow.append(retry, mic, skip);
    mount.appendChild(controls);

    const finish = () => {
      controls.remove();
      card.classList.add("correct");
      ctx.addCoins();
      mount.appendChild(S.SuccessPanel("CORRECT!", ctx.done));
    };

    mic.addEventListener("click", () => {
      mic.classList.add("listening");
      mic.textContent = "🎙️";
      setTimeout(() => finish(), 1000); // mock listening
    });
    retry.addEventListener("click", () => {
      mic.classList.remove("listening");
      mic.textContent = "🎤";
    });
    skip.addEventListener("click", finish);
  };

  /* ---------------- SCREEN 3: Listen & Arrange ---------------- */
  S.arrange = function (ctx, mount) {
    const answer = []; // selected words in order

    mount.appendChild(
      el("div", { class: "lesson-instruction" }, [el("h2", {}, "Arrange the sentence")])
    );
    mount.appendChild(el("div", { class: "listen-line" }, [audioButton(ctx, { primary: true })]));

    const slots = el("div", { class: "answer-slots" });
    mount.appendChild(slots);

    const bank = el("div", { class: "chips-bank" });
    mount.appendChild(bank);

    // shuffle deterministically by index so it varies but is stable per render
    const words = ctx.step.words.slice();
    const order = [3, 1, 0, 2].filter((i) => i < words.length).concat(words.map((_, i) => i));
    const seen = new Set();
    const shuffled = order.filter((i) => (seen.has(i) ? false : seen.add(i)));

    const chipEls = {};
    shuffled.forEach((i) => {
      const w = words[i];
      const chip = el("button", { class: "chip", "data-i": i }, w);
      chip.addEventListener("click", () => addWord(i, w, chip));
      bank.appendChild(chip);
      chipEls[i] = chip;
    });

    mount.appendChild(el("div", { class: "grow" }));
    const footer = el("div", { class: "lesson-footer" });
    mount.appendChild(footer);

    function addWord(i, w, chip) {
      chip.classList.add("used");
      const token = el("button", { class: "chip in-answer" }, w);
      token.addEventListener("click", () => {
        const idx = answer.findIndex((a) => a.i === i);
        if (idx > -1) answer.splice(idx, 1);
        token.remove();
        chip.classList.remove("used");
        slots.classList.remove("wrong");
      });
      answer.push({ i, w, token });
      slots.appendChild(token);
      check();
    }

    function check() {
      if (answer.length !== ctx.step.answer.length) return;
      const got = answer.map((a) => a.w).join(" ");
      const want = ctx.step.answer.join(" ");
      if (got === want) {
        slots.classList.add("correct");
        bank.style.display = "none";
        answer.forEach((a) => (a.token.style.pointerEvents = "none"));
        ctx.addCoins();
        footer.replaceWith(S.SuccessPanel("CORRECT!", ctx.done));
      } else {
        slots.classList.add("wrong");
      }
    }
  };

  /* ---------------- SCREEN 4: Fill in the Blank ---------------- */
  S.fillBlank = function (ctx, mount) {
    mount.appendChild(
      el("div", { class: "lesson-photo" }, [el("img", { src: ctx.lesson.images.shop, alt: "Kirana shop" })])
    );

    const qLine = el("div", { class: "sentence-row" }, [
      el("div", { class: "sentence-card", style: "text-align:left" }, [
        el("div", { class: "en" }, `${ctx.step.before} ____ ${ctx.step.after}`),
        el("div", { class: "divider" }),
        el("div", { class: "hi" }, ctx.lesson.sentence.hi),
      ]),
      audioButton(ctx, { primary: true }),
    ]);
    mount.appendChild(qLine);

    const opts = el("div", { class: "options" });
    mount.appendChild(opts);

    const footerHolder = el("div", {});
    mount.appendChild(el("div", { class: "grow" }));
    mount.appendChild(footerHolder);

    ctx.step.options.forEach((opt) => {
      const card = el("div", { class: "option-card", role: "button", tabindex: "0" }, opt);
      const choose = () => {
        if (opt === ctx.step.answer) {
          card.classList.add("correct");
          opts.querySelectorAll(".option-card").forEach((c) => c.classList.add("locked"));
          ctx.addCoins();
          footerHolder.appendChild(S.SuccessPanel("GREAT JOB!", ctx.done));
        } else {
          card.classList.add("wrong");
          setTimeout(() => card.classList.remove("wrong"), 700);
        }
      };
      card.addEventListener("click", choose);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter") choose(); });
      opts.appendChild(card);
    });
  };

  /* ---------------- SCREEN 5: Real Life Practice ---------------- */
  S.realLife = function (ctx, mount) {
    mount.appendChild(
      el("div", { class: "lesson-photo" }, [el("img", { src: ctx.lesson.images.shop, alt: "Kirana shop" })])
    );
    mount.appendChild(
      el("div", { class: "convo-card" }, [
        el("div", { class: "convo-line" }, [el("span", {}, "👨"), ctx.step.shopkeeperLine]),
      ])
    );
    mount.appendChild(el("div", { class: "convo-q" }, ctx.step.question));

    const btn = el("button", { class: "answer-btn" }, ctx.step.answer);
    mount.appendChild(btn);

    mount.appendChild(el("div", { class: "grow" }));
    const footerHolder = el("div", {});
    mount.appendChild(footerHolder);

    btn.addEventListener("click", () => {
      btn.classList.add("correct");
      btn.style.pointerEvents = "none";
      ctx.playAudio();
      ctx.addCoins();
      footerHolder.appendChild(S.SuccessPanel("CORRECT!", ctx.done));
    });
  };

  /* ---------------- MCQ (question + helper + options) ---------------- */
  S.mcq = function (ctx, mount) {
    mount.appendChild(el("div", { class: "lesson-instruction" }, [el("h2", {}, ctx.step.question)]));
    if (ctx.step.helper) mount.appendChild(el("p", { class: "mcq-helper" }, ctx.step.helper));

    const opts = el("div", { class: "options" });
    mount.appendChild(opts);
    mount.appendChild(el("div", { class: "grow" }));
    const footerHolder = el("div", {});
    mount.appendChild(footerHolder);

    ctx.step.options.forEach((opt) => {
      const card = el("div", { class: "option-card", role: "button", tabindex: "0" }, opt);
      const choose = () => {
        if (opt === ctx.step.answer) {
          card.classList.add("correct");
          opts.querySelectorAll(".option-card").forEach((c) => c.classList.add("locked"));
          ctx.addCoins();
          footerHolder.appendChild(S.SuccessPanel("GREAT JOB!", ctx.done));
        } else {
          card.classList.add("wrong");
          setTimeout(() => card.classList.remove("wrong"), 700);
        }
      };
      card.addEventListener("click", choose);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter") choose(); });
      opts.appendChild(card);
    });
  };
})();
