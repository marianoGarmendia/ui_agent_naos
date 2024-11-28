import { useEffect, useState, useRef } from "react";
import SendSVG from "./assets/SendSVG";
import Loading from "./components/Loading";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [messageUser, setMessageUser] = useState("");
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainer = useRef();
  const idUnico = useRef(uuidv4());

  const sendMessage = async () => {
    if (!messageUser) return;
    const UserMessage = {
      role: "ME",
      content: messageUser,
    };
    setMessage((prevMessage) => [...prevMessage, UserMessage]);
    setMessageUser("");

    const response = await fetch("http://localhost:5000/api/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: UserMessage.content,
        threadId: idUnico.current,
      }),
    });
    if (!response.ok) {
      throw new Error("Error al enviar el mensaje");
    }
    const responseAgent = await response.json();

    const AImessage = {
      role: "AI",
      content: responseAgent["message"],
    };

    setMessage((prevMessage) => [...prevMessage, AImessage]);
  };
  const handleInvoke = (e) => {
    e.preventDefault();
    sendMessage(message);
  };

  useEffect(() => {
    if (message.length > 0) {
      if (message[message.length - 1].role === "ME") {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }
  }, [message]);

  function scrollToBottom() {
    chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
  }

  useEffect(() => {
    console.log("message", message);

    scrollToBottom();
  }, [message, loading]);

  const className = {
    ME: "flex-row-reverse self-end",
    AI: "p-2 rounded-md bg-[#2f2f2f]",
    tool_call: "",
  };

  return (
    <main className="w-full h-dvh  text-white flex flex-col justify-center">
      <header className="h-[10%] bg-[#0E0E0E] w-full flex items-center justify-center">
        <img
          className="w-[30px] h-[30px]"
          src="https://naoskingdom.com/cdn/shop/files/Logo6B_80x.png?v=1654830486"
          alt=""
        />
      </header>
      <div className="bg-[#eee] w-full  flex flex-col justify-center items-center h-[90%] border ">
        <form
          onSubmit={handleInvoke}
          className="h-[90%] w-full md:w-3/4 rounded-md bg-[#0E0E0E] flex flex-col justify-between p-2"
        >
          <div
            ref={chatContainer}
            className="  flex flex-col gap-2  w-full overflow-y-scroll scroll_chat box_chat py-2 "
          >
            {message &&
              message.length > 0 &&
              message.map((msg, index) => {
                return (
                  <div
                    key={index}
                    className={twMerge(
                      "flex gap-2 w-fit p-2 ",
                      className[msg.role]
                    )}
                  >
                    <span className="rounded-full h-fit p-[2px] bg-[#eee]">
                      {msg.role === "AI" ? "🤖" : "🐧"}
                    </span>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                );
              })}
            {message.length > 0 && loading && <Loading></Loading>}
          </div>

          <div className="flex items-center bg-[#282828]  border-[#eee]/60 border-[1px] rounded-md p-2">
            <textarea
              rows={1}
              className="bg-[#282828] resize-none flex items-center flex-1 max-h-40   p-2 w-full placeholder:text-opacity-25 inter-300 placeholder:text-[#eee] focus:outline-none"
              type="text"
              placeholder="Quiero saber el precio de..."
              onChange={(e) => {
                setMessageUser(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleInvoke(e);
                }
              }}
              name="messageUser"
              value={messageUser}
            />
            <SendSVG />
          </div>
        </form>
      </div>
    </main>
  );
}

export default App;
