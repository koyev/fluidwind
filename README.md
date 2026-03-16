<h1 align="center">Fluidwind 🍃
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/fluidwind"><img src="https://img.shields.io/npm/v/fluidwind?color=0ea5e9&label=npm" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/fluidwind"><img src="https://img.shields.io/npm/dm/fluidwind?color=0ea5e9" alt="npm downloads" /></a>
  <a href="https://github.com/koyev/fluidwind/actions"><img src="https://img.shields.io/github/actions/workflow/status/koyev/fluidwind/ci.yml?branch=main&label=tests" alt="CI status" /></a>
  <a href="https://github.com/koyev/fluidwind/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/fluidwind?color=0ea5e9" alt="license" /></a>
  <a href="https://www.npmjs.com/package/fluidwind"><img src="https://img.shields.io/node/v/fluidwind?color=0ea5e9" alt="node version" /></a>
  <img src="https://img.shields.io/badge/tailwindcss-%5E3.0%20%7C%7C%20%5E4.0-0ea5e9" alt="tailwindcss version" />
</p>

<p align="center">
  A Tailwind CSS plugin that replaces stair-step breakpoints with smooth, mathematically perfect fluid scaling using CSS <code>clamp()</code>.
</p>

---

## Why Fluidwind?

Standard Tailwind uses **adaptive** design: values jump at fixed breakpoints (`sm:`, `md:`, `lg:`). Fluidwind uses **fluid** design: values scale linearly between any two viewport widths with zero JavaScript at runtime.

```html
<!-- Before: 3 classes, 2 hard jumps -->
<h1 class="text-2xl md:text-4xl lg:text-6xl">Hello</h1>

<!-- After: 1 class, perfectly smooth -->
<h1 class="fw-text-[24px-60px]">Hello</h1>
```

The CSS output is a single `clamp()` declaration:

```css
font-size: clamp(1.5rem, 3.38vw + 0.77rem, 3.75rem);
```

---

## Installation

```bash
npm install fluidwind
```

Add the plugin to your Tailwind config:

```js
// tailwind.config.js
module.exports = {
  plugins: [require("fluidwind")],
};
```

With a custom `remBase` (if your root font-size is not 16px):

```js
plugins: [require("fluidwind")({ remBase: 10 })],
```

---

## Configuration

```js
// tailwind.config.js
module.exports = {
  plugins: [require("fluidwind")],
  theme: {
    fluidwind: {
      // Default viewport range (used when no modifier is provided)
      defaultRange: ["375px", "1440px"],

      // Named ranges - reference them with the /name modifier
      ranges: {
        post: ["600px", "1000px"],
        wide: ["1024px", "1920px"],
      },
    },
  },
};
```

---

## Syntax

```
fw-{utility}-[{minValue}-{maxValue}]/{range}
```

| Part            | Description                               | Example                |
| --------------- | ----------------------------------------- | ---------------------- |
| `fw-`           | Required prefix                           | `fw-`                  |
| `{utility}`     | Any supported utility name                | `text`, `p`, `bg`      |
| `[{min}-{max}]` | Fluid range in any supported unit         | `[16px-32px]`          |
| `/{range}`      | Optional - named or inline viewport range | `/post`, `/[400-1200]` |

---

## Usage Examples

### Typography

```html
<!-- font-size: clamp(1rem, 1.5vw + ..., 2rem) -->
<h1 class="fw-text-[16px-32px]">Fluid Heading</h1>

<!-- Using rem units -->
<p class="fw-text-[1rem-1.5rem]">Fluid Body</p>
```

### Spacing

```html
<!-- padding -->
<section class="fw-p-[16px-64px]">...</section>

<!-- margin, shorthand and per-side -->
<div class="fw-mt-[8px-32px] fw-px-[16px-48px]">...</div>
```

### Sizing

```html
<div class="fw-w-[200px-800px] fw-h-[100px-400px]">...</div>
```

### Negative Values

