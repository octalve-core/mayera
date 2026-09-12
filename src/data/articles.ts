export const articles = [
  {
    slug: "growth-is-only-half-the-story",
    title: "Growth is only half the story",
    excerpt:
      "Why visible length depends on what happens to the strand after it grows.",
    category: "Hair Education",
    readTime: "5 min read",
    body: [
      "Hair growth begins below the surface, but visible length is determined by what happens after the strand emerges. For textured hair, dryness, friction, detangling and repeated manipulation can make retention the harder half of the equation.",
      "That is why Mayéra's first philosophy is not built around promises of impossible speed. It is built around a routine: keep the scalp comfortable, keep the strand lubricated and manageable, and reduce avoidable breakage over time.",
      "Consistency matters more than adding another product every week. A simple routine you can repeat will usually teach you more about your hair than a crowded shelf.",
    ],
  },
  {
    slug: "protective-style-scalp-care",
    title: "A calmer scalp under protective styles",
    excerpt:
      "A simple approach to caring for your scalp while wearing braids and other protective styles.",
    category: "Protective Styles",
    readTime: "4 min read",
    body: [
      "Protective styles can reduce daily manipulation, but they do not remove the need for scalp care. The goal is not to soak the scalp in oil; it is to keep the routine light, comfortable and easy to repeat.",
      "Apply small amounts along accessible parts, massage gently, and pay attention to how the scalp feels. Excess buildup is not the same thing as nourishment.",
      "If a style is painful, excessively tight or causing persistent irritation, product is not the solution. The style itself may need to be adjusted or removed.",
    ],
  },
  {
    slug: "what-coconut-oil-does",
    title: "What coconut oil actually does for hair",
    excerpt:
      "A practical ingredient note for textured hair routines — without miracle claims.",
    category: "Ingredients",
    readTime: "6 min read",
    body: [
      "Coconut oil is one of the better-known hair oils because its fatty-acid profile gives it different behaviour from many surface-only oils. In a cosmetic routine, its job is better described as conditioning and helping reduce the dry, rough feel of hair than as a miracle growth ingredient.",
      "The useful question is not whether an ingredient is trending. It is whether the whole formula has the right balance of slip, weight, stability and sensory experience for the customer using it.",
      "Mayéra's ingredient language will stay deliberately conservative: explain the role, avoid medical promises, and let the complete formula matter more than one hero ingredient.",
    ],
  },
];

export type JournalArticle =
  | (typeof articles)[number]
  | {
      slug: string;
      title: string;
      excerpt: string;
      category: string;
      readTime: string;
      body: string[];
    };
