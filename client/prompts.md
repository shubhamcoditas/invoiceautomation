
### Type Scale
- Hero / Marketing Headline: 40px / 600
- Page Title: 28px / 600
- Section Header: 20px / 600
- Subsection Header: 16px / 600
- Body Text: 14px / 400
- Secondary Text: 13px / 400
- Metadata / Caption: 12px / 400
- Button Text: 14px / 600

Rules:
- No ALL CAPS
- No italics
- No bold paragraphs
- Use weight and spacing—not color—for hierarchy

---

## 3. Spacing & Layout

### Spacing Scale (Use Only These Values)
4, 8, 12, 16, 24, 32, 40, 48, 64
Defaults:
- Page padding: 32px
- Section spacing: 48px
- Card padding: 24px
- Button height: 40–44px

---

## 4. Component Styling Rules

### Buttons
**Primary Button**
- Background: `#D71921`
- Text: `#FFFFFF`
- Hover: `#B3131B`
- Radius: 6px
- No gradients

**Secondary Button**
- White background
- Border: `#D71921`
- Text: `#D71921`

**Text Button**
- Red text only
- Underline on hover

---

### Forms & Inputs
- Height: 42px
- Border: `#CCCCCC`
- Radius: 6px
- Focus border: `#D71921`
- Focus shadow: `0 0 0 2px #FBEAEC`
- Placeholder text: `#888888`

---

### Tables
- No vertical grid lines
- Row divider: `#E6E6E6`
- Header background: `#F2F2F2`
- Row hover: `#FBEAEC`
- Text: `#1A1A1A`
- Status shown as pill badges only

---

### Cards
- Background: `#FFFFFF`
- Border: `#E6E6E6`
- Radius: 8px
- No shadows
- Clear spacing between sections

---

## 5. Navigation & Header

### Header
- Background: `#FFFFFF`
- Divider: `#E6E6E6`
- No shadow
- Height: ~64px

### Navigation Active State
- Red underline (`#D71921`)
- No background blocks
- No bold font

---

## 6. Visual Cleanup Rules

- Remove excessive borders
- Reduce visual clutter
- Replace boxed layouts with spacing
- Avoid competing red elements
- Images should dominate, text should support

---

## 7. Implementation Instructions (VERY IMPORTANT)

Follow this order:
1. Introduce global design tokens (colors, fonts, spacing)
2. Update typography globally
3. Apply background and surface colors
4. Update buttons
5. Update forms
6. Update tables
7. Final consistency pass

After each step:
- Ensure no functional regression
- Ensure visual consistency

---

## 8. Final Acceptance Criteria

The application should:
- Feel premium, confident, and airline-grade
- Clearly reflect Emirates brand authority
- Be modern without losing legacy identity
- Be consistent across all screens
- Remain fully functional

If any component does not map cleanly, choose the **simplest visual solution** that complies with the rules above.
