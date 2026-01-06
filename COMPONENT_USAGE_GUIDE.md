# Component Usage Guide

## Standardized Component Patterns

This guide documents the standardized usage patterns for all UI components to ensure consistency across the application.

---

## Buttons

### Variant Usage Guidelines

#### Primary Actions (`variant="default"`)
- **Use for**: Main actions, submit buttons, primary CTAs
- **Example**: "Save", "Submit", "Create", "Confirm"
- **Visual**: Solid background with primary color

```tsx
<Button variant="default">Save Changes</Button>
```

#### Secondary Actions (`variant="outline"`)
- **Use for**: Secondary actions, cancel buttons, alternative actions
- **Example**: "Cancel", "Back", "View Details"
- **Visual**: Outlined border, transparent background

```tsx
<Button variant="outline">Cancel</Button>
```

#### Destructive Actions (`variant="destructive"`)
- **Use for**: Delete, remove, destructive operations
- **Example**: "Delete", "Remove", "Clear All"
- **Visual**: Red/destructive color

```tsx
<Button variant="destructive">Delete Item</Button>
```

#### Ghost Actions (`variant="ghost"`)
- **Use for**: Tertiary actions, icon buttons, subtle actions
- **Example**: Navigation items, icon-only buttons, menu items
- **Visual**: No border, transparent background, hover effect

```tsx
<Button variant="ghost" size="icon" aria-label="Edit">
  <Edit className="h-4 w-4" />
</Button>
```

#### Link Actions (`variant="link"`)
- **Use for**: Text links that look like buttons
- **Example**: "Learn more", "View all"
- **Visual**: Text with underline on hover

```tsx
<Button variant="link">Learn More</Button>
```

### Size Guidelines

- **default**: `h-10 px-4 py-2` - Standard buttons
- **sm**: `h-9 px-3` - Small buttons, compact spaces
- **lg**: `h-11 px-8` - Large buttons, prominent CTAs
- **icon**: `h-10 w-10` - Icon-only buttons (minimum 40x40px, 44px recommended for touch)

### Icon Buttons
- Always include `aria-label` for icon-only buttons
- Use `size="icon"` for square icon buttons
- Minimum size: 40x40px (44px recommended for touch targets)

```tsx
<Button variant="ghost" size="icon" aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>
```

---

## Input Components

### Standard Input (`Input`)
- **Height**: `h-10` (40px) - Standard height
- **Padding**: `px-3 py-2` (12px horizontal, 8px vertical)
- **Font**: `text-sm` (14px) with `leading-normal`
- **Border**: `border-2` (2px solid)
- **Focus**: Blue ring with full opacity

```tsx
<Input 
  type="text" 
  placeholder="Enter text"
  className="h-10"
/>
```

### Textarea (`Textarea`)
- **Min Height**: `min-h-[80px]`
- **Padding**: `px-3 py-2`
- **Font**: `text-sm` with `leading-normal`
- **Resize**: `resize-y` (vertical only)

```tsx
<Textarea 
  placeholder="Enter description"
  className="min-h-[80px]"
/>
```

### Select (`Select`)
- **Height**: `h-10` (40px) - Matches Input
- **Padding**: `px-3 py-2`
- **Font**: `text-sm` with `leading-normal`
- **Focus**: Blue ring with full opacity

```tsx
<Select>
  <SelectTrigger className="h-10">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

### Error States
- Add error styling when validation fails
- Show error message below input
- Use red border: `border-red-300 focus:border-red-500`

```tsx
<Input 
  className={cn("h-10", error && "border-red-300 focus:border-red-500")}
/>
{error && (
  <p className="text-xs text-red-600 mt-1">{error}</p>
)}
```

---

## Cards

### Standard Card Structure
- **Padding**: `p-6` (24px) - Standard padding
- **Header Padding**: `p-6 pb-4` (24px horizontal, 16px bottom)
- **Content Padding**: `p-6 pt-0` (24px horizontal, no top padding)
- **Shadow**: `shadow-sm` - Subtle shadow
- **Border**: `border` - Standard border

```tsx
<Card className="p-6">
  <CardHeader className="p-6 pb-4">
    <CardTitle className="text-2xl font-semibold leading-tight">
      Card Title
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground leading-normal">
      Card description
    </CardDescription>
  </CardHeader>
  <CardContent className="p-6 pt-0">
    Card content here
  </CardContent>
