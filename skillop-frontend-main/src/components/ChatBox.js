import React, { useEffect, useState } from "react";
import { addMessage, getMessages } from "../api/MessageRequest";
import { format } from "timeago.js";
import { findUser } from "../api/userRequest";

const ChatBox = ({ chat, currentUser, setSendMessage, recieveMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const otherUserId = chat?.members?.find((id) => id !== currentUser);

    const getUserData = async () => {
      try {
        const { data } = await findUser(otherUserId);
        setUserData(data.result);
      } catch (e) {
        console.log(e);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  useEffect(() => {
    if (recieveMessage !== null && recieveMessage.chatId === chat._id) {
      setMessages([...messages, recieveMessage]);
    }
  }, [recieveMessage]);

  const handleChange = (event) => {
    const newMessageValue = event.target.value;
    setNewMessage(newMessageValue);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
      // chatId: "64db7e1e8bb983fa766a79a5",
    };

    // send message to database

    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (e) {
      console.log(e);
    }

    // send message to socket server
    const receiverId = chat.members.find((id) => id !== currentUser);

    setSendMessage({ ...message, receiverId });
  };

  //fetching data for messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        console.log(data);
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
    if (chat !== null) fetchMessages();
  }, [chat]);
  return (
    <div>
      <h1>ChatBox</h1>
      {userData && (
        <p>
          {userData.firstname} <span>{userData.lastname}</span>
        </p>
      )}
      <div>
        <div>
          {messages &&
            messages.map((message) => (
              <div className="">
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
        </div>
      </div>
      <div>
        <input value={newMessage} onChange={handleChange} />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
