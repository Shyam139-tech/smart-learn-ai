export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export type Analysis = {
  topic: string;
  summary: { title: string; body: string }[];
  flow: { label: string; detail: string }[];
  quiz: QuizQuestion[];
  latencyMs: number;
};

export const mockAnalysis: Analysis = {
  topic: "Photosynthesis — Light & Dark Reactions",
  summary: [
    {
      title: "Energy capture",
      body: "Chlorophyll in the thylakoid membrane absorbs photons, exciting electrons that drive the electron transport chain.",
    },
    {
      title: "ATP & NADPH",
      body: "Photolysis splits water into O₂, protons and electrons; the proton gradient powers ATP synthase to make ATP and NADPH.",
    },
    {
      title: "Carbon fixation",
      body: "The Calvin cycle uses ATP and NADPH in the stroma to fix CO₂ via RuBisCO into glucose precursors (G3P).",
    },
  ],
  flow: [
    { label: "Sunlight", detail: "Photons hit photosystem II" },
    { label: "Light reaction", detail: "Water split → O₂ + e⁻ + H⁺" },
    { label: "Electron chain", detail: "Proton gradient across thylakoid" },
    { label: "ATP + NADPH", detail: "Chemical energy carriers" },
    { label: "Calvin cycle", detail: "CO₂ fixed by RuBisCO" },
    { label: "Glucose", detail: "G3P → sugars stored" },
  ],
  quiz: [
    {
      question: "Where do the light-dependent reactions take place?",
      options: ["Stroma", "Thylakoid membrane", "Mitochondrial matrix"],
      answer: 1,
      explain: "Photosystems sit inside the thylakoid membrane of the chloroplast.",
    },
    {
      question: "Which molecule is split to release oxygen?",
      options: ["Carbon dioxide", "Glucose", "Water"],
      answer: 2,
      explain: "Photolysis of water releases O₂, protons and electrons.",
    },
    {
      question: "What does the Calvin cycle directly produce?",
      options: ["G3P", "Oxygen", "Chlorophyll"],
      answer: 0,
      explain: "The Calvin cycle fixes CO₂ into G3P, the precursor to sugars.",
    },
  ],
  latencyMs: 120,
};
