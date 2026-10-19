/**
 * DOSA HOUSE - Theme Configuration
 * Authentic South Indian color palette, fonts, and styling constants.
 */

export const THEME = {
  colors: {
    // Warm Creams
    cream: 0xFFF8EE,
    creamHex: '#FFF8EE',
    creamWarm: 0xFDF4E3,
    creamWarmHex: '#FDF4E3',
    creamDark: 0xF2E4C9,
    creamDarkHex: '#F2E4C9',

    // Turmeric & Mustard
    turmeric: 0xF3A712,
    turmericHex: '#F3A712',
    turmericBright: 0xFFC107,
    turmericBrightHex: '#FFC107',
    turmericGold: 0xE59500,
    turmericGoldHex: '#E59500',
    mustardDark: 0xC67600,
    mustardDarkHex: '#C67600',

    // Terracotta & Brick
    terracotta: 0xC15C3D,
    terracottaHex: '#C15C3D',
    terracottaBright: 0xD96B43,
    terracottaBrightHex: '#D96B43',
    terracottaDark: 0x9E3B20,
    terracottaDarkHex: '#9E3B20',

    // Deep Woods
    teakWood: 0x3D2314,
    teakWoodHex: '#3D2314',
    roseWood: 0x24140B,
    roseWoodHex: '#24140B',
    darkWood: 0x1A0E07,
    darkWoodHex: '#1A0E07',
    lightWood: 0x5C3A21,
    lightWoodHex: '#5C3A21',

    // South Indian Green & Accents
    curryGreen: 0x3E6B48,
    curryGreenHex: '#3E6B48',
    bananaLeafGreen: 0x2E6B34,
    bananaLeafGreenHex: '#2E6B34',
    leafLight: 0x589A50,
    leafLightHex: '#589A50',

    // Traditional Brass & Metals
    brass: 0xD4AF37,
    brassHex: '#D4AF37',
    brassBright: 0xF8D858,
    brassBrightHex: '#F8D858',
    brassDark: 0x99751D,
    brassDarkHex: '#99751D',

    // Coconut & Pure Whites
    coconutWhite: 0xFAFAF7,
    coconutWhiteHex: '#FAFAF7',

    // Translucent overlays
    overlayDark: 0x000000,
    overlayDarkHex: '#000000'
  },

  fonts: {
    title: '"Yatra One", cursive, serif',
    body: '"Outfit", sans-serif',
    display: '"Yatra One", "Outfit", cursive, sans-serif'
  },

  dimensions: {
    width: 1280,
    height: 720
  }
} as const;
