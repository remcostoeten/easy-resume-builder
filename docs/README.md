# Documentation

## Animation Guidelines

📖 **[Full Animation Guidelines](./animation-guidelines.md)**

### Quick Reference

**✅ Prefer CSS for:**
- Hover effects
- Focus states  
- Simple transitions
- Enter/exit animations

**✅ Use Framer Motion for:**
- Complex orchestrated sequences
- Physics-based animations
- Gesture interactions
- Layout animations (FLIP)

**✅ Correct imports:**
```tsx
// Preferred
import { motion } from 'framer-motion/dom'

// Acceptable  
import { m as motion } from 'framer-motion'

// ❌ Blocked by pre-commit hook
import { motion } from 'framer-motion'
```

**✅ Bundle verification:**
```bash
bun run bundle:analyze
```

**✅ Animation check:**
```bash
bun run check:animations
```

### Pre-commit Hook

The project automatically prevents incorrect Framer Motion imports via Husky pre-commit hook. This ensures optimal bundle size through tree-shaking.
