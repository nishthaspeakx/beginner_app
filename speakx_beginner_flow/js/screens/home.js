/* ============================================================
   SCREEN 1 — HOME
   Only the lesson card text changes vs. the existing app:
     "Vocabulary"                      -> "Aaj ke Sentences"
     "Is lesson mein 10 sentences..."  -> "Video dekho aur 3 baatein bolna seekho"
   Everything else (header, level box, node, Start button,
   Surprise Gift, premium banner, bottom nav) is unchanged.
   ============================================================ */
window.SpeakX = window.SpeakX || {};

window.SpeakX.HomeScreen = function (root, { onStart }) {
  const ui = window.SpeakX.ui;
  const el = ui.el.bind(ui);
  const situation = window.SpeakX.situations[window.SpeakX.activeSituationId];

  const header = el("div", { class: "appbar" }, [
    el("div", { class: "lang-pill" }, [
      "हि",
      el("span", { class: "chev" }, "▾"),
    ]),
    el("div", { class: "spacer" }),
    ui.translatePill(),
    ui.coinPill(window.SpeakX.state.coins),
  ]);

  const body = el("div", { class: "screen-body" }, [
    el("div", { class: "home-hero" }, [
      el("h1", {}, "Family ke saath baat karo"),
      el("p", {}, "500+ sentences seekhein aur baat kare"),
    ]),

    el("div", { class: "level-box" }, [
      el("div", { class: "lvl" }, "LEVEL 1"),
      el("div", { class: "lvl-name" }, "Rozana English"),
    ]),

    el("div", { class: "lesson-node" }, [
      el("div", { class: "node-icon" }, "🗂️"),
      el("div", { class: "node-base" }),
    ]),

    // Lesson popover card — TEXT UPDATED, styling untouched
    lessonCard(),

    // Next card appears once the situation is complete
    nextCard(),

    el("div", { style: "height:18px" }),
  ]);

  function lessonCard() {
    const done = window.SpeakX.state.isLessonDone(situation.id);
    const card = el("div", { class: "lesson-pop" }, [
      done ? el("div", { class: "done-badge" }, [el("span", {}, "✓"), "Completed"]) : null,
      el("h3", {}, situation.home.title),                  // "Aaj ke Sentences"
      el("div", { class: "sub" }, situation.home.subtitle), // "Video dekho aur 3 baatein bolna seekho"
      el("button", { class: "btn-start", onClick: () => onStart(situation.id) }, [
        done ? "Review" : "Start",
        el("span", { class: "gift-pill" }, ["🎁", "Surprise Gift"]),
      ]),
    ]);
    return card;
  }

  function nextCard() {
    if (!window.SpeakX.state.isLessonDone(situation.id) || !situation.nextHomeCard) {
      return el("div", { class: "hidden" });
    }
    const nc = situation.nextHomeCard;
    return el("div", { class: "lesson-pop", style: "margin-top:22px" }, [
      el("h3", {}, nc.title),               // "Aaj ki Grammar"
      el("div", { class: "sub" }, nc.subtitle), // "Sentence banana seekho"
      el("button", {
        class: "btn-start",
        onClick: () => ui.toast("Aaj ki Grammar — coming soon 🚧"),
      }, "Start"),
    ]);
  }

  root.appendChild(header);
  root.appendChild(body);
  root.appendChild(ui.premiumBanner());
  root.appendChild(ui.bottomNav("home"));
};
