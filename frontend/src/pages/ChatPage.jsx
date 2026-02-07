import React from 'react'
import { useAuthStore } from '../stores/useAuthStore'

function ChatPage() {
  const {logout} = useAuthStore()
  return (
    <div className='z-10'>ChatPage
      <button onClick={logout} className='btn btn-primary'>logout</button>
    </div>
  )
}

export default ChatPage