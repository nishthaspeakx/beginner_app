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
      poster: "assets/kirana_shop.jpg", // shown instead of black before play
      badge: "Kirana Shop",
    },
    // kirana = first card; after task 1 the demo auto-completes the rest.
    autoCompleteAfterFirst: true,
    complete: {
      title: "Lesson Complete",
      message: "Aaj aapne shopkeeper se English mein baat karna seekha.",
      // Sentences shown as completed cards on the Lesson Complete screen.
      sentences: [
        "Hello, I want cookies.",
        "How much is it for?",
        "I will pay in cash.",
      ],
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
          video: "assets/sia_shopkeeper_cookies.mp4",
          // Seconds into the video where the voice says "neeche diye gaye
          // button ko dabaye" — the Listen button glows from here to guide taps.
          listenCueTime: 6.2,
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
              shopkeeperLine: "Namaste, What do you want?",
              answer: "Hello, I want cookies.",
              answerHi: "नमस्ते, मुझे कुकीज़ चाहिए।",
              video: "assets/kirana_dialogue_16x9_edited.mp4",
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

  /* ============================================================
     LESSON 2 — Aaj ki Grammar (grammar_001)
     Beginner-friendly: NO tense rules. Three useful sentences
     taught through Listen → Speak → MCQ, mapped to "kab kya bolna".
     Each task is its own mini-lesson; tasks complete one by one
     (no demo auto-complete), then the Grammar Complete screen.
     ============================================================ */
  grammar: {
    id: "grammar",
    emoji: "🗣️",
    home: { title: "Aaj ki Grammar", subtitle: "Sentence banana seekho" },
    learnTitle: "Aaj hum seekhenge",
    contextEmoji: "🗣️",
    contextText: "3 simple grammar sentences",
    contextSub: "Kab kya bolna hai",
    // Overview video plays with its own audio (sound: true → starts unmuted).
    media: { type: "video", src: "assets/grammar_overview.mp4", badge: "Grammar Practice", sound: true },
    placeholderLabel: "Grammar Practice",
    complete: {
      title: "Grammar Complete",
      message: "Aaj aapne 3 simple sentences seekhe.",
    },
    coinPerStep: 2,
    tasks: [
      {
        id: "present",
        icon: "⏰",
        title: "I am going",
        logLabel: "Present",
        lesson: {
          sentence: { en: "I am going.", hi: "मैं जा रहा हूँ।" },
          audio: "assets/g_present.mp3", // mocked TTS; swap for real audio later
          video: "assets/i_am_going.mp4",
          // Seconds into the video where the voice cues "button dabaye" —
          // the Listen button glows from here to guide taps.
          listenCueTime: 5.3,
          placeholderLabel: "Grammar Practice",
          coinPerStep: 2,
          steps: [
            { type: "listen", chip: "Abhi / Now" },
            { type: "speak" },
            {
              type: "mcq",
              question: "Abhi jaana ho toh kya bolenge?",
              helper: "अभी जाना है",
              options: ["I am going.", "I was going.", "I will go."],
              answer: "I am going.",
            },
          ],
        },
      },
      {
        id: "past",
        icon: "⏪",
        title: "I was going",
        logLabel: "Past",
        lesson: {
          sentence: { en: "I was going.", hi: "मैं जा रहा था।" },
          audio: "assets/g_past.mp3",
          video: "assets/i_was_going.mp4",
          // Seconds into the video where the voice cues "button dabaye" —
          // the Listen button glows from here to guide taps.
          listenCueTime: 5.8,
          placeholderLabel: "Grammar Practice",
          coinPerStep: 2,
          steps: [
            { type: "listen", chip: "Pehle / Past" },
            { type: "speak" },
            {
              type: "mcq",
              question: "Pehle jaana tha toh kya bolenge?",
              helper: "पहले जा रहा था",
              options: ["I am going.", "I was going.", "I will go."],
              answer: "I was going.",
            },
          ],
        },
      },
      {
        id: "future",
        icon: "⏩",
        title: "I will go",
        logLabel: "Future",
        lesson: {
          sentence: { en: "I will go.", hi: "मैं जाऊँगा।" },
          audio: "assets/g_future.mp3",
          video: "assets/i_will_go.mp4",
          // Seconds into the video where the voice cues "button dabaye" —
          // the Listen button glows from here to guide taps.
          listenCueTime: 4.8,
          placeholderLabel: "Grammar Practice",
          coinPerStep: 2,
          steps: [
            { type: "listen", chip: "Baad mein / Future" },
            { type: "speak" },
            {
              type: "mcq",
              question: "Baad mein jaana ho toh kya bolenge?",
              helper: "बाद में जाऊँगा",
              options: ["I am going.", "I was going.", "I will go."],
              answer: "I will go.",
            },
          ],
        },
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

/* Ordered list of lessons shown on Home. A lesson's card appears once
   the previous lesson is complete (Home gates them in sequence). */
window.SpeakX.lessonOrder = ["kirana", "grammar"];
