import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

export const Chat = ({ socket, userName, channel }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (userName && currentMessage) {
      const info = {
        message: currentMessage,
        channel,
        author: userName,
        time: `${new Date(Date.now()).getHours()}:${new Date(
          Date.now()
        ).getMinutes()}`,
      };

      await socket.emit("send_message", info);
      setMessageList((list) => [...list, info]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const messageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", messageHandler);
    return () => socket.off("receive_message", messageHandler);
  }, [socket]);

  return (
    <div className="bg-gray-100 gap-8 rounded-sm min-h-full w-3/12 mb-4 border-slate-900/10 border flex flex-col p-4">
      <div className="border-b border-slate-900/10 mt-4 mb-4 font-bold text-md text-slate-900">
        <h3 className="text-2xl">Chat en vivo | Sala: {channel}</h3>
      </div>
      <ScrollToBottom>
        <div className=" min-h-80 max-h-80" id="messages">
          {messageList.map((item, i) => (
            <div
              key={i}
              className={`border mb-2 p-2 rounded ${
                item.author === userName
                  ? "text-right bg-blue-300/25"
                  : "text-left bg-yellow-100/35"
              }`}
            >
              <p className="text-lg font-semibold">{item.message}</p>
              <p className="text-sm text-slate-900/65">
                Enviado por <strong>{item.author}</strong> a las {item.time}
              </p>
            </div>
          ))}
        </div>
      </ScrollToBottom>
      <div className="flex justify-between gap-2 border text-lg border-gray-300 p-4 mt-4">
        <input
          className="border border-gray-300 rounded px-4 py-2 w-full"
          type="text"
          placeholder="Ingrese su mensaje"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          type="button"
          className="bg-orange-600 text-white font-bold py-1 px-2 rounded"
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};
