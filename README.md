# 🦊 Superfox.net - Interactive Kids Learning Platform

A vibrant, 3D-cartoon-inspired educational website for kids aged 5-12, featuring Superfox - a friendly orange fox wearing blue goggles and a blue cape who loves to learn, teach, and play!

## ✨ Features

- **Hero Section**: Animated welcome screen with floating Superfox
- **Learning World**: Interactive modules for Math, Reading, Science, and Creativity
- **Story Library**: Collection of engaging stories with Superfox as the main character
- **Mini-Games**: Educational games with puzzles, counting, and color matching
- **About Superfox**: Learn about our learning hero and his mission
- **Parent Zone**: Information for parents about safety, progress tracking, and educational benefits
- **Gamification**: Stars, badges, and level progression system

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd SuperFox/superfox-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Fonts**: Poppins & Baloo 2 (Google Fonts)

## 📁 Project Structure

```
superfox-app/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles & Tailwind
├── components/
│   ├── HeroSection.tsx
│   ├── LearningWorld.tsx
│   ├── StoryLibrary.tsx
│   ├── MiniGames.tsx
│   ├── AboutSuperfox.tsx
│   ├── ParentZone.tsx
│   └── Footer.tsx
├── public/
│   └── images/          # Superfox assets
└── tailwind.config.ts   # Tailwind configuration
```

## 🎯 Key Components

### HeroSection
- Animated hero with floating particles
- Call-to-action buttons
- Responsive design with wave divider

### LearningWorld
- 4 Interactive learning modules
- Gamified progress tracking
- Hover animations and transitions

### StoryLibrary
- Story categories (Adventure, Friendship, Nature, Science)
- Interactive story cards with play overlays
- Audio narration features

### MiniGames
- Educational game cards
- Player statistics
- Difficulty indicators

### AboutSuperfox
- Character backstory
- Superfox qualities showcase
- Mission statement

### ParentZone
- Safety & security information
- Progress tracking features
- Educational benefits
- Platform statistics

## 🎨 Color Palette

- **Superfox Orange**: `#FF7A3D`
- **Superfox Blue**: `#4A90E2`
- **Superfox Yellow**: `#FFD93D`
- **Superfox Purple**: `#9B6CFF`
- **Superfox Green**: `#6BCF7F`
- **Superfox Pink**: `#FF6B9D`

## 🔧 Customization

### Adding New Images

Place images in the `public/images/` directory and reference them using:
```tsx
<Image src="/images/your-image.png" alt="Description" />
```

### Modifying Colors

Update the color palette in `tailwind.config.ts`:
```ts
colors: {
  'superfox-orange': '#FF7A3D',
  // Add or modify colors
}
```

### Adding Animations

Use Framer Motion for custom animations:
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  Content
</motion.div>
```

## 📱 Responsive Design

The site is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## ♿ Accessibility

- Large, clickable buttons for kids
- Kid-friendly navigation
- High contrast colors
- Screen reader compatible

## 🚀 Future Enhancements

- Backend integration (Firebase/Supabase)
- User authentication
- Progress tracking system
- AI chat assistant
- Voice narration for stories
- Three.js/Spline 3D models
- Daily "Superfox Missions"
- Personalized bedtime stories

## 📄 License

This project is created for educational purposes.

## 🙏 Credits

- Design inspired by Pixar/Disney style
- Fonts: Google Fonts (Poppins, Baloo 2)
- Icons: React Icons
- Animations: Framer Motion

---

Made with ❤️ for curious young minds!