</Card>
```

### Card Title
- **Size**: `text-2xl` (24px)
- **Weight**: `font-semibold` (600)
- **Line Height**: `leading-tight` (1.25)

### Card Description
- **Size**: `text-sm` (14px)
- **Color**: `text-muted-foreground`
- **Line Height**: `leading-normal` (1.5)

---

## Tables

### Table Structure
- **Header Height**: `h-12` (48px)
- **Cell Padding**: `p-4` (16px)
- **Header Font**: `text-sm font-semibold leading-tight`
- **Cell Font**: `text-sm leading-normal`
- **Scope**: Always include `scope="col"` or `scope="row"` in headers

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead scope="col">Name</TableHead>
      <TableHead scope="col">Email</TableHead>
      <TableHead scope="col">Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Table Headers
- Always use `scope="col"` for column headers
- Always use `scope="row"` for row headers
- Font: `text-sm font-semibold leading-tight`

### Table Cells
- Font: `text-sm leading-normal`
- Padding: `p-4` (16px)

---

## Forms

### Form Layout
- **Field Gap**: `gap-4` (16px) - Space between form fields
- **Section Gap**: `gap-6` (24px) - Space between form sections
- **Label Position**: Above inputs (standard)
- **Error Position**: Below inputs (standard)

```tsx
<form className="space-y-4">
  <div>
    <Label className="text-sm font-medium leading-normal mb-2 block">
      Field Label
    </Label>
    <Input className="h-10" />
    {error && (
      <p className="text-xs text-red-600 mt-1">{error}</p>
    )}
  </div>
</form>
```

### Form Labels
- **Size**: `text-sm` (14px)
- **Weight**: `font-medium` (500)
- **Line Height**: `leading-normal` (1.5)
- **Margin**: `mb-2` (8px) - Space below label

### Form Inputs
- **Height**: `h-10` (40px) - Standard
- **Font**: `text-sm` with `leading-normal`
- **Spacing**: Use `gap-4` between fields

### Form Sections
- Use `space-y-6` for major sections
- Use `space-y-4` for field groups

---

## Spacing Standards

### Component Spacing
- **Cards**: `p-6` (24px padding)
- **Forms**: `gap-4` (16px between fields)
- **Sections**: `mb-6` (24px between sections)
- **Buttons**: `px-4 py-2` (16px horizontal, 8px vertical)

### Layout Spacing
- **Page Padding**: `p-4` (16px)
- **Section Spacing**: `mb-6` (24px)
- **Card Gap**: `gap-6` (24px)

---

## Typography Standards

### Headings
- **H1**: `text-3xl font-bold leading-tight` - Page titles
- **H2**: `text-2xl font-bold leading-tight` - Section titles
- **H3**: `text-xl font-semibold leading-tight` - Subsection titles
- **H4**: `text-lg font-semibold leading-tight` - Card titles

### Body Text
- **Standard**: `text-base leading-normal` - Body text
- **Small**: `text-sm leading-normal` - Small body text
- **Caption**: `text-xs leading-normal` - Caption text

### Labels
- **Standard**: `text-sm font-medium leading-normal` - Form labels
- **Small**: `text-xs font-medium leading-normal` - Small labels

---

## Accessibility Standards

### ARIA Labels
- All icon-only buttons must have `aria-label`
- All interactive elements should have descriptive labels
- Use `aria-hidden="true"` for decorative icons

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Use `onKeyDown` handlers for custom interactions
- Ensure focus indicators are visible

### Focus States
- All interactive elements must have visible focus rings
- Use `focus-visible:ring-2 focus-visible:ring-primary`
- Ensure sufficient contrast for focus indicators

---

## Best Practices

1. **Consistency**: Always use standardized variants and sizes
2. **Accessibility**: Always include ARIA labels for icon buttons
3. **Spacing**: Use the spacing scale consistently
4. **Typography**: Use standardized font sizes and line heights
5. **Error Handling**: Always show error messages below inputs
6. **Responsive**: Ensure components work on all screen sizes

---

## Migration Checklist

When updating existing components:
- [ ] Use standardized button variants
- [ ] Ensure inputs use `h-10` height
- [ ] Add `leading-normal` or `leading-tight` to all text
- [ ] Standardize card padding to `p-6`
- [ ] Add `scope` attributes to table headers
- [ ] Add `aria-label` to icon buttons
- [ ] Use `gap-4` for form fields
- [ ] Use `gap-6` for sections




