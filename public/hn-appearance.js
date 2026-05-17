/**
 * Hand Notes appearance preferences — shared by FOUC script and AppearancePanel.
 */
(function (global) {
  var THEMES = [
    'warm', 'cool', 'dark', 'sepia', 'sage', 'contrast', 'oled',
    'lavender', 'ocean', 'rose', 'mint', 'cream', 'dusk', 'midnight',
  ];
  var FONTS = ['klee', 'caveat', 'patrick', 'kalam', 'legible', 'clear'];
  var BGS = ['lined', 'plain', 'dots', 'minimal'];
  var UIS = ['soft', 'default', 'crisp'];
  var WIDTHS = ['default', 'narrow', 'wide'];

  var DARK_THEMES = ['dark', 'oled', 'dusk', 'midnight'];

  var DEFAULTS = {
    theme: 'warm',
    font: 'klee',
    bg: 'lined',
    ui: 'default',
    custom: {
      contrast: 0,
      bgOpacity: 100,
      textScale: 100,
      lineHeight: 100,
      pageRules: true,
      codeGrid: true,
      hideCover: false,
      autoHideCover: false,
      hideDecor: false,
      focusReading: false,
      warmth: 0,
      letterSpacing: 0,
      contentWidth: 'default',
    },
  };

  function pick(list, value, fallback) {
    return list.indexOf(value) >= 0 ? value : fallback;
  }

  function parseCustom(raw) {
    var base = Object.assign({}, DEFAULTS.custom);
    if (!raw) return base;
    try {
      var parsed = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null) return base;
      if (typeof parsed.contrast === 'number') base.contrast = clamp(parsed.contrast, 0, 100);
      if (typeof parsed.bgOpacity === 'number') base.bgOpacity = clamp(parsed.bgOpacity, 0, 100);
      if (typeof parsed.textScale === 'number') base.textScale = clamp(parsed.textScale, 90, 115);
      if (typeof parsed.lineHeight === 'number') base.lineHeight = clamp(parsed.lineHeight, 90, 110);
      if (typeof parsed.warmth === 'number') base.warmth = clamp(parsed.warmth, 0, 100);
      if (typeof parsed.letterSpacing === 'number') base.letterSpacing = clamp(parsed.letterSpacing, 0, 100);
      if (typeof parsed.pageRules === 'boolean') base.pageRules = parsed.pageRules;
      if (typeof parsed.codeGrid === 'boolean') base.codeGrid = parsed.codeGrid;
      if (typeof parsed.hideCover === 'boolean') base.hideCover = parsed.hideCover;
      if (typeof parsed.autoHideCover === 'boolean') base.autoHideCover = parsed.autoHideCover;
      if (typeof parsed.hideDecor === 'boolean') base.hideDecor = parsed.hideDecor;
      if (typeof parsed.focusReading === 'boolean') base.focusReading = parsed.focusReading;
      if (typeof parsed.contentWidth === 'string') base.contentWidth = pick(WIDTHS, parsed.contentWidth, 'default');
    } catch (e) { /* ignore */ }
    return base;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function isDarkTheme(theme) {
    return DARK_THEMES.indexOf(theme) >= 0;
  }

  function applyCustomVars(el, custom, theme) {
    var textScale = custom.textScale / 100;
    var lineScale = custom.lineHeight / 100;
    if (13.5 * textScale < 13.5) textScale = 1;
    if (18 * textScale < 15) textScale = 15 / 18;

    el.style.setProperty('--hn-text-scale', String(textScale));
    el.style.setProperty('--hn-line-scale', String(lineScale));
    el.style.setProperty('--hn-bg-opacity', String(custom.bgOpacity / 100));
    el.style.setProperty('--hn-page-rules', custom.pageRules ? '1' : '0');
    el.style.setProperty('--hn-code-grid', custom.codeGrid ? '1' : '0');
    el.style.setProperty('--hn-contrast', String(custom.contrast));
    el.style.setProperty('--hn-warmth', String(custom.warmth / 100));
    el.style.setProperty('--hn-letter-spacing', (custom.letterSpacing / 100 * 0.06) + 'em');

    if (custom.pageRules) delete el.dataset.pageRules;
    else el.dataset.pageRules = 'off';

    if (custom.codeGrid) delete el.dataset.codeGrid;
    else el.dataset.codeGrid = 'off';

    if (custom.hideCover) el.dataset.hideCover = 'on';
    else delete el.dataset.hideCover;

    if (custom.autoHideCover) el.dataset.autoHideCover = 'on';
    else {
      delete el.dataset.autoHideCover;
      delete el.dataset.autoHideCoverActive;
    }

    if (custom.hideDecor) el.dataset.hideDecor = 'on';
    else delete el.dataset.hideDecor;

    if (custom.focusReading) el.dataset.focusReading = 'on';
    else delete el.dataset.focusReading;

    el.dataset.contentWidth = custom.contentWidth;

    var mixPct = (custom.contrast / 100) * 35;
    if (isDarkTheme(theme)) {
      el.style.setProperty('--hn-ink-mix', mixPct + '%');
      el.style.setProperty('--hn-paper-mix', (mixPct * 0.6) + '%');
    } else {
      el.style.setProperty('--hn-ink-mix', mixPct + '%');
      el.style.setProperty('--hn-paper-mix', (mixPct * 0.4) + '%');
    }
  }

  function applyAppearancePrefs(opts) {
    var el = opts && opts.root ? opts.root : document.documentElement;
    var theme = pick(THEMES, opts && opts.theme, DEFAULTS.theme);
    var font = pick(FONTS, opts && opts.font, DEFAULTS.font);
    var bg = pick(BGS, opts && opts.bg, DEFAULTS.bg);
    var ui = pick(UIS, opts && opts.ui, DEFAULTS.ui);
    var custom = opts && opts.custom ? opts.custom : DEFAULTS.custom;

    el.dataset.theme = theme;
    el.dataset.font = font;
    el.dataset.bg = bg;
    el.dataset.ui = ui;

    applyCustomVars(el, custom, theme);
    return { theme: theme, font: font, bg: bg, ui: ui, custom: custom };
  }

  function onPageChange(e) {
    var el = document.documentElement;
    if (el.dataset.autoHideCover !== 'on') return;
    var idx = e && e.detail && typeof e.detail.index === 'number' ? e.detail.index : 0;
    if (idx > 0) el.dataset.autoHideCoverActive = 'on';
    else delete el.dataset.autoHideCoverActive;
  }

  function bindPageChangeListener() {
    if (typeof document === 'undefined') return;
    document.addEventListener('hn-page-change', onPageChange);
    var hashMatch = window.location.hash.match(/#page-(\d+)/);
    if (hashMatch) {
      var idx = parseInt(hashMatch[1], 10) - 1;
      onPageChange({ detail: { index: Math.max(0, idx) } });
    }
  }

  function loadFromStorage() {
    var theme = pick(THEMES, localStorage.getItem('hn-theme'), DEFAULTS.theme);
    var font = pick(FONTS, localStorage.getItem('hn-font'), DEFAULTS.font);
    var bg = pick(BGS, localStorage.getItem('hn-bg'), DEFAULTS.bg);
    var ui = pick(UIS, localStorage.getItem('hn-ui'), DEFAULTS.ui);
    var custom = parseCustom(localStorage.getItem('hn-custom'));
    var prefs = applyAppearancePrefs({ theme: theme, font: font, bg: bg, ui: ui, custom: custom });
    bindPageChangeListener();
    return prefs;
  }

  function savePrefs(prefs) {
    localStorage.setItem('hn-theme', prefs.theme);
    localStorage.setItem('hn-font', prefs.font);
    localStorage.setItem('hn-bg', prefs.bg);
    localStorage.setItem('hn-ui', prefs.ui);
    localStorage.setItem('hn-custom', JSON.stringify(prefs.custom));
  }

  function resetPrefs() {
    localStorage.removeItem('hn-custom');
    localStorage.setItem('hn-theme', DEFAULTS.theme);
    localStorage.setItem('hn-font', DEFAULTS.font);
    localStorage.setItem('hn-bg', DEFAULTS.bg);
    localStorage.setItem('hn-ui', DEFAULTS.ui);
    return loadFromStorage();
  }

  function applyReadingPreset(name) {
    var presets = {
      comfort: {
        theme: 'sepia', font: 'legible', bg: 'plain', ui: 'soft',
        custom: {
          contrast: 5, bgOpacity: 40, textScale: 110, lineHeight: 108,
          pageRules: true, codeGrid: true, hideCover: false, autoHideCover: false,
          hideDecor: false, focusReading: false, warmth: 15, letterSpacing: 10,
          contentWidth: 'narrow',
        },
      },
      default: {
        theme: 'warm', font: 'klee', bg: 'lined', ui: 'default',
        custom: Object.assign({}, DEFAULTS.custom),
      },
      compact: {
        theme: 'warm', font: 'klee', bg: 'lined', ui: 'crisp',
        custom: {
          contrast: 0, bgOpacity: 100, textScale: 95, lineHeight: 95,
          pageRules: true, codeGrid: true, hideCover: false, autoHideCover: false,
          hideDecor: false, focusReading: false, warmth: 0, letterSpacing: 0,
          contentWidth: 'default',
        },
      },
      eyeease: {
        theme: 'lavender', font: 'legible', bg: 'minimal', ui: 'soft',
        custom: {
          contrast: 8, bgOpacity: 25, textScale: 112, lineHeight: 110,
          pageRules: false, codeGrid: false, hideCover: false, autoHideCover: true,
          hideDecor: true, focusReading: true, warmth: 20, letterSpacing: 15,
          contentWidth: 'narrow',
        },
      },
      night: {
        theme: 'dusk', font: 'clear', bg: 'plain', ui: 'soft',
        custom: {
          contrast: 10, bgOpacity: 30, textScale: 108, lineHeight: 108,
          pageRules: false, codeGrid: true, hideCover: false, autoHideCover: true,
          hideDecor: true, focusReading: true, warmth: 35, letterSpacing: 8,
          contentWidth: 'narrow',
        },
      },
    };
    return presets[name] || null;
  }

  global.HNAppearance = {
    THEMES: THEMES,
    FONTS: FONTS,
    BGS: BGS,
    UIS: UIS,
    WIDTHS: WIDTHS,
    DARK_THEMES: DARK_THEMES,
    DEFAULTS: DEFAULTS,
    applyAppearancePrefs: applyAppearancePrefs,
    loadFromStorage: loadFromStorage,
    savePrefs: savePrefs,
    resetPrefs: resetPrefs,
    parseCustom: parseCustom,
    applyReadingPreset: applyReadingPreset,
    isDarkTheme: isDarkTheme,
  };

  if (typeof document !== 'undefined') {
    bindPageChangeListener();
  }
})(typeof window !== 'undefined' ? window : globalThis);
