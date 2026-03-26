# Changelog

All notable changes to Fluidwind will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-03-26

### Added

- **Semantic Scales** — define named fluid values once in `theme.fluidwind` and reference them by key instead of repeating pixel ranges in every class. Eight scale keys are supported: `fontSize`, `spacing`, `padding`, `margin`, `gap`, `sizing`, `borderWidth`, and `borderRadius`. More specific keys (e.g. `padding`) take precedence over the shared `spacing` key for their utility group.

  ```js
  // tailwind.config.js
  theme: {
    fluidwind: {
      fontSize: { md: ["16px", "24px"], xl: ["28px", "48px"] },
      spacing:  { sm: ["8px", "16px"],  lg: ["24px", "64px"] },
    },
  }
  ```

  ```html
  <!-- instead of fw-text-[16px-24px] fw-p-[24px-64px] -->
  <h1 class="fw-text-md fw-p-lg">Named scale keys</h1>
  ```

  Arbitrary `[min-max]` values continue to work alongside named keys — nothing is removed or replaced.

---

## [1.1.1] - 2026-03-21

### Fixed

- Color interpolation (`fw-bg-[color1-color2]`, `fw-text-[color1-color2]`) now generates valid CSS. The previous `clamp(0%, Xvw + Y%, 100%)` expression mixed `<length>` (`vw`) with `<percentage>` in a context where only pure `<percentage>` is valid, causing browsers to reject the declaration. The percentage is now expressed as `calc(clamp(0, 100 * (wMax - tan(atan2(100vw, 1px))) / range, 100) * 1%)`, which is type-safe and has the same browser support floor as `color-mix()`.

---

## [1.1.0] - 2026-03-17

### Added

- First-class `tailwind-merge` integration via a new `fluidwind/tailwind-merge` entry point. Export `withFluidwind()` and pass it to `extendTailwindMerge()` to teach tailwind-merge about all `fw-*` utility prefixes so they correctly conflict with — and override — their standard Tailwind counterparts.
- Local development sandbox (`pnpm sandbox`) — an Astro project that builds and installs the current source as a tarball, starts a dev server, then restores to the published npm version on exit.

---

## [1.0.0] - 2026-03-06

### Added

- `fw-{utility}-[{min}-{max}]` syntax for all supported utilities
- Unit normalization - mix and match `px`, `rem`, `vw`, `%`, and unitless values freely
- CSS `clamp()` generation with slope/intercept math; output in `rem` for accessibility
- Color interpolation via `color-mix(in srgb, ...)` for `fw-bg-*` and `fw-text-*`
- Negative value support (`fw-mt-[-20px--60px]`)
- Named viewport ranges via `theme.fluidwind.ranges` config
- Inline viewport range override (`/[400-1200]` modifier syntax)
- `plugin.withOptions` export enabling `remBase` configuration
- `remBase` resolution order: plugin option → `theme("fluidwind.remBase")` → 16
- Full TypeScript types exported from the package entry point
- Supported utilities: `text`, `p`, `px`, `py`, `pt`, `pb`, `pl`, `pr`, `m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr`, `w`, `h`, `min-w`, `max-w`, `min-h`, `max-h`, `gap`, `gap-x`, `gap-y`, `border`, `rounded`, `bg`
- Tailwind CSS v3 and v4 peer dependency support

---

<!-- Template for future releases:

## [X.Y.Z] - YYYY-MM-DD

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

-->
