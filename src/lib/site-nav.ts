export const NAV_ORDER = ["/", "/about", "/features", "/departments", "/rules", "/store"] as const;

export type NavPath = (typeof NAV_ORDER)[number];

export const NAV_KEYS = {
  "/": "home",
  "/about": "about",
  "/features": "features",
  "/departments": "departments",
  "/rules": "rules",
  "/store": "store",
} as const;
