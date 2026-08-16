# Search User by Email - Visual Guide

## 🎨 UI States & Flow

### 1️⃣ Initial/Empty State
```
┌─────────────────────────────────────────────────────┐
│  🔍  Search User by Email                           │
│                                                     │
│  Enter an email address to find and view user      │
│  profiles                                           │
│                                                     │
│  ┌───────────────────────────────────┐             │
│  │ 🔍  user@example.com              │  [Search]   │
│  └───────────────────────────────────┘             │
└─────────────────────────────────────────────────────┘

             ┌─────────────────┐
             │                 │
             │       📧        │
             │                 │
             │  Search for     │
             │     Users       │
             │                 │
             │ Enter an email  │
             │   above...      │
             │                 │
             └─────────────────┘
```

### 2️⃣ Loading State
```
┌─────────────────────────────────────────────────────┐
│  🔍  Search User by Email                           │
│                                                     │
│  Enter an email address to find and view user      │
│  profiles                                           │
│                                                     │
│  ┌───────────────────────────────────┐             │
│  │ 🔍  john@example.com         ⏳   │  [Search]   │
│  └───────────────────────────────────┘             │
└─────────────────────────────────────────────────────┘

             Loading user profile...
                      ⏳
```

### 3️⃣ Success State - User Found
```
┌─────────────────────────────────────────────────────────────┐
│  🔍  Search User by Email                                   │
│                                                             │
│  ┌───────────────────────┐                                 │
│  │ 🔍  john@example.com  │  [Search]  [Clear]              │
│  └───────────────────────┘                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════╗ │
│  ║  🌈 Cover Image (Gradient)                           ║ │
│  ║                                                       ║ │
│  ║         ┌───────────┐                                ║ │
│  ║         │   👤      │                                ║ │
│  ║         │  Avatar   │                                ║ │
│  ╚═════════│   Image   │═══════════════════════════════╝ │
│            └───────────┘                                   │
│                                                            │
│  John Doe ✓                    [View Profile] [Message]   │
│  @johndoe                                                  │
│  📧 john@example.com                                       │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 📝 Bio: Software developer and tech enthusiast    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │ 📍 Location:     │  │ 👤 Gender:       │              │
│  │ Damascus, Syria  │  │ Male             │              │
│  └──────────────────┘  └──────────────────┘              │
│                                                            │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │ ✓ Role:          │  │ 📅 Member Since: │              │
│  │ User             │  │ January 2024     │              │
│  └──────────────────┘  └──────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### 4️⃣ No Results State
```
┌─────────────────────────────────────────────────────┐
│  🔍  Search User by Email                           │
│                                                     │
│  ┌───────────────────────────────────┐             │
│  │ 🔍  notfound@example.com          │  [Search]   │
│  └───────────────────────────────────┘  [Clear]    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                                                     │
│                    👤                               │
│                                                     │
│              No User Found                          │
│                                                     │
│    We couldn't find a user with the email          │
│    address "notfound@example.com".                 │
│    Please check the email and try again.           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 5️⃣ Error State
```
┌─────────────────────────────────────────────────────┐
│  🔍  Search User by Email                           │
│                                                     │
│  ┌───────────────────────────────────┐             │
│  │ 🔍  error@example.com             │  [Search]   │
│  └───────────────────────────────────┘  [Clear]    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ⚠️  Search Failed                                  │
│                                                     │
│  Unable to search for user. Please try again.      │
│  [Error details if available]                      │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Component Breakdown

### Header Section
```typescript
<header className="sticky top-0 z-50">
  - Title: "Search User by Email"
  - Subtitle: "Enter an email address..."
  - Search Form:
    - Email Input (with search icon)
    - Search Button
    - Clear Button (conditional)
</header>
```

### Main Content Area
```typescript
<main>
  Case 1: Initial State
    - Empty state illustration
    - Guidance text
  
  Case 2: Loading
    - Spinner animation
  
  Case 3: Error
    - Error banner with icon
    - Error message
  
  Case 4: No Results
    - No user icon
    - "No User Found" message
    - Email display
  
  Case 5: Success
    - User Profile Card
      - Cover section
      - Avatar
      - Name + verification
      - Username
      - Email
      - Bio
      - Details grid
      - Action buttons
</main>
```

---

## 🎨 Design Tokens

### Colors
```css
--primary: #6750A4          /* Primary purple */
--on-primary: #FFFFFF       /* Text on primary */
--surface: #FFFBFE          /* Background surface */
--on-surface: #1C1B1F       /* Text on surface */
--on-surface-variant: #49454F  /* Secondary text */
--error: #B3261E            /* Error red */
--outline-variant: #CAC4D0  /* Border color */
```

### Spacing
```css
--spacing-sm: 0.5rem   (8px)
--spacing-md: 1rem     (16px)
--spacing-lg: 1.5rem   (24px)
--spacing-xl: 2rem     (32px)
```

### Border Radius
```css
--radius-sm: 0.5rem    (8px)
--radius-md: 1rem      (16px)
--radius-lg: 2rem      (32px)
```

### Typography
```css
--font-headline: 'Plus Jakarta Sans', sans-serif
--font-body: 'Inter', sans-serif

--text-xs: 0.75rem     (12px)
--text-sm: 0.875rem    (14px)
--text-base: 1rem      (16px)
--text-lg: 1.125rem    (18px)
--text-xl: 1.25rem     (20px)
--text-2xl: 1.5rem     (24px)
--text-3xl: 1.875rem   (30px)
```

---

## 📱 Responsive Breakpoints

### Mobile (320px - 767px)
```
- Single column layout
- Full-width search input
- Stacked buttons
- Compact profile card
- 16px side padding
```

### Tablet (768px - 1023px)
```
- Two-column profile details
- Larger search input
- Side-by-side buttons
- 24px side padding
```

### Desktop (1024px+)
```
- Centered content (max-width: 1280px)
- Spacious profile card
- Grid layout for details
- 32px side padding
```

---

## ⚡ Animations

### Search Input
```css
transition: all 0.3s ease
focus: ring-2 ring-primary/20
```

### Profile Card Entry
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
```

