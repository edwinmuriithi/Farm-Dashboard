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


export default function Payments() {
  let [payments, setPayments] = useState(null);
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
  let getPayments = async () => {
    let data = await (
      await fetch(`${apiHost}/payments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
    ).json();
    setPayments(data.payments);
    return;
  };

  // delete users
  let deletePayments = async () => {
    for (let i of selected) {
      setOpenSnackBar(false);
      let response = await (
        await fetch(`${apiHost}/payments/${i}`, {
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
      getPayments();
      setOpen(false);
    }
    return;
  };

  // create user
  let createPayment = async () => {
    setOpenSnackBar(false);
    let response = await (
      await fetch(`${apiHost}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({
          amount: data.amount,
          phone: data.phone,
          description: data.description,
        }),
      })
    ).json();
    if (response.status === "error") {
      setMessage(response.error || response.message);
      setOpenSnackBar(true);
      return;
    }
    prompt(`Successfully created user`);
    getPayments();
    setOpen(false);
    return;
  };
  // edit user
  let editPayment = async () => {
    setOpenSnackBar(false);
    let response = await (
      await fetch(`${apiHost}/payments/${selected[0]}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`,
        },
        body: JSON.stringify({
          amount: data.amount,
          phone: data.phone,
          description: data.description,
        }),
      })
    ).json();
    if (response.status === "error") {
      setMessage(response.error || response.message);
      setOpenSnackBar(true);
      return;
    }
    prompt(`Successfully created payment`);
    getPayments();
    setOpen(false);
    return;
  };

  useEffect(() => {
    if (getCookie("token")) {
      getProfile();
      getPayments();
      return;
    } else {
      navigate("/login");
      window.localStorage.setItem("next_page", "/users");
      return;
    }
  }, []);

  let searchPayments = async () => {
    try {
      let response = await (
        await fetch(`${apiHost}/payments?phone=${phone}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        })
      ).json();
      setPayments(response.payments);
      return;
    } catch (error) {
      prompt(JSON.stringify(error));
      return;
    }
  };

  const columns = [
    { field: "names", headerName: "Names", width: 200 },
    { field: "phone", headerName: "Phone Number", width: 200 },
    { field: "amount", headerName: "Amount", width: 120 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "updatedAt", headerName: "Updated At", width: 200 },
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
          Payments{" "}
        </Typography>
        {!isMobile && (
          <Typography
            sx={{
              minWidth:
                selected.length > 1
                  ? "35%"
                  : selected.length === 1
                  ? "25%"
                  : "60%",
            }}
          ></Typography>
        )}

        {selected.length > 0 && (
          <>
            <Button
              variant="contained"
              onClick={(e) => {
                deletePayments();
              }}
              disableElevation
              sx={{ backgroundColor: "green" }}
            >
              Delete Payment{selected.length > 1 && `s`}
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
              Edit Payment Details
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
          Create Payment
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
          placeholder="Search payments by phone number"
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
            searchPayments();
          }}
        >
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      </Paper>
      <p></p>
      <DataGrid
        loading={payments ? false : true}
        rows={payments ? payments : []}
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
            {editMode ? "EDIT PAYMENT INFORMATION" : "ADD NEW PAYMENT"}
          </Typography>
          <Typography variant="p">Provide payment information below</Typography>
          <br />
          <br />
          <Stack direction="column" spacing={2}>
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

            <TextField
              sx={{ width: "100%" }}
              type="tel"
              label="Amount"
              placeholder="Amount"
              size="small"
              onChange={(e) => {
                setData({ ...data, amount: e.target.value });
              }}
            />
            <TextField
              sx={{ width: "100%" }}
              type="tel"
              label="Description"
              placeholder="Description"
              size="small"
              onChange={(e) => {
                setData({ ...data, description: e.target.value });
              }}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "green" }}
              onClick={(e) => {
                editMode ? editPayment() : createPayment();
              }}
            >
              {editMode ? "Update Payment Details" : "Create Payment"}
            </Button>
            <br />
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
