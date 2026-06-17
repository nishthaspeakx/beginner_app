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
    // Home card shown AFTER this situation's lesson is completed.
    // (Not implemented yet — card only.)
    nextHomeCard: {
      title: "Aaj ki Grammar",
      subtitle: "Sentence banana seekho",
      locked: true,
    },
    tasks: [
      {
        id: "greeting",
        icon: "👋",
        title: "Shopkeeper ko greet karo",
        logLabel: "Greeting",
        modules: ["video", "speaking", "readAlong", "rolePlay", "aiCall"],
        // ---- The actual lesson (data-driven, reused by every step) ----
        lesson: {
          sentence: {
            en: "Hello, I want cookies.",
            hi: "नमस्ते, मुझे बिस्कुट चाहिए।",
          },
          audio: "assets/sentence_hello_cookies.mp3",
          images: {
            shop: "assets/kirana_shop.jpg",
            shopkeeper: "assets/shopkeeper.jpg",
          },
          coinPerStep: 2,
          // The reusable lesson pipeline. Same shape powers future lessons.
          steps: [
            { type: "listen" },
            { type: "speak" },
            {
              type: "arrange",
              words: ["Hello", "I", "want", "cookies"],
              answer: ["Hello", "I", "want", "cookies"],
            },
            {
              type: "fillBlank",
              // sentence split around the blank
              before: "Hello, I",
              after: "cookies.",
              options: ["am", "want", "are"],
              answer: "want",
            },
            {
              type: "realLife",
              shopkeeperLine: "Namaste ji, kya chahiye?",
              question: "Aap English mein kya bolenge?",
              answer: "Hello, I want cookies.",
            },
          ],
        },
      },
      {
        id: "price",
        icon: "💰",
        title: "Price pucho",
        logLabel: "Price",
        modules: ["video", "speaking", "readAlong", "rolePlay", "aiCall"],
        lesson: null, // (demo auto-completes this)
      },
      {
        id: "payment",
        icon: "💳",
        title: "Payment karo",
        logLabel: "Payment",
        modules: ["video", "speaking", "readAlong", "rolePlay", "aiCall"],
        lesson: null, // (demo auto-completes this)
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
