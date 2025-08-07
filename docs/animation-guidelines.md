# Animation Guidelines

This document outlines our animation standards and best practices to maintain optimal bundle size and performance.

## CSS-First Approach

### Prefer CSS for Common Animations

Use CSS for basic hover, focus, enter, and exit animations:

```css
/* Hover effects */
.button {
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

/* Focus states */
.input:focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  transition: outline 0.15s ease;
}

/* Enter/exit animations */
.fade-enter {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-exit {
  opacity: 1;
  transform: translateY(0);
}

.fade-exit-active {
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
```

## When Framer Motion is Justified

Use Framer Motion only for complex animations that CSS cannot handle effectively:

- Complex orchestrated sequences
- Physics-based animations
- Gesture-based interactions
- Layout animations with automatic FLIP
- Complex spring animations

### Correct Import Patterns

When Framer Motion is necessary, use these tree-shakeable patterns:

```tsx
// ✅ Preferred - DOM-only build
import { motion } from 'framer-motion/dom'

// ✅ Acceptable - aliased import (tree-shakeable)
import { m as motion } from 'framer-motion'

// ❌ Incorrect - direct import (includes entire library)
import { motion } from 'framer-motion'
```

### Example Usage

```tsx
import { motion } from 'framer-motion/dom'

function ComplexAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      Content with complex animation
    </motion.div>
  )
}
```

## Bundle Impact Verification Checklist

Before adding any animation dependency, verify bundle impact:

### 1. Baseline Measurement
```bash
bun run bundle:analyze
```

### 2. Add Animation Code
Implement your animation solution

### 3. Compare Bundle Size
```bash
bun run bundle:analyze
```

### 4. Evaluation Criteria
- [ ] Bundle size increase is < 5KB gzipped for simple animations
- [ ] Bundle size increase is < 20KB gzipped for complex animations
- [ ] Animation is not achievable with CSS alone
- [ ] Performance benefit justifies bundle cost
- [ ] Using tree-shakeable imports (`framer-motion/dom`)

### 5. Documentation
Document the decision in your PR:
- Why CSS wasn't sufficient
- Bundle size impact
- Performance considerations

## Decision Tree

```
Need animation?
├── Simple hover/focus/transitions?
│   └── Use CSS ✅
├── Complex orchestration/physics?
│   ├── Check bundle impact
│   ├── Use framer-motion/dom
│   └── Document decision ✅
└── Consider if animation is necessary
    └── Sometimes no animation is better ✅
```

## Performance Tips

1. **Use CSS `will-change` sparingly** - only when needed
2. **Prefer `transform` and `opacity`** - they don't trigger layout
3. **Use `animation-fill-mode: both`** - prevents flickering
4. **Consider `prefers-reduced-motion`** - respect user preferences
5. **Test on low-end devices** - ensure animations don't block interaction

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Review Checklist

- [ ] CSS considered first
- [ ] Bundle impact measured
- [ ] Correct import from `framer-motion/dom` if needed
- [ ] Accessibility considered (`prefers-reduced-motion`)
- [ ] Performance tested on target devices
- [ ] Decision documented in PR
