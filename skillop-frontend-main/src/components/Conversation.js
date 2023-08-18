import React, { useEffect, useState } from "react";
import { findUser } from "../api/userRequest";

const Conversation = ({ data, currentUser }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const otherUserId = data.members.find((id) => id !== currentUser);

    const getUserData = async () => {
      try {
        const { data } = await findUser(otherUserId);
        setUserData(data.result);
        // console.log(data.result);
      } catch (e) {
        console.log(e);
      }
    };
    getUserData();
  }, []);
  return (
    <div>
      {userData && (
        <div className="bg-slate-400 p-2 rounded-md">
          <h1>
            {userData.firstname} <span> {userData.lastname}</span>
          </h1>
        </div>
      )}
    </div>
  );
};

export default Conversation;
