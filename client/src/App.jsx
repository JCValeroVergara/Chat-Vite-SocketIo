
import { faMinus, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import './App.css'
import io from 'socket.io-client'

const socket = io('http://localhost:4000');

function App() {
  
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  
  const handleSubmit = (event) => {
    event.preventDefault()
    socket.emit('message', message)
    const newMessage = {
      body: message,
      from:'Me'
    }
    setMessages([newMessage,...messages])//define el orden de los mensajes
    setMessage('')
  }
  
  useEffect(() => {
    const receiveMessage = message => {
      setMessages([message, ...messages]);
    }
    socket.on('message', receiveMessage)
    
    return () => { 
      socket.off('message', receiveMessage);
    }

  }, [messages]);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full h-10 rounded-md p-2 m-0 focus:outline-none outline-none resize-none -webkit-appearance-none"
          placeholder="Escribe un mensaje..."
          onChange={(event) => setMessage(event.target.value)}
          value={message}
        />
        <button className="bg-codecolor hover:bg-codecolordark text-white font-bold py-2 px-4 rounded">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
      {messages.map((message, index) => (
        <div key={index}>
          
          <div
            id="message_from_student"
            className="flex flex-end justify-end items-center w-full rounded-md p-2 "
          >
            <div className="flex flex-col justify-center items-start bg-blue-100 p-4 rounded-t-md rounded-bl-md max-w-[75%]">
              <strong className="text-blue-500">{'user.fullName'}</strong>
              <div className="flex flex-col justify-center items-center text-left">
                <p className="text-sm text-gray-500">{message.from}</p>
              </div>
            </div>
          </div>
          <div
            id="message_from_tutor"
            className="flex flex-start justify-start items-center w-full  bg-gray-100 rounded-md p-2 "
          >
            <div className="flex flex-col justify-center items-start bg-gray-100 p-4 rounded-t-md rounded-bl-md max-w-[75%]">
              <strong className="text-blue-500">{'tutor.user.fullName'}</strong>
              <div className="flex flex-col justify-center items-center text-left">
                <p className="text-sm text-gray-500">{message.body}.</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App
