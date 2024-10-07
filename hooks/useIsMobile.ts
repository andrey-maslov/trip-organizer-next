import { useState, useEffect } from 'react'

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if the screen width is less than 768px
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check initially when component mounts
    checkIsMobile()

    // Add event listener to update on window resize
    window.addEventListener('resize', checkIsMobile)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, []) // Only runs on mount and unmount

  return isMobile
}
