import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient, USE_MOCK } from "./api-config"
import { mockGetLearnCard, mockSubmitReview } from "./mock-data"
import type { LearnResponse, ReviewRequest, ReviewResponse } from "./types"

// API functions
const fetchLearnCard = async (): Promise<LearnResponse> => {
  if (USE_MOCK) {
    return mockGetLearnCard()
  }
  const { data } = await apiClient.get<LearnResponse>("/learn")
  return data
}

const submitReview = async ({ cardId, userAnswer, revealed }: ReviewRequest): Promise<ReviewResponse> => {
  if (USE_MOCK) {
    return mockSubmitReview(cardId, userAnswer)
  }
  const { data } = await apiClient.post<ReviewResponse>("/review", { cardId, userAnswer, revealed })
  return data
}

// React Query hooks
export const useLearnCard = () => {
  return useQuery({
    queryKey: ["learn-card"],
    queryFn: fetchLearnCard,
    retry: 1,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })
}

export const useSubmitReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      // Invalidate and refetch learn card after successful review
      queryClient.invalidateQueries({ queryKey: ["learn-card"] })
    },
  })
}
