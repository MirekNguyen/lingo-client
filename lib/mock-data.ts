import type { Word, LearnResponse, ReviewResponse } from "./types"

// Mock data for development
const mockCards: Word[] = [
  {
    id: "1",
    english: "mix",
    vietnamese: "trộn",
    frequencyRank: 150,
    isNew: true,
    context: {
      vietnamese: "Bạn có muốn trộn màu không?",
      english: "Do you want to mix colors?",
    },
  },
  {
    id: "2",
    english: "beautiful",
    vietnamese: "đẹp",
    frequencyRank: 85,
    isNew: false,
    context: {
      vietnamese: "Cô ấy rất đẹp.",
      english: "She is very beautiful.",
    },
  },
  {
    id: "3",
    english: "to eat",
    vietnamese: "ăn",
    frequencyRank: 45,
    isNew: true,
    context: {
      vietnamese: "Tôi muốn ăn phở.",
      english: "I want to eat pho.",
    },
  },
  {
    id: "4",
    english: "house",
    vietnamese: "nhà",
    frequencyRank: 30,
    isNew: false,
    context: {
      vietnamese: "Đây là nhà của tôi.",
      english: "This is my house.",
    },
  },
  {
    id: "5",
    english: "to read",
    vietnamese: "đọc",
    frequencyRank: 120,
    isNew: true,
    context: {
      vietnamese: "Tôi thích đọc sách.",
      english: "I like to read books.",
    },
  },
]

let currentCardIndex = 0
const reviewedCards = new Set<string>()

export const mockGetLearnCard = (): Promise<LearnResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (currentCardIndex >= mockCards.length) {
        resolve({
          type: "review",
          message: "All caught up! Great work! 🎉",
        })
      } else {
        const card = mockCards[currentCardIndex]
        resolve({
          type: card.isNew ? "new" : "review",
          card,
        })
      }
    }, 300)
  })
}

export const mockSubmitReview = (cardId: string, userAnswer: string): Promise<ReviewResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const card = mockCards.find((c) => c.id === cardId)
      if (!card) {
        resolve({
          correct: false,
          correctAnswer: "",
          nextReviewDays: 0,
          message: "Card not found",
        })
        return
      }

      // Normalize both strings for comparison (remove accents, lowercase)
      const normalizeVietnamese = (str: string) => {
        return str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim()
      }

      const isCorrect = normalizeVietnamese(userAnswer) === normalizeVietnamese(card.vietnamese)

      if (isCorrect) {
        reviewedCards.add(cardId)
        currentCardIndex++
      }

      resolve({
        correct: isCorrect,
        correctAnswer: card.vietnamese,
        nextReviewDays: isCorrect ? 3 : 0,
        message: isCorrect ? "Correct! 🎉" : `The correct answer is "${card.vietnamese}"`,
      })
    }, 300)
  })
}

// Reset mock state
export const resetMockState = () => {
  currentCardIndex = 0
  reviewedCards.clear()
}
