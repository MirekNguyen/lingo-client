export interface SentenceContext {
  vietnamese: string // The full sentence, e.g. "Bạn có muốn trộn màu không?"
  english: string // The prompt/meaning, e.g. "Do you want to mix colors?"
}

export interface Word {
  id: string
  english: string // Fallback meaning if no context exists
  vietnamese: string // The target answer (e.g. "trộn")
  frequencyRank: number
  isNew: boolean
  context?: SentenceContext | null
}

export interface LearnResponse {
  type: "new" | "review"
  card?: Word
  message?: string // If session is done: "All caught up!"
}

export interface ReviewRequest {
  cardId: string
  userAnswer: string
  revealed: boolean // true if user clicked "Show Answer", false if answered from memory
}

export interface ReviewResponse {
  correct: boolean
  correctAnswer: string
  nextReviewDays: number
  message: string
}
