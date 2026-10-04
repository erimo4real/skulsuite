export interface NavLink {
  label: string;
  href: string;
}

export const site = {
  name: "SkulSuite",
  tagline: "Digital solutions built for modern schools",
  description:
    "SkulSuite gives schools practical software for daily work: a CBT examination system, a question bank and a school management system. Request a demo for your school.",
} as const;

export const nav: NavLink[] = [
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/pricing" },
  { label: "Offline or Online", href: "/offline" },
  { label: "Resources", href: "/resources" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/** Site-wide CTA labels so wording stays consistent everywhere. */
export const cta = {
  demo: "Request a Demo",
  demoHref: "/demo",
  explore: "Explore Products",
  exploreHref: "/products",
} as const;
