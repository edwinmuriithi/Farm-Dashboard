import { Typography, Stack, TextField, Grid, Container, useMediaQuery, Card, CardContent, CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCookie } from '../lib/cookie';
import { apiHost } from './../lib/api';

export default function Index() {
    let [patients, setPatients] = useState()
    let navigate = useNavigate();
    let [data, setData] = useState({});
    let [role, setRole] = useState(null);
    let [facilities, setFacilities] = useState([]);


    // fetch users
    let getFacilities = async () => {
        let data = (await (await fetch(`${apiHost}/admin/facilities`,
            { method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` } })).json())
        setFacilities(data.facilities);
        return;
    }

    // fetch dashboard stats
    let getStatistics = async () => {
        let data = (await (await fetch(`${apiHost}/statistics/dashboard`,
            { method: "GET", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` } })).json())
        setData(data.data);
        return;
    }

    let getProfile = async () => {
        let _data = (await (await fetch(`${apiHost}/auth/me`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getCookie("token")}` }
            })).json());
        setRole(_data.data.role);
        if (_data.data.role === "SPECIALIST") {
            navigate("/posts");
            return
        }
        return;
    }






    useEffect(() => {
        if (getCookie("token")) {
            getProfile();
            getStatistics();
            return;
        } else {
            navigate('/login');
            window.localStorage.setItem("next_page", "/");
            return;
        }
    }, []);


    return (
        <>
            
    
            
        </>
    )

}




