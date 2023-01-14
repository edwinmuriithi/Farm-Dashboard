import {
  Typography,
  Button,
  CardActions,
  Grid,
  Container,
  CardMedia,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../lib/cookie";
import { apiHost } from "./../lib/api";

export default function Posts() {
  let [patients, setPatients] = useState();
  let navigate = useNavigate();
  let [data, setData] = useState({});
  let [posts, setPosts] = useState([]);
  let [role, setRole] = useState(null);
  let [facilities, setFacilities] = useState([]);

  // fetch dashboard stats
  let getPosts = async () => {
    let data = await (
      await fetch(`${apiHost}/posts/specialist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
    ).json();
    setPosts(data.posts);
    return;
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
    if (_data.data.role !== "SPECIALIST") {
      navigate("/");
      return;
    }
    return;
  };

  useEffect(() => {
    if (getCookie("token")) {
      getProfile();
      getPosts();
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
        {role === "SPECIALIST" ? (
          <>
            <Typography variant="h5">Welcome </Typography>
            <Grid container spacing={1} padding=".5em">
              {posts.length > 0 &&
                posts.map((post) => {
                  console.log(post);
                  return (
                    <Grid item xs={12} md={12} lg={4}>
                      <DataCard
                        text={post.description}
                        image={post.image}
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

let DataCard = ({ text, image, postId }) => {
  let navigate = useNavigate();

  let processPost = async (postId) => {
    let data = await (
      await fetch(`${apiHost}/posts/specialist/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
    ).json();
    // getPosts();
    navigate("/messaging");
    return;
  };

  return (
    <>
      <Card>
        <CardMedia sx={{ height: 180 }} image={image} title="green iguana" />
        <CardContent>
          <Typography
            variant="p"
            sx={{
              wordWrap: "break-word"
            }}
          >
            {String(text).substring(0, 37)}
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
              processPost(postId);
            }}
          >
            Respond
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
