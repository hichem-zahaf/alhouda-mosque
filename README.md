# Al-Houda Mosque

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)
![Zustand](https://img.shields.io/badge/Zustand-5.0-4F5E8?style=flat-square&logo=zustand)

**Mosque Prayer Times Display System**

[Features](#features) • [Installation](#installation) • [Deployment](#deployment) • [How It Works](#how-it-works) • [Usage Guide](#usage-guide) • [Developer Guide](#developer-guide) • [Todos](#todos) • [License](#license)

</div>

---

## Banner

<p align="center">
  <img src="\public\banner.png" alt="Al-Houda Mosque Display" width="100%"/>
</p>

A modern, feature-rich mosque display system built with Next.js 16 (App Router), React 19, and Tailwind CSS v4. The system displays prayer times, quotes, Hijri dates, and provides a beautiful interface for mosque attendees.

---

## Features

- ✨ **Real-time Prayer Times** - Auto-fetched from Aladhan API with intelligent caching
- 🎨 **Dynamic Theme System** - 6 beautiful themes with smooth transitions
- 🖼️ **Custom Background Images** - Support for custom background images with overlay
- 📅 **Hijri Calendar Integration** - Accurate Islamic date from Aladhan API
- 💬 **Rotating Quotes System** - Contextual Islamic quotes with conditional display
- ⚙️ **Comprehensive Settings Panel** - Full control over prayer times, themes, and display
- 🔊 **Adhan & Sound Support** - Audio playback for prayer notifications
- 🌙 **Ramadan & Friday Special Features** - Special greetings and quotes
- 📱 **RTL Arabic Interface** - Beautiful right-to-left Arabic language support
- 🎯 **Manual Time Override** - Set custom prayer times when needed
- 📊 **Visual Prayer Cards** - Interactive cards showing prayer, iqama, and countdown
- 🔄 **Smart Rotation** - Quotes rotate based on text length (3-5 seconds)

---

## How It Works

### Prayer Times System

The prayer times system operates in three modes:

**1. Automatic API Mode (Default)**
- Fetches prayer times from [Aladhan API](https://aladhan.com/prayer-times-api)
- Uses 20 different calculation methods:
  - 0 - Jafari / Shia Ithna-Ashari
  - 1 - University of Islamic Sciences, Karachi
  - 2 - Islamic Society of North America (ISNA)
  - 3 - Muslim World League (MWL)
  - 4 - Umm Al-Qura University, Makkah
  - 5 - Egyptian General Authority of Survey
  - 7 - Institute of Geophysics, University of Tehran
  - 8 - Gulf Region
  - 9 - Kuwait
  - 10 - Qatar
  - 11 - Majlis Ugama Islam Singapura, Singapore
  - 12 - Union Organization islamic de France
  - 13 - Diyanet İşleri Başkanlığı, Turkey
  - 14 - Spiritual Administration of Muslims of Russia
  - 15 - Moonsighting Committee Worldwide
  - 16 - Dubai (experimental)
  - 17 - Jabatan Kemajuan Islam Malaysia (JAKIM)
  - 18 - Tunisia
  - 19 - Algeria
  - 20 - KEMENAG - Indonesia
- Caches data locally based on date and calculation method
- Only refetches when date changes or calculation method is updated

**2. Manual Mode**
- Allows complete override of prayer times
- Perfect for mosques with specific local requirements
- Times persist in local storage

**3. Hybrid Caching**
- Prayer times are cached in browser storage using Zustand persist
- Cache key includes: date + calculation method
- Prevents unnecessary API calls while ensuring accuracy
- Hijri date from API is also cached

### Local Storage System

The application uses Zustand with persist middleware to save:

| Data | Storage Key | Purpose |
|------|-------------|---------|
| Prayer Times | `mosque-prayer-storage` | Cached prayer data with Hijri date |
| Settings | `mosque-settings-storage` | All user preferences |
| Theme | `mosque-theme-storage` | Current theme selection |
| Audio | `mosque-audio-storage` | Volume and mute preferences |

### Theme System

The theme system provides 6 pre-configured themes:

**Light Themes:**
- فاتح 1 - F5F0E8 with #1DCD9F primary
- فاتح 2 - FFF8E7 with #C8A951 primary
- فاتح 3 - FDF6E3 with #268BD2 primary
- فاتح 4 - FAF5EF with #D35400 primary

**Dark Themes:**
- داكن 1 - #1A1A1A with #1DCD9F primary
- داكن 2 - #0D1117 with #58A6FF primary

**Theme Switching:**
- Double-click anywhere on the display to cycle through themes
- Theme preference persists across sessions
- All components respond to theme colors dynamically

### Background Images

**How to use:**
1. Open Settings (gear icon in top-right)
2. Navigate to "إعدادات المظهر" (Theme Settings)
3. Toggle "صورة الخلفية" (Background Image) to enable
4. Browse through images using navigation arrows
5. Select from 9 beautiful Islamic backgrounds
6. Choose the empty card (×) to remove background

**The background image:**
- Covers the entire screen
- Has a 40% dark overlay for text readability
- Includes a gradient overlay for better contrast
- Updates in real-time when selected

---

## Usage Guide

### Opening Settings

**Two ways to access settings:**

1. **Click the gear icon** (⚙️) in the top-right corner
2. **Press `Escape` key** to toggle settings panel

### Adjusting Iqama Time

Iqama time (time between Adhan and actual prayer) can be set for each prayer:

1. Open Settings → "إعدادات الصلوات" (Prayer Settings)
2. Find "مدة الإقامة" (Iqama Duration) section
3. Adjust minutes for each prayer:
   - الفجر (Fajr)
   - الظهر (Dhuhr)
   - العصر (Asr)
   - المغرب (Maghrib)
   - العشاء (Isha)
4. Changes apply immediately to prayer calculations

### Manual Prayer Times Override

To set custom prayer times:

1. Open Settings → "إعدادات الصلوات" (Prayer Settings)
2. Toggle "استخدام أوقات يدوية" (Use Manual Times) to **on**
3. Time input fields will appear for each prayer
4. Click on any time field to open time picker
5. Set your desired times (format: HH:MM)
6. Iqama times are calculated automatically based on your adjustments

**Note:** Manual mode overrides API-calculated times. Re-disable the toggle to return to automatic mode.

### Testing Sounds

1. Open Settings → "إعدادات الصوت" (Sound Settings)
2. Enable "تفعيل الصوت" (Enable Sound)
3. Select sound type: "الأذان الكامل" (Full Adhan) or "إشعار قصير" (Notification)
4. A **"اختبار" (Test)** button appears below the selected sound
5. Click to play/stop the test sound
6. Adjust volume using the slider below

### Changing Calculation Method

1. Open Settings → "إعدادات الصلوات" (Prayer Settings)
2. Find "طريقة الحساب" (Calculation Method) dropdown
3. Select from 20 available methods
4. Prayer times will automatically refetch with the new method

---

## Developer Guide

### Adding Custom Quotes

Quotes are stored in `data/quotes.json`. The file structure:

```json
{
  "general": [
    {
      "id": "unique-id",
      "text": "النص العربي هنا",
      "source": "المصدر",
      "category": "general"
    }
  ],
  "pre-prayer": [...],
  "post-prayer": [...],
  "friday": [...],
  "ramadan": [...]
}
```

**Quote Categories:**
- `general` - General Islamic quotes and Quranic verses
- `pre-prayer` - Quotes shown before prayer time
- `post-prayer` - Quotes shown after prayer time
- `friday` - Special Jumuah (Friday) quotes
- `ramadan` - Ramadan greetings and quotes

**Adding a new quote:**

1. Open `data/quotes.json`
2. Find the appropriate category array
3. Add a new object:
```json
{
  "id": "my-new-quote",
  "text": "بسم الله الرحمن الرحيم",
  "source": "القرآن الكريم",
  "category": "general"
}
```
4. Save the file - quotes will automatically reload

**Conditional Quotes System:**

For context-aware quotes (like special occasions), edit `lib/quotes/conditional-quotes.ts`. Example rule:

```typescript
{
  id: 'eid-al-fitr',
  name: 'عيد الفطر',
  enabled: true,
  priority: 10,
  conditions: [
    { type: 'hijri-month', hijriMonths: [10] }, // Shawwal
    { type: 'day', days: [1] } // First day
  ],
  quote: {
    id: 'eid-mubarak',
    text: 'عيدكم مبارك',
    source: 'تهنئة',
  },
}
```

**Quote Rotation Timing:**

Quotes rotate based on text length:
- Short quotes (< 50 chars): 3 seconds
- Long quotes (≥ 50 chars): 5 seconds

This is configured in `hooks/use-quotes.ts`:

```typescript
function calculateQuoteDuration(quote: Quote): number {
  const textLength = quote.text.length;
  return textLength < 50 ? 3000 : 5000; // milliseconds
}
```

### Prayer Card Customization

Prayer cards in `components/prayer-times/PrayerCard.tsx`:

**Theme on Click:**
- Click any prayer card to toggle its theme
- Alternates between default and emerald theme

**Visual States:**
- **Next Prayer**: Emerald gradient background with glowing shadow
- **Past Prayers**: Greyed out with 50% opacity
- **Current Prayer**: Ring indicator

**Iqama Display:**
Shows as static minutes (e.g., `10'` for 10 minutes) instead of a specific time.

---

## Project Structure

```
alhouda-mosque/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with fonts and background
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── background/          # Background image component
│   ├── center-display/      # Clock, countdown, quotes
│   ├── display-modes/       # Prayer/post/adhan modes
│   ├── prayer-times/        # Prayer cards and displays
│   ├── settings/            # Settings panel components
│   └── ui/                  # shadcn/ui components
├── data/
│   ├── quotes.json          # Islamic quotes database
│   └── settings.json        # Default settings configuration
├── hooks/
│   ├── use-current-time.ts
│   ├── use-hijri-date.ts
│   ├── use-prayer-times.ts  # Prayer times management
│   └── use-quotes.ts        # Quote rotation logic
├── lib/
│   ├── audio/               # Audio player
│   ├── hijri/               # Hijri calendar conversion
│   ├── prayer-times/        # Aladhan API integration
│   ├── quotes/              # Quote management system
│   └── utils/               # Helper functions
├── public/
│   ├── audio/               # Adhan and notification sounds
│   └── images/              # Background images (9 images)
├── store/
│   ├── use-audio-store.ts
│   ├── use-prayer-store.ts # Prayer state management
│   ├── use-settings-store.ts # User preferences
│   └── use-theme-store.ts   # Theme system
└── types/                   # TypeScript type definitions
```

---

## Todos

### High Priority
- [ ] **Mobile Responsive Design** - Optimize for tablets and mobile devices
- [ ] **Dynamic Prayer-Specific Quotes** - Show specific quotes before/after each prayer
- [ ] **Tasbih (Digital Rosary)** - Add dhikr counter feature
- [ ] **Additional Themes** - Expand theme collection with more color schemes

### Medium Priority
- [ ] **Full Screen Modes** - Dedicated minimal display modes
- [ ] **Offline Support** - PWA with service worker for offline functionality
- [ ] **Monthly Data Fetching** - Fetch full month prayer times at once
- [ ] **Long-Lived Session** - Keep prayer display active for extended periods
- [ ] **Multiple Mosque Support** - Manage multiple mosques in one system

### Nice to Have
- [ ] **Mosque Events Calendar** - Display upcoming mosque events
- [ ] **Admin Dashboard** - Web interface for remote management
- [ ] **Notifications System** - Send prayer reminders to registered users
- [ ] **Qibla Compass** - Show direction to Mecca
- [ ] **Donation Box** - QR code for digital donations
- [ ] **Live Stream Integration** - Friday khutbah live streaming

---

## Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Deployment

### Quick Deploy with Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or use the deployment script
./deploy.sh deploy
```

### Deployment Options

| Method | Description | Link |
|--------|-------------|------|
| **Docker** | Containerized deployment with Docker/Docker Compose | [Dockerfile](./Dockerfile) |
| **Vercel** | Zero-config deployment with automatic SSL | [vercel.json](./vercel.json) |
| **Platform.sh** | Managed cloud hosting | [.platform.app.yaml](./.platform.app.yaml) |
| **VPS** | Traditional server deployment with PM2 | [Deployment Guide](./DEPLOYMENT.md) |

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

### Production Checklist

- [ ] Set correct location coordinates
- [ ] Choose appropriate calculation method
- [ ] Configure iqama times
- [ ] Set up SSL/TLS certificate
- [ ] Configure backup strategy
- [ ] Enable monitoring

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Configuration

### Default Settings

The application comes pre-configured with:
- **Location**: Mecca, Saudi Arabia (21.4225°N, 39.8262°E)
- **Calculation Method**: Muslim World League (MWL)
- **Default Iqama Times**: 10 minutes for most prayers, 5 for Maghrib
- **Theme**: Dark theme with emerald accents

### Customization

All settings can be changed through the Settings panel (⚙️):
- Location and coordinates
- Calculation method
- Iqama adjustments
- Manual prayer times
- Sound preferences
- Background images
- Display options

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

**Development Guidelines:**
- Follow the existing code style
- Use TypeScript for all new code
- Add comments for complex logic
- Update documentation as needed
- Test on multiple browsers

---

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the maintainers
- Join our community discussions

---

## Acknowledgments

- **Aladhan API** - For providing accurate prayer times
- **Islamic Services Foundation** - For prayer calculation methods
- **Next.js Team** - For the amazing framework
- **shadcn** - For the beautiful UI components

---

<div align="center">

## Made with ❤️ for Muslims worldwide

*بسم الله الرحمن الرحيم*

قُلْ أَمَرَ رَبِّي بِالْقِسْطِ ۖ وَأَقِيمُوا وُجُوهَكُمْ عِندَ كُلِّ مَسْجِدٍ وَادْعُوهُ مُخْلِصِينَ لَهُ الدِّينَ ۚ كَمَا بَدَأَكُمْ تَعُودُونَ ﴿٢٩ الأعراف﴾

---


<div align="center">

**Al-Houda Mosque Display System**

*Built with modern technology for the Muslim community*

</div>
