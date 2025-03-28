import React from 'react'
import Nav from '../src/components/Nav'
import Footer from '../src/components/Footer'
import { useChat } from '../src/store/chat'
import ChatContainer from '../src/components/ChatContainer'
import NoChatSelected from '../src/components/NoChatSelected'
import Sidebar from '../src/components/Sidebar'



function Home() {
  const {selectuser}=useChat()
  return (
    <>
    <Nav/>
    <div className="min-h-screen bg-base-200">
      <div className="flex items-center justify-center pt-8 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectuser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default Home
