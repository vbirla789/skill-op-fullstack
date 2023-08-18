import logo from "./logo.svg";
import "./App.css";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { userChats } from "./api/ChatRequest";
import Conversation from "./components/Conversation";
import ChatBox from "./components/ChatBox";
import { io } from "socket.io-client";
import { getUser, loginUser } from "./api/userRequest";

function App() {
  const [userData, setUserData] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [recieveMessage, setRecieveMessage] = useState(null);
  const socket = useRef();

  // GET USER DATA
  useEffect(() => {
    const User = async () => {
      try {
        const { data } = await getUser();

        const userDataResult = data.result;
        setUserData(userDataResult);
        // console.log(userData);
      } catch (error) {
        console.log(error);
      }
    };
    User();
  }, []);

  //send message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    socket.current = io("http://localhost:8800");
    {
      userData && socket.current.emit("new-user-add", userData._id);
    }
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, []);

  //receive message from socket server

  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setRecieveMessage(data);
    });
  }, []);

  useEffect(() => {
    if (userData !== null) {
      const getChats = async () => {
        try {
          const { data } = await userChats(userData._id);

          setChats(data);
          // console.log(data);
        } catch (error) {
          console.log(error);
        }
      };
      getChats();
    }
  }, [userData]);

  // USER LOGIN

  // useEffect(() => {
  //   const User = async () => {
  //     try {
  //       // const { data } = await userChats(user._id);
  //       const { data } = await loginUser({
  //         email: "swaroop@x.com",
  //         password: "swaroop",
  //       });

  //       // console.log(data.result);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   User();
  // }, []);

  return (
    <div class="flex">
      <div class="w-1/4 bg-gray-200 p-4">
        <h2 class="text-lg font-semibold">Chats</h2>
        <div>
          {userData &&
            chats.map((chat) => (
              <div onClick={() => setCurrentChat(chat)}>
                {/*<div> */}
                <Conversation data={chat} currentUser={userData._id} />
              </div>
            ))}
        </div>
      </div>
      <div class="w-3/4 bg-slate-400 p-4">
        {userData && (
          <ChatBox
            chat={currentChat}
            currentUser={userData._id}
            setSendMessage={setSendMessage}
            recieveMessage={recieveMessage}
          />
        )}
      </div>
    </div>
  );
}

export default App;
