/* ============================================================
   Shared UI helpers (reused across screens)
   ============================================================ */
window.SpeakX = window.SpeakX || {};

window.SpeakX.ui = {
  // tiny element factory
  el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") {
        node.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (v !== null && v !== undefined) node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  },

  // SpeakX coin pill (existing component)
  coinPill(value) {
    return this.el("div", { class: "coin-pill" }, [
      this.el("span", { class: "coin" }, "C"),
      String(value),
    ]);
  },

  translatePill() {
    return this.el("button", { class: "translate-pill", title: "Translate" }, [
      this.el("span", { html: "A&#2309;" }),
    ]);
  },

  // Premium banner — existing component, kept exactly
  premiumBanner() {
    return this.el("div", { class: "premium-banner" }, [
      this.el("div", { class: "pb-top" }, "Your 50% discount is expiring soon!"),
      this.el("div", { class: "pb-row" }, [
        this.el("div", { class: "timer" }, [
          this.el("span", { class: "seg" }, "00"),
          this.el("span", { class: "seg" }, "29"),
          this.el("span", { class: "seg" }, "31"),
        ]),
        this.el("button", { class: "unlock-btn" }, "Unlock Premium @ ₹2"),
      ]),
    ]);
  },

  // Bottom navigation — existing component, kept exactly
  bottomNav(active = "home") {
    const item = (key, label, icon, cls = "") =>
      this.el(
        "button",
        { class: `nav-item ${cls} ${active === key ? "active" : ""}` },
        [this.el("span", { class: "nav-ico" }, icon), label]
      );
    return this.el("div", { class: "bottom-nav" }, [
      item("home", "Home", "⌂"),
      item("premium", "Premium", "♛"),
      item("call", "AI Call", "☎", "call"),
      item("progress", "Progress", "☰"),
    ]);
  },

  toast(message) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = this.el("div", { class: "toast" });
      document.body.appendChild(t);
    }
    t.textContent = message;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 1900);
  },
};
