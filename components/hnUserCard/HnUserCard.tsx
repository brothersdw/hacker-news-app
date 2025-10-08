import { useEffect, useState } from "react";
import { api } from "../../api";
import "./hnUserCard.css";

export type HnUserCard = {
  about: string;
  karma: string;
  username: string;
};

const HnUserCard = () => {
  const [userInfo, setUserInfo] = useState<HnUserCard | null>(null);
  const [userName, setUserName] = useState<string>();
  useEffect(() => {
    setUserName(window.location.pathname.split("/").pop());
    const getUserInfo = async () => {
      api.getUser(setUserInfo, userName!);
    };
    getUserInfo();
  }, []);

  const decodeHtml = (encodedTxt: string) => {
    const div = document.createElement("div");
    div.innerHTML = encodedTxt;
    return div.innerHTML;
  };

  if (!userInfo)
    return (
      <div className="user-card-loading">
        <h1>Loading...</h1>
      </div>
    );
  const decoded = decodeHtml(userInfo.about);
  return (
    <div className="hn-user-container">
      <div className="hn-user-card-container">
        <div className="hn-user-card">
          <h1>User: {userInfo.username}</h1>
          <h3>Karma: {userInfo.karma.toLocaleString()}</h3>
          <div className="hn-about-container">
            <h2 className="hn-about-title">About</h2>
            <div
              className="hn-about"
              dangerouslySetInnerHTML={{ __html: decoded! }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HnUserCard;