### Loading Spinner
```css
animation: spin 1s linear infinite
```

### Button Hover
```css
transition: all 0.2s ease
hover: transform scale(1.02)
```

---

## 🖼️ Profile Card Structure

```
┌─────────────────────────────────────────────────┐
│  Cover Section (h-32 md:h-40)                   │
│  Gradient: from-primary/20 to-[#00D4FF]/10     │
│                                                 │
│     Avatar (absolute, -bottom-16)              │
│     ┌─────────────┐                            │
│     │   👤        │                            │
│     │   Photo     │                            │
│     └─────────────┘                            │
├─────────────────────────────────────────────────┤
│  Profile Content (pt-20 px-8 pb-8)            │
│                                                 │
│  Header Row:                                   │
│    - Name (text-2xl md:text-3xl)              │
│    - Verification Badge (if admin)             │
│    - Action Buttons (right aligned)            │
│                                                 │
│  Username: @handle (text-base)                 │
│  Email: 📧 email@example.com (text-sm)        │
│                                                 │
│  Bio Section (if exists):                      │
│  ┌─────────────────────────────────────┐       │
│  │ User's bio text here...             │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  Details Grid (2 columns on md+):              │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ 📍 Location  │  │ 👤 Gender    │           │
│  │ City,Country │  │ Male/Female  │           │
│  └──────────────┘  └──────────────┘           │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ ✓ Role       │  │ 📅 Member    │           │
│  │ User/Admin   │  │ Since Date   │           │
│  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────┘
```

---

## 🔄 User Journey

```
1. User lands on Search page
   ↓
2. Sees empty state with guidance
   ↓
3. Types email address
   ↓
4. Clicks "Search" button
   ↓
5. Sees loading spinner
   ↓
6a. User Found
    → Profile card displays
    → Can view profile or message
    
6b. User Not Found
    → "No User Found" message
    → Can try different email
    
6c. Error Occurred
    → Error message displays
    → Can retry search
   ↓
7. Clicks "Clear" to reset
   ↓
8. Returns to empty state
```

---

## 🎭 Interactive Elements

### Search Button
```
States:
  - Default: Primary purple background
  - Hover: Slightly darker, scale 1.02
  - Disabled: Gray, no hover effect
  - Loading: Shows spinner, disabled
```

### Clear Button
```
States:
  - Default: Ghost style (transparent)
  - Hover: Light background
  - Hidden: When no email entered
```

### Action Buttons
```
View Profile:
  - Primary button
  - Opens user profile page
  
Send Message:
  - Secondary button
  - Opens chat/message interface
```

---

## 📊 Data Flow

```
User Input (Email)
      ↓
useUserSearchByEmail Hook
      ↓
userService.searchByEmail()
      ↓
Axios API Call
      ↓
GET /search-history?q=email&category=users
      ↓
Backend Processing
      ↓
JSON Response
      ↓
normalizeProfile()
      ↓
React Query State Update
      ↓
Component Re-render
      ↓
Display Results
```

---

## 🎨 Glassmorphism Effects

```css
/* Applied to cards and containers */
background: rgba(255, 255, 255, 0.6)
backdrop-filter: blur(12px)
border: 1px solid rgba(255, 255, 255, 0.4)
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)
```

### Layers
```
Layer 1: Background gradient/image
Layer 2: Frosted glass container
Layer 3: Content (text, images, buttons)
```

---

## 🌈 Color Palette

### Primary Colors
```
Purple:     #6750A4  ██████
Cyan:       #00D4FF  ██████
White:      #FFFFFF  ██████
```

### Surface Colors
```
Surface:    #FFFBFE  ██████
Container:  #F3EDF7  ██████
Outline:    #CAC4D0  ██████
```

### Semantic Colors
```
Success:    #00C853  ██████
Warning:    #FFD54F  ██████
Error:      #B3261E  ██████
Info:       #2196F3  ██████
```

---

## ✨ Micro-interactions

1. **Input Focus**
   - Border glows with primary color
   - Smooth transition (300ms)

2. **Button Click**
   - Ripple effect
   - Slight scale down (0.98)
   - Returns to normal (0.2s)

3. **Card Appear**
   - Fades in from opacity 0 to 1
   - Slides up from y: 20 to y: 0
   - Duration: 400ms

4. **Loading Spinner**
   - Continuous rotation
   - Smooth 360° spin
   - 1 second per rotation

---

## 📐 Layout Measurements

### Search Header
```
Height: 160px (mobile), 200px (desktop)
Padding: 24px (mobile), 32px (desktop)
Input Height: 56px
Button Height: 56px
Gap: 12px
```

### Profile Card
```
Max Width: 1000px
Border Radius: 32px
Padding: 32px
Cover Height: 128px (mobile), 160px (desktop)
Avatar Size: 128px
Avatar Offset: -64px (half of avatar)
```

### Details Grid
```
Columns: 1 (mobile), 2 (tablet+)
Gap: 16px
Item Padding: 16px
Item Border Radius: 12px
```

---

## 🎯 Accessibility Features

- ✅ Semantic HTML elements
- ✅ ARIA labels on icons
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Color contrast ratios (WCAG AA)
- ✅ Error announcements
- ✅ Loading states announced

---

This visual guide provides a comprehensive overview of the UI design, layout, and interactive elements of the Search User by Email feature.
