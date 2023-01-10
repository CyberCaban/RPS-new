import { useState } from 'react'
import { Socket } from 'socket.io'
import './App.css'

function App() {
  const [CurrentElement, setCurrentElement] = useState('')
  // Socket = io()

  function copyToClipboard(e:any) {
    navigator.clipboard.writeText(e.target.textContent)
    alert('Copied to clipboard')
  }

  function chooseElement(e:any){
    setCurrentElement(e.target.textContent.toLowerCase())
  }

  return (
    <div className="App">
      <div className="messenger">
                <p>Join room</p>
                <form id="joinRoom">
                    <input id="roomID"></input>
                </form>
        
                <p>Your ID: <span id="user_id" onClick={(e)=>copyToClipboard(e)}>fsfsefsefsef</span></p>
                <p>Your room: <span id="current_room" onClick={(e)=>copyToClipboard(e)}></span></p>
        
                <ul id="messages"></ul>
                <form id="message_form"><input id="message_input"></input></form>
            </div>
    
            <div className="field">
                <button id="fight_button">FIGHT!</button>
                <div id="current_img">
                    <img src={`../src/assets/${CurrentElement}.png`} alt="" />
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
