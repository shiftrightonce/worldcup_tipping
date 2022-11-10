import confetti from 'canvas-confetti'
const audio = new Audio('/sound/confetti.mp3')

export const useConfetti = () => {
  return () => {
    try {
      const number = Math.floor((Math.random() * 101))
      if (number % 2 === 0) {
        audio.play().then(() => confetti())
      }
    } catch (_) {
      // @todo Not sure what to do here yet
    }
  }
}
