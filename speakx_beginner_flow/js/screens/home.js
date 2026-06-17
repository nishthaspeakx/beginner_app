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
    ui.coinPill(0),
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
    el("div", { class: "lesson-pop" }, [
      el("h3", {}, situation.home.title),                 // "Aaj ke Sentences"
      el("div", { class: "sub" }, situation.home.subtitle), // "Video dekho aur 3 baatein bolna seekho"
      el("button", { class: "btn-start", onClick: () => onStart(situation.id) }, [
        "Start",
        el("span", { class: "gift-pill" }, ["🎁", "Surprise Gift"]),
      ]),
    ]),

    el("div", { style: "height:18px" }),
  ]);

  root.appendChild(header);
  root.appendChild(body);
  root.appendChild(ui.premiumBanner());
  root.appendChild(ui.bottomNav("home"));
};
