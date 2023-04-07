import {
  Typography,
  Button,
  Box,
  CardActions,
  Grid,
  Container,
  CardMedia,
  Modal,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Snackbar,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../lib/cookie";
import { apiHost } from "./../lib/api";

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

export default function Posts() {
  function snackbar(text) {
    setPromptMessage(text);
    setOpenSnackBar(true);
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 3000);
    return;
  }
  let [promptMessage, setPromptMessage] = useState();

  let [patients, setPatients] = useState();
  let [openSnackBar, setOpenSnackBar] = useState(false);
  let navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let [media, setMedia] = useState({});
  let [posts, setPosts] = useState([]);
  let [role, setRole] = useState(null);
  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  // fetch dashboard stats
  let getMedia = async () => {
    let data = await (
      await fetch(`${apiHost}/media`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
    ).json();
    setPosts(data.media);
    return;
  };

  //Upload media
  let uploadMedia_ = async () => {
    try {
      if (!media.title || !media.description) {
        snackbar("Title and description are required");
        return;
      }
      let form = new FormData();
      console.log(media.file);
      form.append("video", media.file, media.file.name);
      form.append("title", media.title);
      form.append("description", media.description);

      let res = await (
        await fetch(`${apiHost}/media`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: form,
        })
      ).json();
      snackbar(
        res.status === "success"
          ? "Media uploaded successfully"
          : "Failed to upload media"
      );
      if (res.status === "success") {
        setOpen(false);
        setMedia({ ...media, title: "", video: null, description: "" });
        getMedia();
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  let uploadMedia = async () => {
    try {
      var input = document.createElement("input");
      input.type = "file";
      input.accept = ".mp4";

      input.onchange = (e) => {
        var file = e.target.files[0];
        console.log(file);
        handleOpen();
        const reader = new FileReader();
        let imageUrl = reader.readAsDataURL(file);
        console.log(imageUrl);
        reader.onload = function (e) {
          document.getElementById("previewImg").src = e.target.result;
          setMedia({ ...media, file: file });
        };
        // setMedia({ ...message, image: imageUrl });
      };

      input.click();
    } catch (error) {
      console.log(error);
    }
  };

  let getProfile = async () => {
    let _data = await (
      await fetch(`${apiHost}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
    ).json();
    setRole(_data.data.role);
    if (_data.data.role !== "ADMINISTRATOR") {
      navigate("/");
      return;
    }
    return;
  };

  useEffect(() => {
    if (getCookie("token")) {
      getProfile();
      getMedia();
      return;
    } else {
      navigate("/login");
      window.localStorage.setItem("next_page", "/");
      return;
    }
  }, []);

  return (
    <>
      {/* <br /> */}
      <Container maxWidth="lg">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackBar}
          onClose={""}
          message={promptMessage}
          key={"loginAlert"}
        />
        {role === "ADMINISTRATOR" ? (
          <>
            <Typography variant="p" sx={{ fontSize: "30px" }}>
              Media{" "}
            </Typography>
            <Button
              variant="contained"
              onClick={(e) => {
                uploadMedia();
              }}
              sx={{ backgroundColor: "green", float: "right" }}
            >
              Upload Media
            </Button>
            <Divider />
            <p></p>

            <Modal keepMounted open={open} onClose={handleClose}>
              <Box sx={style}>
                <video
                  id="previewImg"
                  controls
                  height="300px"
                  src={media.image}
                />
                <br />
                <p></p>
                <TextField
                  sx={{ minWidth: "90%" }}
                  type="text"
                  label="Title"
                  placeholder="Video title here ..."
                  size="small"
                  onChange={(e) => {
                    setMedia({ ...media, title: e.target.value });
                  }}
                />
                <p></p>
                {/* <br /> */}
                <TextField
                  sx={{ minWidth: "90%" }}
                  type="text"
                  label="Description"
                  placeholder="Description ..."
                  size="small"
                  onChange={(e) => {
                    setMedia({ ...media, description: e.target.value });
                  }}
                />
                <br />

                <p></p>
                <Button
                  sx={{ backgroundColor: "green" }}
                  disableElevation
                  variant="contained"
                  onClick={(e) => {
                    uploadMedia_();
                  }}
                >
                  Upload
                </Button>
                <br />
              </Box>
            </Modal>
            <Grid container spacing={1} padding=".5em">
              {posts.length > 0 &&
                posts.map((post) => {
                  return (
                    <Grid item xs={12} md={12} lg={4}>
                      <DataCard
                        title={post.title}
                        description={post.description}
                        video={post.video}
                        // image={post.image}
                        postId={post.id}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          </>
        ) : (
          <CircularProgress />
        )}
      </Container>
    </>
  );
}

let DataCard = ({ title, description, video, postId }) => {
  let navigate = useNavigate();

  const [videoUrl, setVideoUrl] = useState(false);
  const handleCloseVideo = () => setOpenVideo(false);
  const handleOpenVideo = (video) => {
    setVideoUrl(video);
    setOpenVideo(true);
  };
  let [openVideo, setOpenVideo] = useState(false);

  // fetch dashboard stats
  let getMedia = async () => {
    let data = await (
      await fetch(`${apiHost}/media`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
    ).json();
    setPosts(data.media);
    return;
  };

  // delete
  let deleteMedia = async (id) => {
    let data = await (
      await fetch(`${apiHost}/media/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
    ).json();
    get;
    return;
  };

  const vidStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    // alignItems:""
  };
  // let processPost = async (postId) => {
  //   let data = await (
  //     await fetch(`${apiHost}/posts/specialist/${postId}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${getCookie("token")}`,
  //       },
  //     })
  //   ).json();
  //   // getMedia();
  //   navigate("/media");
  //   return;
  // };

  return (
    <>
      <Modal keepMounted open={openVideo} onClose={handleCloseVideo}>
        <Box sx={vidStyle}>
          <center>
            <video
              id="previewImg"
              controls
              height="500px"
              src={videoUrl ? videoUrl : ""}
            />
          </center>
        </Box>
      </Modal>
      <Card>
        <CardMedia
          sx={{ height: 180 }}
          component="video"
          video={video}
          src={video}
          title="green iguana"
        />
        <CardContent>
          <Typography
            variant="p"
            sx={{
              wordWrap: "break-word",
              fontSize: "22px",
            }}
          >
            {String(title).substring(0, 37)}
          </Typography>
          <br />
          <Typography
            variant="p"
            sx={{
              wordWrap: "break-word",
            }}
          >
            {String(description).substring(0, 37)}
          </Typography>
          <br />
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="contained"
            disableElevation
            sx={{ backgroundColor: "darkgreen" }}
            onClick={(e) => {
              handleOpenVideo(video);
            }}
          >
            View
          </Button>
          {/* <Button
            size="small"
            variant="contained"
            disableElevation
            sx={{ backgroundColor: "red" }}
            onClick={(e) => {
              console.log(video);
              deleteMedia(postId);
            }}
          >
            Delete
          </Button> */}
        </CardActions>
      </Card>
    </>
  );
};
