import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import './App.css'

//подключение апи
const ws_url = 'http://localhost:3000'
const socket = io(ws_url)

type Message = {
  author:string,
  messageText: string,
  date: string
}

function App() {
  //constants
  const [CurrentElement, setCurrentElement] = useState('')
  const [CurrentRoom, setCurrentRoom] = useState('')
  const [User_id, setUser_id] = useState('')
  const [Result, setResult] = useState('')
  const [Messages, setMessages] = useState<Message[]>([])

  //socket.io
  useEffect(()=>{
    socket.on('connect',()=>{
      setUser_id(socket.id)
      console.log('your id:' + socket.id);
    })
    
    //получение сообщений и запись их в стейт
    socket.on('getMessage', (msg)=>{
      let temp:Message[] = Messages.slice()
      temp.push(msg)
      setMessages(temp)
    })

    //получение результата с сервера
    socket.on('send result',(result)=>{
      setResult(result)
      console.log(result);
      
    })

    //перемотка к последним сообщениям
    const messageDiv = document.getElementById('messages')
    messageDiv!.scrollTop = messageDiv!.scrollHeight

    return ()=>{
      socket.off('connect')
    }
  })


  //function
  function copyToClipboard(e:any) {
    navigator.clipboard.writeText(e.target.textContent)
    alert('Copied to clipboard')
  }

  function chooseElement(e:any){
    setCurrentElement(e.target.textContent.toLowerCase())
  }

  function sendElementToServer(){
    //создание объекта чтобы определить кто выйграл
    const playerMove = {
      playerID: socket.id,
      chosenElement: CurrentElement
    }
    socket.emit('player_current_element', playerMove)    
  }

  function joinRoom(e:any) {
    e.preventDefault()
    setMessages([])
    let roomID = e.target[0].value
    socket.emit('join room', roomID)
    setCurrentRoom(roomID)

    e.target[0].value = ''
  }

  function sendMessage(e:any) {
    e.preventDefault()
    let messageText = e.target[0].value

    //создание даты чч:мм:сс
    let formatter = new Intl.DateTimeFormat('ru', {
      hour:'2-digit',
      minute:'2-digit',
      second:'2-digit'
    })
    let date = new Date()

    //создание объекта сообщения
    let tempMSG: Message = {
      author:socket.id,
      messageText: messageText,
      date: formatter.format(date)
    }

    //отправка сообщения на сервер
    if (messageText) {
      // console.log(msg);
      socket.emit('send message', tempMSG)
      e.target[0].value = ''
    }
  }

  const msgArray = Messages.map((item,index)=>{
    return (
      <div key={index} className={`msg ` + index}>
        <div className="msgTop">
          <span className='msgAuthor'>{item.author == socket.id ? 'You' : 'Not You'}</span>
          <span className='msgDate'>{item.date}</span>
        </div>
        <p className='msgText'>{item.messageText}</p>
      </div>
    )
  })

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

        <ul id="messages">{msgArray}</ul>
        <form id="message_form" onSubmit={(e)=>sendMessage(e)}>
          <input id="message_input"></input>
        </form>
      </div>
    
      <div className="field">
        <div className="result_window">
          <h1>{Result}</h1>
        </div>
        <button id="fight_button" onClick={()=>sendElementToServer()}>FIGHT!</button>
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
