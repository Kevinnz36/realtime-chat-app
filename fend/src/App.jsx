import { useState } from "react";
import io from "socket.io-client";
import "./App.css";
import { Chat } from "./components/Chat";

const serverUrl = "https://realtime-chat-app-lqae.onrender.com";
const socket = io.connect(serverUrl);

function App() {
  const [userName, setUserName] = useState("");
  const [channel, setChannel] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinChannel = () => {
    if (userName !== "" && channel !== "") {
      socket.emit("join_channel", channel);
      setShowChat(true);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col mt-16 gap-2">
      {!showChat ? (
        <div className="  bg-slate-100 border-2 pt-8 pb-12 border-slate-900/10 p-2 w-2/6 min-h-80 shadow-xl flex flex-col justify-center items-center gap-8 rounded-sm text-slate-800">
          <h3 className="text-3xl font-bold">Unirse al chat</h3>
          <input
            className="bg-slate-700/10 h-12 w-5/6 border-2 rounded-sm border-slate-900/30 pl-1 text-lg text-slate-900"
            type="text"
            placeholder="Nombre de usuario"
            onChange={(e) => setUserName(e.target.value)}
          />

          <input
            className="bg-slate-700/10 h-12 w-5/6 border-2 text-lg rounded-sm border-slate-900/30 pl-1 text-slate-900"
            type="text"
            placeholder="Nombre de sala"
            onChange={(e) => setChannel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                joinChannel();
              }
            }}
          />
          <button
            className="bg-orange-500 text-white h-12 w-5/6 py-1 font-semibold text-xl rounded-sm border-orange-500 hover:bg-orange-800/90 transition-all"
            onClick={joinChannel}
          >
            Unirse
          </button>
        </div>
      ) : (
        <Chat socket={socket} userName={userName} channel={channel} />
      )}
    </div>
  );
}

export default App;
