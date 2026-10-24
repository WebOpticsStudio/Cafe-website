/** Single source of truth for Firestore collection / document names. */
export const COLLECTIONS = {
  menuCategories: 'menuCategories',
  menuItems: 'menuItems',
  settings: 'settings',
} as const;

export const SETTINGS_DOCS = {
  hours: 'hours',
} as const;

/** Storage prefixes (must match storage.rules). */
export const STORAGE_PATHS = {
  menuImages: 'menu',
} as const;
