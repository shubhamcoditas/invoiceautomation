# Typography & Spacing Guide

## Typography Scale

### Font Sizes
- **xs**: 0.75rem (12px) - Caption, small labels
- **sm**: 0.875rem (14px) - Body small, labels
- **base**: 1rem (16px) - Body text
- **lg**: 1.125rem (18px) - Heading 4
- **xl**: 1.25rem (20px) - Heading 3
- **2xl**: 1.5rem (24px) - Heading 2
- **3xl**: 1.875rem (30px) - Heading 1

### Line Heights
- **tight**: 1.25 - For headings (h1, h2, h3, h4)
- **normal**: 1.5 - For body text, labels, descriptions
- **relaxed**: 1.75 - For long-form content (optional)

### Font Weights
- **normal**: 400 - Body text
- **medium**: 500 - Labels, emphasis
- **semibold**: 600 - Headings (h3, h4), card titles
- **bold**: 700 - Major headings (h1, h2)

## Usage Guidelines

### Headings
```tsx
// H1 - Page titles
<h1 className="text-3xl font-bold leading-tight">Page Title</h1>

// H2 - Section titles
<h2 className="text-2xl font-bold leading-tight">Section Title</h2>

// H3 - Subsection titles
<h3 className="text-xl font-semibold leading-tight">Subsection</h3>

// H4 - Card titles, small headings
<h4 className="text-lg font-semibold leading-tight">Card Title</h4>
```

### Body Text
```tsx
// Standard body text
<p className="text-base leading-normal">Body text content</p>

// Small body text
<p className="text-sm leading-normal">Small body text</p>

// Caption text
<p className="text-xs leading-normal">Caption text</p>
```

### Labels
```tsx
// Form labels
<label className="text-sm font-medium leading-normal">Label</label>

// Small labels
<label className="text-xs font-medium leading-normal">Small Label</label>
```

## Spacing Scale

### Standard Spacing (4px base unit)
- **xs**: 0.25rem (4px) - Tight spacing
- **sm**: 0.5rem (8px) - Small spacing
- **md**: 0.75rem (12px) - Medium spacing
- **lg**: 1rem (16px) - Large spacing (standard)
- **xl**: 1.5rem (24px) - Extra large spacing
- **2xl**: 2rem (32px) - Section spacing
- **3xl**: 3rem (48px) - Major section spacing

### Component Spacing Standards

#### Cards
- **Padding**: `p-6` (24px) - Standard card padding
- **Gap between cards**: `gap-6` (24px)
- **Card header padding**: `p-6` (24px)
- **Card content padding**: `p-6 pt-0` (24px horizontal, 0 top)

#### Forms
- **Field gap**: `gap-4` (16px) - Space between form fields
- **Label margin**: `mb-2` (8px) - Space below labels
- **Input padding**: `px-3 py-2` (12px horizontal, 8px vertical)
- **Input height**: `h-12` (48px) - Standard input height
- **Section gap**: `gap-6` (24px) - Space between form sections

#### Buttons
- **Default padding**: `px-4 py-2` (16px horizontal, 8px vertical)
- **Small padding**: `px-3` (12px horizontal)
- **Large padding**: `px-8` (32px horizontal)
- **Icon button size**: `h-10 w-10` (40x40px minimum, 44px recommended for touch)

#### Sections
- **Section spacing**: `mb-6` (24px) - Space between major sections
- **Subsection spacing**: `mb-4` (16px) - Space between subsections
- **Content padding**: `p-4` (16px) - Standard page content padding

## Usage Examples

### Card Layout
```tsx
<Card className="p-6"> {/* Standard card padding */}
  <CardHeader className="p-6 pb-4"> {/* Header with bottom spacing */}
    <CardTitle className="text-2xl font-semibold leading-tight">
      Card Title
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground leading-normal">
      Card description
    </CardDescription>
  </CardHeader>
  <CardContent className="p-6 pt-0"> {/* Content with no top padding */}
    Content here
  </CardContent>
</Card>
```

### Form Layout
```tsx
<form className="space-y-4"> {/* Standard form field gap */}
  <div>
    <label className="text-sm font-medium leading-normal mb-2 block">
      Field Label
    </label>
    <Input className="h-12" /> {/* Standard input height */}
  </div>
  <div>
    <label className="text-sm font-medium leading-normal mb-2 block">
      Another Field
    </label>
    <Input className="h-12" />
  </div>
</form>
```

### Page Layout
```tsx
<div className="p-4"> {/* Standard page padding */}
  <h1 className="text-3xl font-bold leading-tight mb-6">
    Page Title
  </h1>
  <section className="mb-6"> {/* Section spacing */}
    <h2 className="text-2xl font-bold leading-tight mb-4">
      Section Title
    </h2>
    <p className="text-base leading-normal">
      Content here
    </p>
  </section>
</div>
```

## Migration Notes

When updating existing components:
1. Replace inconsistent font sizes with standardized scale
2. Add `leading-tight` to all headings
3. Add `leading-normal` to all body text and labels
4. Standardize padding to use the spacing scale
5. Use `gap-4` for form fields, `gap-6` for sections
6. Ensure buttons meet minimum 44x44px for touch targets




