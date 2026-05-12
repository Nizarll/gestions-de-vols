# AirTravel Design System

## Direction & Feel

**Professional aviation interface.** Clean, confident, efficient — like airport wayfinding. The interface should feel structured and trustworthy without being cold. Think terminal architecture, not travel brochures.

**Core metaphor:** Airport operations. Clear signage, organized flow, dual paths (passenger/airline), professional but human.

**Key signature:** The dual-path nature of the product (passengers vs companies) is structural, not decorative. Major UI decisions reflect this split.

---

## Color Palette

### Backgrounds
- **Canvas**: `bg-gray-50` — Main page background
- **Surface**: `bg-white` — Cards, modals, navigation
- **Inset**: `bg-gray-50` — Form inputs (slightly darker than white surface)

### Text Hierarchy
- **Primary**: `text-gray-900` — Headlines, primary text
- **Secondary**: `text-gray-700` — Labels, secondary content
- **Tertiary**: `text-gray-600` — Supporting text, descriptions
- **Muted**: `text-gray-500` — Placeholders, disabled states

### Borders
- **Standard**: `border-gray-200` — Default borders
- **Emphasis**: `border-gray-300` — Hover states
- **Focus**: `border-blue-600` — Active/selected states

### Brand & Semantic
- **Primary**: `bg-blue-600` / `text-blue-600` — Primary actions, active states
- **Primary hover**: `bg-blue-700`
- **Success**: `bg-green-100` / `text-green-800` — Passenger badges, success states
- **Company**: `bg-blue-100` / `text-blue-800` — Company badges
- **Error**: `bg-red-50` / `border-red-200` / `text-red-700` — Error messages

---

## Depth Strategy

**Subtle shadows + borders.** Professional feel with quiet hierarchy.

### Shadows
- **Card**: `shadow-sm` — Default cards, nav elements
- **Elevated**: `shadow-lg` — Selected states, dropdowns (when needed)
- **None on buttons**: Buttons use solid colors, not shadows

### Borders
- Standard: `border border-gray-200`
- All borders 1px unless specified
- Focus rings: `ring-4 ring-blue-600/20` (low opacity for subtlety)

---

## Spacing

**Base unit: 4px** (Tailwind default)

### Common scales
- Micro: `gap-1` (4px) — Icon spacing
- Tight: `gap-2` (8px) — Form labels
- Standard: `gap-4` (16px) — Form fields, grid gaps
- Section: `gap-6` (24px) — Between major sections
- Layout: `gap-8` (32px) — Page sections
- Major: `gap-12` (48px) — Page header to content

### Padding
- Input: `px-4 py-2.5` — Form inputs
- Button: `px-6 py-2.5` (small), `px-4 py-3` (medium)
- Card: `p-6` or `p-8` depending on content importance

---

## Typography

**System fonts** (using Tailwind defaults)

### Scale
- **Headline**: `text-4xl font-bold` — Page titles (36px)
- **Section**: `text-2xl font-bold` — Section headers (24px)
- **Subsection**: `text-lg font-semibold` — Card headers (18px)
- **Body**: `text-base font-medium` — Default (16px)
- **Label**: `text-sm font-medium` — Form labels (14px)
- **Small**: `text-sm` — Supporting text (14px)

### Weight usage
- `font-bold` — Page titles only
- `font-semibold` — Subsection headers, emphasis
- `font-medium` — Buttons, navigation, labels
- `font-normal` — Body text (default)

---

## Border Radius

Consistent roundness for approachable-but-professional feel.

- **Small**: `rounded-md` (6px) — Buttons, badges, toggles
- **Medium**: `rounded-lg` (8px) — Inputs, small cards
- **Large**: `rounded-xl` (12px) — Major cards, modals
- **Full**: `rounded-full` — Icon containers, checkmarks

---

## Component Patterns

### Inputs
```jsx
<input
  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
    text-gray-900 placeholder-gray-500
    focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none
    transition-all"
/>
```
- Inset background (gray-50)
- Transitions to white on focus
- Blue border + ring on focus

### Primary Button
```jsx
<button
  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
    hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20
    disabled:bg-gray-300 disabled:cursor-not-allowed
    transition-all"
/>
```

### Secondary Button (borders)
```jsx
<button
  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg
    hover:bg-gray-50 hover:text-red-600 hover:border-red-200
    transition"
/>
```

### Navigation Button (sidebar)
```jsx
<button
  className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-all ${
    active
      ? 'bg-blue-600 text-white'
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
  }`}
/>
```

### Card
```jsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  {/* content */}
</div>
```
- White background
- Subtle shadow + border
- Generous padding

### Badge/Pill
```jsx
<span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-semibold rounded-md uppercase tracking-wider">
  Passager
</span>
```

### Error Message
```jsx
<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
  {error}
</div>
```

### Icon Container (avatar style)
```jsx
<div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
  <svg className="w-8 h-8 text-blue-600" />
</div>
```

### Toggle/Segmented Control
```jsx
<div className="inline-flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
  <button className={active ? 'bg-gray-900 text-white' : 'text-gray-600'}>Option</button>
</div>
```
- Dark active state (gray-900)
- Light container with border

---

## Layout Patterns

### Page Structure
```jsx
<div className="min-h-screen bg-gray-50">
  <header className="bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-6 py-4">
      {/* header content */}
    </div>
  </header>

  <div className="max-w-7xl mx-auto p-6">
    <div className="grid grid-cols-[240px_1fr] gap-6">
      <nav className="bg-white rounded-xl p-3 shadow-sm">
        {/* navigation */}
      </nav>
      <main className="bg-white rounded-xl p-6 shadow-sm">
        {/* content */}
      </main>
    </div>
  </div>
</div>
```

### Dashboard Header
- White background
- Bottom border only
- Company name or "AirTravel" as headline
- User info + role badge + logout on right
- Max-width container with px-6 py-4

### Sidebar Navigation
- Same background as page (bg-white in card)
- Fixed width: 240px
- Buttons with full-width, left-aligned text
- Active state: blue-600 background

---

## States

### Interactive States (all interactive elements)
- **Default**: Base styles
- **Hover**: Slightly darker background or border color change
- **Focus**: Blue ring (`ring-4 ring-blue-600/20`)
- **Active/Selected**: Blue-600 background
- **Disabled**: Gray-300 background, not-allowed cursor

### Data States
- **Loading**: "Chargement..." text or skeleton
- **Empty**: Centered message with gray text
- **Error**: Red-50 background with red-700 text

---

## Icons

- Use Heroicons (outline style) from Tailwind
- Icon-only containers: Round background (blue-100) with centered icon (blue-600)
- Inline icons: Match text color
- Standard size: `w-5 h-5` for inline, `w-8 h-8` for containers

---

## Motion

- **Transition**: `transition-all` for multi-property changes
- **Duration**: Default (150ms) for most interactions
- **Easing**: Default ease (no custom easing needed)
- **No animations**: Keep it professional, fast, subtle

---

## Principles

1. **Clean over decorative** — Structure beats ornament
2. **Consistent over varied** — Same pattern, every time
3. **Subtle over dramatic** — Whisper-quiet hierarchy
4. **Purposeful color** — Color communicates, doesn't decorate
5. **Split-path architecture** — Passenger/Company distinction is structural
