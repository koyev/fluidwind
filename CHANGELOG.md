# Changelog

All notable changes to Fluidwind will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
