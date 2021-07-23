import React from 'react';
import microPhoneIcon from "../assets/mic.png";
import logo from "../assets/logo.svg";
import './App.css';
import { Data, process, speak } from '../controller/core';
import { _getContrastYIQ } from '../util/util';

function App() {
  const [desc, setDesc] = React.useState([]);
  const [status, setStatus] = React.useState("(Taxa de acerto [0/0] : 0.0)");
  const [listen, setListen] = React.useState(false);
  const messagesEndRef = React.useRef(null)

  var recognizer;

  // Test browser support
  window.SpeechRecognition = window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    null;
  //caso não suporte esta API DE VOZ                              
  if (window.SpeechRecognition === null) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  } else {
    recognizer = new window.SpeechRecognition();
    //Para o reconhecedor de voz, não parar de ouvir, mesmo que tenha pausas no usuario
    recognizer.continuous = true
    recognizer.onresult = function (event) {
      for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          setStatus(`(Taxa de acerto [${i}/0] : ${event.results[i][0].confidence} )`);
          process(event.results[i][0].transcript)
          setDesc(event.results[i][0].transcript)
          scrollToBottom();
        }
      }
    }
    recognizer.onend = function (evt) {
      setListen(false);
    }
  }

  const startHandle = () => {
    try {
      if (Data.isNewApp) {
        process("");
      } else if (Data.isOpenApp) {
        speak('Aplicativo aberto. ' + Data.currentApp.name);
      } else {
        speak("Olá, Bem-vindo ao dev assistente")
      }
      // speak("Diga ajuda para saber todas as opções.");
      recognizer.start();
      setListen(true);
    } catch (ex) {
      alert("error: " + ex.message);
    }
  }

  const stopHandle = () => {
    try {
      speak("By by");
      recognizer.abort()
      setListen(false);
    } catch (ex) {
      alert("error: " + ex.message);
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="App">
      <header className="App-header" style={Data.currentApp?.color ? { backgroundColor: Data.currentApp.color } : null}>
        <img src={logo} className="App-logo" alt="logo" />
        <p style={Data.currentApp?.color ? { color: _getContrastYIQ(Data.currentApp.color) } : { color: "#fff" }}>
          {Data.currentApp?.name || "Dev Assistant"}
        </p>
        <div className="panel">
          <span style={{ color: 'black' }}>
            {Data.mode === 0 ? Data.content.map((value) => value) : Data.history.map((value) => value)}
          </span>
          <div ref={messagesEndRef} />
        </div>
        <span className="status">{status}</span>
        {!listen && (
          <div
            className="microphone-icon-container"
            onClick={startHandle}
          >
            <img src={microPhoneIcon} alt="mic" className="microphone-icon" />
          </div>
        )}
        {listen && (
          <div
            className="microphone-icon-container listening"
            onClick={stopHandle}
          >
            <img src={microPhoneIcon} alt="mic" className="microphone-icon" />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
