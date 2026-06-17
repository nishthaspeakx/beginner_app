/* ============================================================
   SITUATIONS DATA MODEL
   ------------------------------------------------------------
   Every real-life situation is described purely as data.
   Adding a new situation (Restaurant, Metro, Office, Interview,
   Doctor, Customer Service, Delivery, Friends & Family) means
   adding one object here — the screen code never changes.

   Each `task` is intentionally minimal for the beginner UI
   (icon + title only). The `modules` array is where future
   lesson types attach later:
     - 'video'      : watch the situation
     - 'speaking'   : speaking practice
     - 'readAlong'  : read along
     - 'rolePlay'   : role play
     - 'aiCall'     : AI conversation
   The screen reads `modules` but currently just logs/placeholders,
   so wiring real screens later requires NO structural change.
   ============================================================ */

window.SpeakX = window.SpeakX || {};

window.SpeakX.situations = {
  kirana: {
    id: "kirana",
    emoji: "🛒",
    // Home card text (Screen 1)
    home: {
      title: "Aaj ke Sentences",
      subtitle: "Video dekho aur 3 baatein bolna seekho",
    },
    // Lesson context (Screen 2)
    learnTitle: "Aaj hum seekhenge",
    contextEmoji: "🛒",
    contextText: "Shopkeeper se English mein baat karna",
    media: {
      type: "video", // 'video' now; swap to 'image' placeholder if needed
      src: "assets/kirana_training_video.mp4",
      badge: "Kirana Shop",
    },
    tasks: [
      {
        id: "greeting",
        icon: "👋",
        title: "Shopkeeper ko greet karo",
        logLabel: "Greeting",
        modules: ["video", "speaking", "readAlong", "rolePlay", "aiCall"],
      },
      {
        id: "price",
        icon: "💰",
        title: "Price pucho",
        logLabel: "Price",
        modules: ["video", "speaking", "readAlong", "rolePlay", "aiCall"],
      },
      {
        id: "payment",
        icon: "💳",
        title: "Payment karo",
        logLabel: "Payment",
        modules: ["video", "speaking", "readAlong", "rolePlay", "aiCall"],
      },
    ],
  },

  /* ----- FUTURE SITUATIONS (scaffolded, not yet shown) -----
     Uncomment / extend when ready. Same shape = drop-in ready.

  restaurant: {
    id: "restaurant", emoji: "🍽️",
    home: { title: "Aaj ke Sentences", subtitle: "Video dekho aur 3 baatein bolna seekho" },
    learnTitle: "Aaj hum seekhenge", contextEmoji: "🍽️",
    contextText: "Restaurant mein order karna",
    media: { type: "image", src: "assets/placeholder_restaurant.jpg", badge: "Restaurant" },
    tasks: [
      { id: "order",  icon: "📝", title: "Order karo",  logLabel: "Order",  modules: [] },
      { id: "ask",    icon: "❓", title: "Menu pucho",  logLabel: "Menu",   modules: [] },
      { id: "billpay",icon: "💳", title: "Bill pay karo",logLabel: "Bill",  modules: [] },
    ],
  },
  */
};

/* Which situation the Home lesson card opens right now. */
window.SpeakX.activeSituationId = "kirana";
