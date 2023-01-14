import "react-chat-elements/dist/main.css";
import {
  Typography,
  Stack,
  TextField,
  Grid,
  Container,
  useMediaQuery,
  Card,
  CardContent,
  CircularProgress,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as qs from "query-string";
import { getCookie } from "../lib/cookie";
import { apiHost, FhirApi } from "./../lib/api";
import { ChatList, MessageList, Input } from "react-chat-elements";

export default function Messages() {
  let [threadMode, setThreadMode] = useState(false);
  let [messages, setMessages] = useState([]);
  let [thread, setThread] = useState([]);
  let [recipient, setRecipient] = useState();
  let navigate = useNavigate();
  let [data, setData] = useState({});
  let [role, setRole] = useState(null);
  let [facilities, setFacilities] = useState([]);

  const messageListRef = React.createRef();
  const inputRef = React.createRef();

  const fabStyle = {
    position: "absolute",
    bottom: 16,
    right: 16,
  };

  let getProfile = async () => {
    let _data = await (
      await FhirApi({
        url: `/auth/me`,
      })
    ).data;
    setRole(_data.data.role);
    return;
  };

  let getMessages = async () => {
    let _data = await (
      await FhirApi({
        url: `/messaging`,
      })
    ).data;
    // set(_data.data.role);
    // console.log(_data);
    let _messages = [];
    for (let d of _data.threads) {
      _messages.push({
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAYoINhVpkXavV0tKLAccqg0PXm605HeLHB0kOecwcKA&s",
        alt: d.recipientId,
        title: d.recipient.names,
        subtitle: String(d.text).substring(0, 100),
        date: new Date(d.updatedAt),
        unread: d.read ? 1 : 0,
      });
    }
    setMessages(_messages);
    return;
  };

  let scrollToBottom = () => {
    let pageBottom = document.querySelector("#page-bottom");
    if (pageBottom) {
      pageBottom.scrollIntoView();
    }
    return;
  };

  let getThread = async (recipientId) => {
    let _data = await (
      await FhirApi({
        url: `/messaging/${recipientId}`,
      })
    ).data;
    // set(_data.data.role);
    // console.log(_data);
    let _messages = [];
    for (let d of _data.messages) {
      _messages.push({
        date: new Date(d.updatedAt),
        position: recipientId == d.recipientId ? "right" : "left",
        type: "text",
        text: d.text,
      });
    }
    setThread(_messages);
    return;
  };

  let isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (getCookie("token")) {
      getProfile();
      getMessages();
      return;
    } else {
      navigate("/login");
      window.localStorage.setItem("next_page", "/");
      return;
    }
  }, []);

  return (
    <>
      <br />
      <Container maxWidth="lg" className="chatbox">
        {role === "SPECIALIST" &&
          (!threadMode ? (
            <ChatList
              className="chat-list"
              dataSource={messages ? messages : []}
              onClick={(e) => {
                console.log(e);
                setThread([]);
                setThreadMode(true);
                getThread(e.alt);
                setTimeout(() => {
                  scrollToBottom();
                }, 100);
                getMessages();
                return;
              }}
            />
          ) : (
            <>
              <Button
                style={{ borderRadius: "10px" }}
                variant="contained"
                onClick={(e) => {
                  setThreadMode(false);
                  setThread([]);
                  return;
                }}
              >
                Back to threads
              </Button>
              <br />
              <br />
              <br />
              <br />
              <MessageList
                referance={messageListRef}
                className="message-list"
                lockable={true}
                toBottomHeight={"100%"}
                dataSource={thread ? thread : []}
              />
              <br/>
             
            </>
          ))}
      </Container>
      <p id="page-bottom"></p>
    </>
  );
}
