import { create } from 'zustand'

interface FeedState {
  activeDilemmaId: string | null
  dailyVotesUsed: number
  setActiveDilemma: (id: string | null) => void
  incrementDailyVotes: () => void
  resetDailyVotes: () => void
}

export const useFeedStore = create<FeedState>((set) => ({
  activeDilemmaId: null,
  dailyVotesUsed: 0,
  setActiveDilemma: (id) => set({ activeDilemmaId: id }),
  incrementDailyVotes: () =>
    set((state) => ({ dailyVotesUsed: state.dailyVotesUsed + 1 })),
  resetDailyVotes: () => set({ dailyVotesUsed: 0 }),
}))
