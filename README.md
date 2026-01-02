# Language Learning App (Lingvist Clone)

A modern language learning application built with Next.js, React Query, and shadcn/ui.

## Features

- 📚 Spaced repetition learning system
- 🎯 Cloze deletion exercises (fill in the blank)
- ✅ Real-time answer validation
- 🎨 Beautiful, minimalist UI with smooth animations
- 📱 Fully responsive design
- 🔄 Mock API for development (easily switch to real API)

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
# Leave empty or set to "mock" to use mock data
# Set to your API URL (e.g., "http://localhost:3000") to use real API
NEXT_PUBLIC_API_BASE_URL=mock
```

## Architecture

### API Integration

The app is designed to work with both mock data (for development) and real API endpoints (for production).

**To switch from mock to real API:**

1. Set the environment variable:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   ```

2. Your API should implement these endpoints:
   - `GET /learn` - Returns the next card to learn
   - `POST /review` - Submits an answer and returns feedback

### Tech Stack

- **Framework:** Next.js 16 with App Router
- **UI Library:** shadcn/ui with Radix UI primitives
- **Styling:** Tailwind CSS v4
- **State Management:** React Query (TanStack Query)
- **Form Handling:** React Hook Form with Zod validation
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Providers
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── learning-session.tsx # Main learning component
│   ├── providers.tsx       # React Query provider
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── api-config.ts       # API configuration
│   ├── api.ts              # React Query hooks
│   ├── mock-data.ts        # Mock data for development
│   └── utils/
│       └── split-sentence.ts # Sentence splitting utility
```

## API Contract

### Types

```typescript
interface Word {
  id: string;
  english: string;
  vietnamese: string;
  frequencyRank: number;
  isNew: boolean;
  context?: {
    vietnamese: string;
    english: string;
  } | null;
}

interface LearnResponse {
  type: 'new' | 'review';
  card?: Word;
  message?: string;
}

interface ReviewResponse {
  correct: boolean;
  correctAnswer: string;
  nextReviewDays: number;
  message: string;
}
```

### Endpoints

#### GET /learn
Returns the next card for the user to learn.

**Response:**
```json
{
  "type": "new",
  "card": {
    "id": "1",
    "english": "mix",
    "vietnamese": "trộn",
    "frequencyRank": 150,
    "isNew": true,
    "context": {
      "vietnamese": "Bạn có muốn trộn màu không?",
      "english": "Do you want to mix colors?"
    }
  }
}
```

#### POST /review
Submits a user's answer for review.

**Request:**
```json
{
  "cardId": "1",
  "userAnswer": "tron"
}
```

**Response:**
```json
{
  "correct": true,
  "correctAnswer": "trộn",
  "nextReviewDays": 3,
  "message": "Correct! 🎉"
}
```

## Features

- **Accent-insensitive validation:** Users can type without Vietnamese accents (e.g., "tron" instead of "trộn")
- **Case-insensitive matching:** Handles capital letters in sentences
- **Auto-focus:** Input field is automatically focused on card load
- **Keyboard shortcuts:** Press Enter to submit/continue
- **Visual feedback:** Green for correct, red for incorrect with shake animation
- **Progress tracking:** Shows frequency rank and card type (new/review)
- **Session complete screen:** Celebrates when all cards are reviewed

## License

MIT
