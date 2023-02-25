import "react-chat-elements/dist/main.css";
import {
  Typography,
  Stack,
  TextField,
  Grid,
  Container,
  useMediaQuery,
  Card,
  Snackbar,
  Box,
  Button,
  Modal,
  Divider,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../lib/cookie";
import { apiHost, FhirApi } from "./../lib/api";
import { ChatList, MessageList, Input } from "react-chat-elements";
import { AttachFile } from "@mui/icons-material";

export default function Messages() {
  let [threadMode, setThreadMode] = useState(false);
  let [open, setOpen] = useState(false);
  let [openSnackBar, setOpenSnackBar] = useState(false);
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState({});
  let [thread, setThread] = useState([]);
  let [profile, setProfile] = useState();
  let [currentRecipient, setCurrentRecipient] = useState();
  let navigate = useNavigate();
  let [role, setRole] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let [promptMessage, setPromptMessage] = useState();

  const messageListRef = React.createRef();
  const inputRef = React.createRef();

  function snackbar(text) {
    setPromptMessage(text);
    setOpenSnackBar(true);
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 3000);
    return;
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  let getProfile = async () => {
    let _data = await (
      await FhirApi({
        url: `/auth/me`,
      })
    ).data;
    setRole(_data.data.role);
    return _data.data;
  };

  let sendMessage = async () => {
    try {
      if (!message.text) {
        snackbar("Message text is required");
        return;
      }
      let form = new FormData();
      if (message.file) {
        form.append("image", message.file, message.file.name);
      }
      form.append("text", message.text);
      form.append("recipient", currentRecipient);

      let res = await (
        await fetch(`${apiHost}/messaging`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: form,
        })
      ).json();
      snackbar(
        res.status === "success"
          ? "Message sent successfully"
          : "Failed to send message"
      );
      if (res.status === "success") {
        setOpen(false);
        // console.log(res);
        getThread(currentRecipient);
        // console.log(inputRef);
        inputRef.current.clear();
        setMessage({});
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  let getMessages = async () => {
    let profile = await getProfile();
    setProfile(profile);
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
        alt: d.recipientId === profile.id ? d.senderId : d.recipientId,
        title:
          d.recipientId === profile.id ? d.sender.names : d.recipient.names,
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

  let selectFile = async () => {
    var input = document.createElement("input");
    input.type = "file";

    input.onchange = (e) => {
      var file = e.target.files[0];
      // console.log(file);
      handleOpen();
      const reader = new FileReader();
      let imageUrl = reader.readAsDataURL(file);
      console.log(imageUrl);
      reader.onload = function (e) {
        document.getElementById("previewImg").src = e.target.result;
        setMessage({ ...message, video: file });
      };
      // setMessage({ ...message, image: imageUrl });
    };

    input.click();
  };

  let getThread = async (recipientId) => {
    setCurrentRecipient(recipientId);
    let _data = await (
      await FhirApi({
        url: `/messaging/${recipientId}`,
      })
    ).data;
    let _messages = [];
    for (let d of _data.messages) {
      _messages.push({
        date: new Date(d.updatedAt),
        position: recipientId == d.recipientId ? "right" : "left",
        type: d.image ? "photo" : "text",
        text: d.image ? null : d.text,
        title: d.image ? d.text : null,
        data: { uri: d.image, width: 500, height: 250 },
      });
    }
    setThread(_messages);
    return;
  };

  let isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (getCookie("token")) {
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
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackBar}
          onClose={""}
          message={promptMessage}
          key={"loginAlert"}
        />
        {role === "SPECIALIST" &&
          (!threadMode ? (
            <ChatList
              className="chat-list"
              dataSource={messages ? messages : []}
              onClick={(e) => {
                // console.log(e);
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
              <br />
              <Button
                sx={{ borderRadius: "10px", backgroundColor: "green" }}
                variant="contained"
                disableElevation
                onClick={(e) => {
                  getMessages();
                  setThreadMode(false);
                  setThread([]);
                  return;
                }}
              >
                Back to threads
              </Button>
              <p></p>
              <Divider></Divider>
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
              <br />
              <Divider></Divider>
              <Input
                referance={inputRef}
                placeholder="Type here..."
                multiline={true}
                onChange={(e) => {
                  setMessage({ ...message, text: e.target.value });
                }}
                rightButtons={
                  <Button
                    sx={{ backgroundColor: "green" }}
                    disableElevation
                    variant="contained"
                    onClick={(e) => {
                      sendMessage();
                    }}
                  >
                    Send
                  </Button>
                }
                leftButtons={
                  <Button
                    sx={{ color: "green", backgroundColor: "white" }}
                    disableElevation
                    onClick={(e) => {
                      selectFile();
                    }}
                    variant="contained"
                  >
                    <AttachFile />
                  </Button>
                }
              />
            </>
          ))}
        <Modal keepMounted open={open} onClose={handleClose}>
          <Box sx={style}>
            <img id="previewImg" height="300px" src={message.image} />
            <br />
            <TextField
              sx={{ minWidth: "90%" }}
              type="text"
              label="Message"
              placeholder="Message text here ..."
              size="small"
              onChange={(e) => {
                setMessage({ ...message, text: e.target.value });
              }}
            />
            <br />
            <p></p>
            <Button
              sx={{ backgroundColor: "green" }}
              disableElevation
              variant="contained"
              onClick={(e) => {
                sendMessage();
              }}
            >
              Send Message
            </Button>
            <br />
          </Box>
        </Modal>
      </Container>
      <p id="page-bottom"></p>
    </>
  );
}
