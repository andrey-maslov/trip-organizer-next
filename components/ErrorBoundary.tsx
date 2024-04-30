import React from 'react'

interface Props {
  children?: React.ReactNode
}

type State = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return <div className='p-8 text-center'>Oooops... runtime error...</div>
    }

    // Return children components in case of no error
    return this.props.children
  }
}

export default ErrorBoundary
