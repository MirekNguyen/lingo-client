"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useLearnCard, useSubmitReview } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Check, X, Sparkles, Trophy, Volume2 } from "lucide-react"
import { splitSentence } from "@/lib/utils/split-sentence"
import { cn } from "@/lib/utils"

type FeedbackState = "idle" | "correct" | "incorrect"

export function LearningSession() {
  const [userAnswer, setUserAnswer] = useState("")
  const [feedbackState, setFeedbackState] = useState<FeedbackState>("idle")
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [hasAttempted, setHasAttempted] = useState(false)
  const [wasRevealed, setWasRevealed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: learnData, isLoading, refetch } = useLearnCard()
  const submitReview = useSubmitReview()

  const currentCard = learnData?.card
  const isNewWord = learnData?.type === "new"

  const speakVietnamese = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "vi-VN"
    utterance.rate = 0.8
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    if (currentCard && feedbackState === "idle") {
      inputRef.current?.focus()
    }
  }, [currentCard, feedbackState])

  const handleSubmit = async () => {
    if (!currentCard || !userAnswer.trim()) return

    const result = await submitReview.mutateAsync({
      cardId: currentCard.id,
      userAnswer: userAnswer, // Send raw answer without sanitization
      revealed: wasRevealed,
    })

    setCorrectAnswer(result.correctAnswer)
    setHasAttempted(true)

    if (result.correct) {
      setFeedbackState("correct")
      setShowCorrectAnswer(true)
      setTimeout(() => {
        resetAndFetchNext()
      }, 1500)
    } else {
      setFeedbackState("incorrect")
      setShowCorrectAnswer(true)
    }
  }

  const handleLearnWord = () => {
    if (!currentCard) return
    setShowCorrectAnswer(true)
    setCorrectAnswer(currentCard.vietnamese)
    setWasRevealed(true)
  }

  const handleSkip = () => {
    resetAndFetchNext()
  }

  const handleTryAgain = () => {
    setUserAnswer("")
    setFeedbackState("idle")
    inputRef.current?.focus() // Keep correct answer visible when trying again
  }

  const resetAndFetchNext = () => {
    setUserAnswer("")
    setFeedbackState("idle")
    setShowCorrectAnswer(false)
    setCorrectAnswer("")
    setHasAttempted(false)
    setWasRevealed(false)
    refetch()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (feedbackState === "idle") {
        handleSubmit()
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your lesson...</p>
        </div>
      </div>
    )
  }

  if (learnData?.message && !currentCard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
          <p className="text-muted-foreground mb-6">{learnData.message}</p>
          <Button onClick={() => refetch()} className="w-full">
            Start New Session
          </Button>
        </Card>
      </div>
    )
  }

  if (!currentCard) {
    return null
  }

  const [beforeEng, targetEng, afterEng] = currentCard.context
    ? splitSentence(currentCard.context.english, currentCard.english)
    : ["", currentCard.english, ""]

  const [beforeVie, targetVie, afterVie] = currentCard.context
    ? splitSentence(currentCard.context.vietnamese, currentCard.vietnamese)
    : ["", currentCard.vietnamese, ""]

  const inputWidth = Math.max(userAnswer.length * 16 + 32, targetVie.length * 16 + 32, 100)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="max-w-3xl w-full p-8 md:p-12">
        <div className="flex items-center justify-center mb-6">
          {isNewWord ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              New Word
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm font-medium">
              Review
            </span>
          )}
        </div>

        <div className="text-center mb-4">
          <p className="text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-400">{currentCard.english}</p>
        </div>

        {currentCard.context && (
          <div className="text-center mb-8">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{currentCard.context.english}</p>
          </div>
        )}

        <div className="flex items-center justify-center mb-8 min-h-[120px]">
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="text-2xl md:text-3xl text-muted-foreground text-center leading-relaxed flex flex-wrap items-center justify-center gap-2">
              {beforeVie && <span>{beforeVie}</span>}
              <div className="relative inline-block">
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={feedbackState !== "idle"}
                  style={{ width: `${inputWidth}px` }}
                  className={cn(
                    "border-b-4 bg-transparent outline-none text-center transition-all duration-300 px-2 text-foreground",
                    feedbackState === "idle" && "border-blue-500 focus:border-blue-600",
                    feedbackState === "correct" && "border-green-500 text-green-600 dark:text-green-400",
                    feedbackState === "incorrect" && "border-red-500 text-red-600 dark:text-red-400 animate-shake",
                  )}
                  placeholder="___"
                />
                {showCorrectAnswer && feedbackState === "idle" && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap">
                    {correctAnswer}
                  </div>
                )}
              </div>
              {afterVie && <span>{afterVie}</span>}
            </div>

            {currentCard.context && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speakVietnamese(currentCard.context!.vietnamese)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {feedbackState === "correct" && (
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-6">
            <Check className="h-5 w-5" />
            <p className="font-medium">Correct! Well done!</p>
          </div>
        )}

        {feedbackState === "incorrect" && (
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 mb-2">
              <X className="h-5 w-5" />
              <p className="font-medium">Try again!</p>
            </div>
            <p className="text-muted-foreground text-sm">Look at the correct answer above and type it yourself</p>
          </div>
        )}

        {showCorrectAnswer && (
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{currentCard.vietnamese}</span>
                {" = "}
                {currentCard.english}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speakVietnamese(currentCard.vietnamese)}
                className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {feedbackState === "idle" && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!userAnswer.trim() || submitReview.isPending}
              size="lg"
              className="min-w-[160px]"
            >
              {submitReview.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "Check Answer"
              )}
            </Button>
            <Button onClick={handleLearnWord} variant="outline" size="lg" className="min-w-[160px] bg-transparent">
              Learn this word
            </Button>
          </div>
        )}

        {feedbackState === "incorrect" && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleTryAgain} size="lg" className="min-w-[160px]">
              Try Again
            </Button>
            <Button onClick={handleSkip} variant="outline" size="lg" className="min-w-[160px] bg-transparent">
              Skip for now
            </Button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span>Frequency rank: #{currentCard.frequencyRank}</span>
          <span>Press Enter to submit</span>
        </div>
      </Card>
    </div>
  )
}
