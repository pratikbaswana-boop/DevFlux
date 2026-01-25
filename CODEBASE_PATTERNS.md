# CODEBASE_PATTERNS.md

## Reference Feature Analyzed
**Landing Page Sections** - Section-based components with animations, responsive design, and consistent styling patterns.

### Key Reference Components
- **HowSimpleIsIt.tsx** - Contains before/after comparison cards, terminal animation, command showcase
- **SetupSection.tsx** - Contains 3-step setup with terminal animation, IDE tabs
- **Hero.tsx** - Contains headline, subheadline, CTA buttons, stats cards
- **Pricing.tsx** - Contains pricing card with features list

## Architecture Pattern

### Section Component Structure
```tsx
export function SectionName() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute ... bg-primary/10 blur-[120px]" />
      
      <div className="container px-4 mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Title <span className="text-primary">Highlight</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Description</p>
        </div>
        
        {/* Content */}
      </div>
    </section>
  );
}
```

### Animation Patterns (Framer Motion)
```tsx
// Fade in on scroll
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: i * 0.1 }}
  viewport={{ once: true }}
>

// Hover effects
<motion.div whileHover={{ y: -5, scale: 1.02 }}>

// Typing cursor animation
<motion.span
  animate={{ opacity: [1, 0] }}
  transition={{ repeat: Infinity, duration: 0.8 }}
  className="inline-block w-2 h-5 bg-primary"
/>
```

### Terminal Component Pattern (from SetupSection)
```tsx
<div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden">
  {/* Header with traffic lights */}
  <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center gap-2">
    <div className="flex gap-1.5">
      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
    </div>
    <span className="text-xs text-gray-500 font-mono ml-4">Terminal</span>
  </div>
  {/* Content */}
  <div className="p-6 font-mono text-sm">...</div>
</div>
```

### Before/After Comparison Pattern (from HowSimpleIsIt)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Before - Red theme */}
  <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/10">
    <h4 className="text-xl font-bold text-red-400 mb-6">Without DevFlux</h4>
    ...
    <p className="text-red-400 font-bold">⏱️ 3 hours of guessing</p>
  </div>
  
  {/* After - Green/Primary theme */}
  <div className="p-8 rounded-2xl bg-primary/5 border border-primary shadow-[0_0_20px_rgba(139,92,246,0.2)]">
    <h4 className="text-xl font-bold text-primary mb-6">With DevFlux</h4>
    ...
    <p className="text-primary font-bold">⏱️ 15 minutes</p>
  </div>
</div>
```

### Command Button Pattern (from HowSimpleIsIt)
```tsx
<button className="px-6 py-3 rounded-full bg-primary/15 border border-primary/40 text-primary font-bold transition-all duration-300 group-hover:bg-primary group-hover:text-white">
  /command-name
</button>
```

## Naming Conventions
- **Components**: PascalCase (e.g., `Hero`, `Pricing`)
- **Section Files**: PascalCase in `sections/` folder
- **CSS Classes**: TailwindCSS utilities
- **Colors**: `text-primary`, `bg-primary/5`, `text-red-400`, `text-green-400`

## Styling Patterns
- **Glass effect**: `glass` or `glass-card` classes, or `bg-white/[0.02] border border-white/5`
- **Primary glow**: `shadow-[0_0_20px_rgba(139,92,246,0.2)]`
- **Section backgrounds**: `bg-black`, `bg-zinc-950/50`, gradients
- **Responsive**: `md:` breakpoint for desktop, mobile-first

## Existing Utilities to Reuse
- `@/components/ui/button` - Button component
- `@/components/BuyNowButton` - Payment trigger button
- `framer-motion` - All animations
- `lucide-react` - Icons

## Files to Modify
1. `Hero.tsx` - Major restructure (add before/after, terminal, remove stats)
2. `Home.tsx` - Reorder sections, remove Problem/ROICalculator
3. `HowSimpleIsIt.tsx` - Extract parts to Hero, simplify or remove
4. `SetupSection.tsx` - Simplify to 3 steps only
5. `Workflows.tsx` - Make expandable with examples

## Files to Delete
- `ROICalculator.tsx` - Remove entirely
- `Problem.tsx` - Remove entirely
