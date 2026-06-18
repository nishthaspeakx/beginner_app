/* ============================================================
   SCREEN 1 — HOME
   Renders the ordered list of lesson cards (window.SpeakX.lessonOrder).
   A lesson's card appears once the previous lesson is complete.
   Completed lessons show a green "Completed" badge + "Review".
   Branding, header, level box, node, premium banner, nav — unchanged.
   ============================================================ */
window.SpeakX = window.SpeakX || {};

window.SpeakX.HomeScreen = function (root, { onStart }) {
  const ui = window.SpeakX.ui;
  const el = ui.el.bind(ui);
  const state = window.SpeakX.state;
  const order = window.SpeakX.lessonOrder || [window.SpeakX.activeSituationId];

  const header = el("div", { class: "appbar" }, [
    el("div", { class: "lang-pill" }, ["हि", el("span", { class: "chev" }, "▾")]),
    el("div", { class: "spacer" }),
    ui.translatePill(),
    ui.coinPill(state.coins),
  ]);

  // Build the visible lesson cards in sequence (gated by previous completion).
  const cards = [];
  order.forEach((sid, i) => {
    const unlocked = i === 0 || state.isLessonDone(order[i - 1]);
    if (!unlocked) return;
    cards.push(lessonCard(window.SpeakX.situations[sid], i === 0));
  });

  const body = el("div", { class: "screen-body" }, [
    el("div", { class: "home-hero" }, [
      el("h1", {}, "Shopkeeper se baat karo"),
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
    ...cards,
    el("div", { style: "height:18px" }),
  ]);

  function lessonCard(situation, isFirst) {
    const done = state.isLessonDone(situation.id);
    return el("div", { class: "lesson-pop", style: isFirst ? "" : "margin-top:22px" }, [
      done ? el("div", { class: "done-badge" }, [el("span", {}, "✓"), "Completed"]) : null,
      el("h3", {}, situation.home.title),
      el("div", { class: "sub" }, situation.home.subtitle),
      el("button", { class: "btn-start", onClick: () => onStart(situation.id) }, [
        done ? "Review" : "Start",
      ]),
    ]);
  }

  root.appendChild(header);
  root.appendChild(body);
  root.appendChild(ui.premiumBanner());
  root.appendChild(ui.bottomNav("home"));
};
