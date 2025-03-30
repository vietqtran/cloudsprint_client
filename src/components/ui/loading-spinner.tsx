import { Ring } from 'ldrs/react'

const LoadingSpinner = () => {
  return (
    <Ring
      size="16"
      stroke="2"
      bgOpacity="0"
      speed="2"
      color="white" 
    />
  )
}

export default LoadingSpinner