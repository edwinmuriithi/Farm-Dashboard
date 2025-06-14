import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Modal,
  Box,
  Stack,
  Button,
  Alert,
  useMediaQuery,
  CardContent,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from "@mui/material";
import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { getCookie } from "./../lib/cookie";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { apiHost } from "../lib/api";
import counties from "./../data/counties.json";
import countiesToSubCounties from "./../data/county_to_consituencies.json";
import codeToCounties from "./../data/code_to_counties_map.json";

export default function Users() {
  let [users, setUsers] = useState(null);
  let [editMode, setEditMode] = useState(false);
  let [phone, setPhone] = useState(null);
  let [open, setOpen] = useState(false);
  let [data, setData] = useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let [selected, setSelected] = useState([]);
  let [county, setCounty] = useState(null);
  let isMobile = useMediaQuery("(max-width:600px)");
  let navigate = useNavigate();
  let [openSnackBar, setOpenSnackBar] = useState(false);
  let [message, setMessage] = useState(false);
  let [role, setRole] = useState(null);
  let [kmhflCode, setKmhflCode] = useState(null);

  function prompt(text) {
    setMessage(text);
    setOpenSnackBar(true);
    setTimeout(() => {
      setOpenSnackBar(false);
    }, 4000);
    return;
  }

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
    // console.log(_data);
    if (!_data.data.role === "ADMINISTRATOR") {
      prompt("You are not authorized to access this page");
      navigate("/");
      return;
    }
    setRole(_data.data.role);
    return;
  };

  // fetch users
  let getUsers = async () => {
    let data = await (
      await fetch(`${apiHost}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
    ).json();
    setUsers(data.users);
    return;
  };

  // delete users
  let deleteUsers = async () => {
    for (let i of selected) {
      setOpenSnackBar(false);
      let response = await (
        await fetch(`${apiHost}/auth/${i}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        })
      ).json();
      if (response.status === "error") {
        setMessage(response.error || response.message);
        setOpenSnackBar(true);
        return;
      }
      getUsers();
      setOpen(false);
    }
    return;
  };

  // reset Password
  let resetPassword = async () => {
    for (let i of selected) {
      setOpenSnackBar(false);
      let response = await (
        await fetch(`${apiHost}/auth/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
          body: JSON.stringify({ id: i }),
        })
      ).json();
      if (response.status === "error") {
        setMessage(response.error || response.message);
        setOpenSnackBar(true);
        return;
      }
      getUsers();
      setMessage(response.error || response.message);
      setOpenSnackBar(true);
      setTimeout(() => {
        setOpenSnackBar(false);
      }, 3000);
    }
    return;
  };

  // create user
  let createUser = async () => {
    setOpenSnackBar(false);
    let response = await (
      await fetch(`${apiHost}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({
          email: data.email,
          names: data.names,
          role: data.role,
          kmhflCode: data.kmhflCode || kmhflCode,
          phone: data.phone,
        }),
      })
    ).json();
    if (response.status === "error") {
      setMessage(response.error || response.message);
      setOpenSnackBar(true);
      return;
    }
    prompt(`Successfully created user`);
    getUsers();
    setOpen(false);
    return;
  };
  // edit user
  let editUser = async () => {
    setOpenSnackBar(false);
    let response = await (
      await fetch(`${apiHost}/users/${selected[0]}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({
          email: data.email,
          names: data.names,
          role: data.role,
          kmhflCode: data.kmhflCode || kmhflCode,
          status: data.status,
          phone: data.phone,
          county: data.county,
          subCounty: data.subCounty
        }),
      })
    ).json();
    if (response.status === "error") {
      setMessage(response.error || response.message);
      setOpenSnackBar(true);
      return;
    }
    prompt(`Successfully created user`);
    getUsers();
    setOpen(false);
    return;
  };

  useEffect(() => {
    if (getCookie("token")) {
      getProfile();
      getUsers();
      return;
    } else {
      navigate("/login");
      window.localStorage.setItem("next_page", "/users");
      return;
    }
  }, []);

  let searchUsers = async () => {
    try {
      let response = await (
        await fetch(`${apiHost}/users?phone=${phone}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        })
      ).json();
      setUsers(response.users);
      return;
    } catch (error) {
      prompt(JSON.stringify(error));
      return;
    }
  };

  const columns = [
    { field: "names", headerName: "Names", width: 200 },
    // { field: 'email', headerName: 'Email', width: 200 },
    { field: "phone", headerName: "Phone Number", width: 200 },
    { field: "role", headerName: "Role", width: 100 },
    { field: "county", headerName: "County", width: 100 },
    { field: "subCounty", headerName: "Sub-County", width: 100 },
    { field: "disabled", headerName: "Disabled", width: 200 },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackBar}
        onClose={""}
        message={message}
        key={"loginAlert"}
      />
      <Stack direction="row" spacing={2} alignContent="right">
        <Typography variant="p" sx={{ fontSize: "30px" }}>
          Users{" "}
        </Typography>
        {!isMobile && (
          <Typography
            sx={{
              minWidth:
                selected.length > 1
                  ? "60%"
                  : selected.length === 1
                  ? "30%"
                  : "70%",
            }}
          ></Typography>
        )}

        {selected.length > 0 && (
          <>
            <Button
              variant="contained"
              onClick={(e) => {
                deleteUsers();
              }}
              disableElevation
              sx={{ backgroundColor: "green" }}
            >
              Delete User{selected.length > 1 && `s`}
            </Button>
          </>
        )}
        {selected.length === 1 && (
          <>
            <Button
              variant="contained"
              disableElevation
              sx={{ backgroundColor: "green" }}
              onClick={(e) => {
                setEditMode(true);
                handleOpen();
              }}
            >
              Edit User Details
            </Button>
            <Button
              variant="contained"
              disableElevation
              sx={{ backgroundColor: "green" }}
              onClick={(e) => {
                resetPassword();
              }}
            >
              Reset Password
            </Button>
          </>
        )}
        <Button
          variant="contained"
          disableElevation
          sx={{ backgroundColor: "green" }}
          onClick={(e) => {
            setEditMode(false);
            handleOpen();
          }}
        >
          Create New User
        </Button>
      </Stack>
      <p></p>
      <Divider />
      <p></p>
      <Paper
        component="form"
        sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search users by phone number"
          inputProps={{ "aria-label": "search users" }}
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        />
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={(e) => {
            searchUsers();
          }}
        >
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      </Paper>
      <p></p>
      <DataGrid
        loading={users ? false : true}
        rows={users ? users : []}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        autoHeight
        editMode={false}
        disableSelectionOnClick
        onSelectionModelChange={(e) => {
          setSelected(e);
        }}
        onCellEditStop={(e) => {
          console.log(e);
        }}
      />
      {/* Add User Modal  */}
      <Modal keepMounted open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            {editMode ? "EDIT USER INFORMATION" : "ADD NEW USER"}
          </Typography>
          <Typography variant="p">Provide user information below</Typography>
          <br />
          <br />
          <Stack direction="column" spacing={2}>
            <TextField
              sx={{ width: "100%" }}
              type="text"
              label="Names"
              placeholder="Names"
              size="small"
              onChange={(e) => {
                setData({ ...data, names: e.target.value });
              }}
            />
            {/* <TextField
                                sx={{ width: "100%" }}
                                type="email"
                                label="Email Address"
                                placeholder="Email Address"
                                size="small"
                                onChange={e => { setData({ ...data, email: e.target.value }) }}
                            /> */}

            <TextField
              sx={{ width: "100%" }}
              type="tel"
              label="Phone Number"
              placeholder="Phone Number"
              size="small"
              onChange={(e) => {
                setData({ ...data, phone: e.target.value });
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={data.role}
                label="Role"
                onChange={(e) => {
                  setData({ ...data, role: e.target.value });
                }}
                size="small"
              >
                {role === "ADMINISTRATOR" && (
                  <MenuItem value={"ADMINISTRATOR"}>Administrator</MenuItem>
                )}
                {role === "ADMINISTRATOR" && (
                  <MenuItem value={"SPECIALIST"}>Specialist</MenuItem>
                )}
                {role === "ADMINISTRATOR" && (
                  <MenuItem value={"USER"}>User</MenuItem>
                )}
              </Select>
            </FormControl>

            <Grid item xs={12} md={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">County</InputLabel>
                <Select
                  value={data.status}
                  label="County"
                  onChange={(e) => {
                    setCounty(e.target.value);
                    setData({
                      ...data,
                      county: codeToCounties[e.target.value],
                    });
                  }}
                  size="small"
                >
                  {counties.map((county) => {
                    return (
                      <MenuItem value={county.code}>{county.name}</MenuItem>
                    );
                  })}
                  {/* <MenuItem value={"enabled"}>Enabled</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Sub-county
                </InputLabel>
                <Select
                  value={data.status}
                  label="SubCounty"
                  onChange={(e) => {
                    setData({ ...data, subCounty: e.target.value });
                  }}
                  size="small"
                >
                  {county &&
                    countiesToSubCounties[county].map((county) => {
                      return (
                        <MenuItem value={county.name}>{county.name}</MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>

            {editMode && (
              <Grid item xs={12} md={12} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Account Status
                  </InputLabel>
                  <Select
                    value={data.status}
                    label="Account Status"
                    onChange={(e) => {
                      setData({ ...data, status: e.target.value });
                    }}
                    size="small"
                  >
                    <MenuItem value={"disabled"}>Disabled</MenuItem>
                    <MenuItem value={"enabled"}>Enabled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Button
              variant="contained"
              sx={{ backgroundColor: "green" }}
              onClick={(e) => {
                editMode ? editUser() : createUser();
              }}
            >
              {editMode ? "Update User Details" : "Create User"}
            </Button>
            <br />
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