```html
<!-- Fluid negative margin for overlapping layouts -->
<div class="fw-mt-[-20px--60px]">...</div>
```

### Color Interpolation

Smoothly transition between two colors as the viewport grows:

```html
<!-- background shifts from red → blue -->
<div class="fw-bg-[#ff0000-#0000ff]">...</div>

<!-- text shifts from black → white -->
<span class="fw-text-[#000000-#ffffff]">...</span>
```

Generated CSS:

```css
background-color: color-mix(
  in srgb,
  #ff0000 clamp(0%, -9.39vw + 135.21%, 100%),
  #0000ff
);
```

### Range Modifiers

```html
<!-- Named range from config -->
<p class="fw-text-[16px-24px]/post">Post body text</p>

<!-- Inline viewport range -->
<p class="fw-text-[16px-24px]/[400-1200]">Custom range</p>
```

### With Tailwind Breakpoints

Fluidwind utilities compose with standard Tailwind breakpoints:

```html
<p class="fw-text-[14px-18px] lg:fw-text-[18px-28px]">...</p>
```

### With tailwind-merge

Install [`tailwind-merge`](https://github.com/dcastil/tailwind-merge) and wrap your setup with `withFluidwind()` so `fw-*` classes correctly conflict with — and override — standard Tailwind classes (and vice-versa):

```ts
import { extendTailwindMerge } from 'tailwind-merge'
import { withFluidwind } from 'fluidwind/tailwind-merge'

export const twMerge = extendTailwindMerge(withFluidwind())

// twMerge('p-4 fw-p-[1rem-2rem]')            → 'fw-p-[1rem-2rem]'
// twMerge('text-sm fw-text-[16px-32px]')     → 'fw-text-[16px-32px]'
// twMerge('fw-gap-[4px-16px] gap-8')         → 'gap-8'
// twMerge('fw-p-[4px-8px] fw-p-[8px-16px]') → 'fw-p-[8px-16px]'
```

`tailwind-merge` is an optional peer dependency — only needed if you use class merging.

---

## Supported Utilities

| Category   | Utilities                                                             |
| ---------- | --------------------------------------------------------------------- |
| Typography | `fw-text-*`                                                           |
| Padding    | `fw-p-*` `fw-px-*` `fw-py-*` `fw-pt-*` `fw-pb-*` `fw-pl-*` `fw-pr-*`  |
| Margin     | `fw-m-*` `fw-mx-*` `fw-my-*` `fw-mt-*` `fw-mb-*` `fw-ml-*` `fw-mr-*`  |
| Sizing     | `fw-w-*` `fw-h-*` `fw-min-w-*` `fw-max-w-*` `fw-min-h-*` `fw-max-h-*` |
| Layout     | `fw-gap-*` `fw-gap-x-*` `fw-gap-y-*`                                  |
| Decoration | `fw-border-*` `fw-rounded-*`                                          |
| Color      | `fw-bg-*` `fw-text-*`                                                 |

### Supported Units

Values can be expressed in any combination of: `px`, `rem`, `vw`, `%`, or unitless (treated as `px`).

```html
<div class="fw-p-[10px-2rem]">Mix and match units</div>
```

---

## The Math

```
slope     = (vMax - vMin) / (wMax - wMin)
intercept = vMin - slope * wMin
output    = clamp(vMin_rem, slope×100vw + intercept_rem, vMax_rem)
```

All math runs in `px` internally; CSS output uses `rem` for accessibility (respects user font-size preferences).

---

## Browser Support

All fluid numeric utilities rely on `clamp()` - supported in all modern browsers since 2020.

Color interpolation (`fw-bg-*`, `fw-text-*` with hex values) uses `color-mix()`:

| Chrome | Firefox | Safari | Edge |
| :----: | :-----: | :----: | :--: |
|  111+  |  113+   | 16.2+  | 111+ |

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions and guidelines.

---

Made with ❤️ by [koyev](https://github.com/koyev)
