export interface HowItWorksStep {
  title: string;
  description: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    title: "Choose a solution",
    description:
      "Pick the product that solves your school's most pressing problem — CBT, the Question Bank or School Management. Many schools start with one and add the rest later.",
  },
  {
    title: "Request a demo",
    description:
      "Fill in the demo form or send us a WhatsApp message. We'll schedule a walkthrough at a time that suits your school.",
  },
  {
    title: "Set up your school",
    description:
      "We help you configure the system around your school — classes, subjects, sessions, students and staff.",
  },
  {
    title: "Train your staff",
    description:
      "Your teachers and administrators get hands-on training so everyone is confident using the system from the first week.",
  },
  {
    title: "Start using the system",
    description:
      "Run your school digitally from day one, with support on WhatsApp and email whenever you need it.",
  },
];

export const demoExpectations = [
  {
    title: "A walkthrough, not a sales pitch",
    description:
      "We show you the actual product screens and how the work flows — exactly what your staff will use.",
  },
  {
    title: "Tailored to your school",
    description:
      "Tell us your school's size and setup, and we'll focus on what matters to you.",
  },
  {
    title: "Clear pricing, no pressure",
    description:
      "You'll get a straightforward package proposal based on your school's needs.",
  },
] as const;
