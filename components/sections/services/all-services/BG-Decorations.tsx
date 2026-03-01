import React from 'react'

const BGDecorations = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-150 h-150 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-100 h-100 bg-primary/5 rounded-full blur-3xl" />
      </div>

  )
}

export default BGDecorations