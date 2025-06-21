# RecruitFlow Branding Guide

This document outlines the branding guidelines for RecruitFlow, a comprehensive recruitment management system.

## Logo Usage

### Primary Logo
The RecruitFlow logo features a blue "R" icon combined with the text "RECRUIT Flow" where "RECRUIT" is in bold black letters and "Flow" is in blue script.

### Logo Specifications
- **Sidebar Logo**: Height of 48px (12 in Tailwind units)
- **Mobile Header Logo**: Height of 32px (8 in Tailwind units)
- **Maximum Width**: 200px for sidebar, 150px for mobile
- **Format**: JPG/PNG with transparent background preferred
- **Dark Mode**: Apply brightness filter (110%) for better visibility

### Logo Implementation
```tsx
// Sidebar Implementation
<img 
  src={logoImage} 
  alt="RecruitFlow Logo" 
  className="h-12 w-auto object-contain max-w-[200px] filter dark:brightness-110"
/>

// Mobile Header Implementation
<img 
  src={logoImage} 
  alt="RecruitFlow Logo" 
  className="h-8 w-auto object-contain max-w-[150px] filter dark:brightness-110"
/>
```

## Color Palette

### Primary Colors
- **Blue**: #2563eb (Primary brand color)
- **Dark Blue**: #1d4ed8 (Hover states)
- **Light Blue**: #3b82f6 (Accents)

### Neutral Colors
- **Dark Gray**: #1e293b (Text primary)
- **Medium Gray**: #64748b (Text secondary)
- **Light Gray**: #f1f5f9 (Backgrounds)
- **White**: #ffffff (Cards, content areas)

### Status Colors
- **Success/Hired**: #10b981 (Green)
- **Warning/Pending**: #f59e0b (Orange)
- **Error/Rejected**: #ef4444 (Red)
- **Info/New**: #3b82f6 (Blue)

## Typography

### Headings
- **H1**: text-2xl sm:text-3xl font-bold (Dashboard titles)
- **H2**: text-xl font-semibold (Section headings)
- **H3**: text-lg font-medium (Card titles)

### Body Text
- **Primary**: text-sm sm:text-base (Main content)
- **Secondary**: text-xs sm:text-sm text-muted-foreground (Descriptions)
- **Labels**: text-sm font-medium (Form labels)

## Component Styling

### Cards
```tsx
className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
```

### Buttons
- **Primary**: Blue background with white text
- **Secondary**: White background with blue border
- **Ghost**: Transparent background with colored text

### Status Badges
- **New**: Blue background (#e3f2fd) with blue text (#1976d2)
- **In Progress**: Orange background (#fff3e0) with orange text (#f57c00)
- **Completed**: Green background (#e8f5e8) with green text (#388e3c)
- **Rejected**: Red background (#ffebee) with red text (#d32f2f)

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Sidebar collapses to overlay on mobile
- Logo switches to mobile version in top bar
- Cards stack vertically
- Tables become horizontally scrollable
- Button groups stack on mobile

## Dark Mode Support

### Implementation
- Use CSS custom properties for color variables
- Apply dark mode variants using `dark:` prefix
- Enhance logo visibility with brightness filter
- Maintain proper contrast ratios

### Dark Mode Colors
- **Background**: #0f172a (slate-900)
- **Surface**: #1e293b (slate-800)
- **Border**: #334155 (slate-700)
- **Text Primary**: #f8fafc (slate-50)
- **Text Secondary**: #cbd5e1 (slate-300)

## Accessibility

### Guidelines
- Maintain WCAG 2.1 AA contrast ratios
- Provide alt text for all images including logo
- Use semantic HTML elements
- Support keyboard navigation
- Provide focus indicators

### Logo Accessibility
```tsx
<img 
  src={logoImage} 
  alt="RecruitFlow Logo - Recruitment Management System" 
  role="img"
  className="h-12 w-auto object-contain"
/>
```

## File Organization

### Logo Assets
- Primary logo: `attached_assets/WhatsApp Image 2025-06-21 at 09.27.15_5aa6f227_1750490847834.jpg`
- Import path: `@assets/WhatsApp Image 2025-06-21 at 09.27.15_5aa6f227_1750490847834.jpg`

### Usage Locations
1. **Sidebar**: `client/src/components/layout/sidebar.tsx`
2. **Top Bar**: `client/src/components/layout/top-bar.tsx`
3. **Page Title**: `client/index.html`

## Brand Voice

### Tone
- Professional yet approachable
- Efficient and results-oriented
- Supportive of HR workflows
- Clear and concise communication

### Messaging
- **Tagline**: "Streamline Your Recruitment Process"
- **Value Proposition**: "Comprehensive recruitment management made simple"
- **Key Benefits**: 
  - Organized candidate tracking
  - Streamlined interview scheduling
  - Team collaboration tools
  - Integration capabilities

## Usage Guidelines

### Do's
- Use the logo in its original proportions
- Maintain clear space around the logo
- Use approved color combinations
- Ensure logo visibility in all contexts
- Follow responsive design principles

### Don'ts
- Don't stretch or distort the logo
- Don't use unauthorized color variations
- Don't place logo on busy backgrounds without proper contrast
- Don't use outdated brand names (RecruitOS → RecruitFlow)
- Don't ignore accessibility requirements

This branding guide ensures consistent visual identity across all RecruitFlow applications and materials.