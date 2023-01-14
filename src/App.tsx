import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import io from 'socket.io-client'
import './App.css'

const ws_url = 'http://localhost:3000'
const socket = io(ws_url)

function App() {
  //constants
  const [CurrentElement, setCurrentElement] = useState('')
  const [CurrentRoom, setCurrentRoom] = useState('')
  const [User_id, setUser_id] = useState('')

  //socket.io
  useEffect(()=>{
    socket.on('connect',()=>{
      setUser_id(socket.id)
      console.log('your id:' + socket.id);
    })

    return ()=>{
      socket.off('connect')
    }
  })


  //functions
  function copyToClipboard(e:any) {
    navigator.clipboard.writeText(e.target.textContent)
    alert('Copied to clipboard')
  }

  function chooseElement(e:any){
    setCurrentElement(e.target.textContent.toLowerCase())
  }

  function joinRoom(e:any) {
    e.preventDefault()
    let roomID = e.target[0].value
    socket.emit('join room', roomID)
    setCurrentRoom(roomID)

    e.target[0].value = ''
  }

  function sendMessage(e:any) {
    e.preventDefault()
    let messageText = e.target[0].value

    //создание даты чч:мм:сс
    let date = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`

    //создание объекта сообщения
    const msg = {
      author:socket.id,
      messageText: messageText,
      date: date
    }

    //отправка сообщения на сервер
    if (messageText) {
      console.log(msg);
      socket.emit('send message', messageText)
      e.target[0].value = ''
    }
  }

  //render
  return (
    <div className="App">
      <div className="messenger">
        <p>Join room</p>
        <form id="joinRoom" onSubmit={(e)=>joinRoom(e)}>
          <input id="roomID"></input>
        </form>

        <p>Your ID: <span id="user_id" onClick={(e)=>copyToClipboard(e)}>{User_id}</span></p>
        <p>Your room: <span id="current_room" onClick={(e)=>copyToClipboard(e)}>{CurrentRoom}</span></p>

        <ul id="messages"></ul>
        <form id="message_form" onSubmit={(e)=>sendMessage(e)}>
          <input id="message_input"></input>
        </form>
      </div>
    
      <div className="field">
        <button id="fight_button">FIGHT!</button>
        <div id="current_img">
          <img src={`../src/assets/${CurrentElement}.svg`} alt="" />
        </div>
        <div className="choose">
          <button onClick={(e)=>chooseElement(e)} id="rock_button">ROCK</button>
          <button onClick={(e)=>chooseElement(e)} id="paper_button">PAPER</button>
          <button onClick={(e)=>chooseElement(e)} id="scissors_button">SCISSORS</button>
        </div>
      </div>
    </div>
  )
}

export default App
