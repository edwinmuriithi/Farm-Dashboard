import { Card, CardContent, CardHeader, Container, TextField, Button, Grid, Snackbar } from '@mui/material'
import {useState,} from 'react'
import {useNavigate} from 'react-router-dom'
import { apiHost } from '../lib/api'


export default function ResetPassword(){

    let [phone, setPhone] = useState({})
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)
    let [message, setMessage] = useState(false)

    let resetPassword = async () => {
        let data = (await (await fetch(`${apiHost}/auth/reset-password`, 
            {   method:'POST', 
                headers:{"Content-Type":"application/json", },
                body: JSON.stringify(phone)
            }
            )).json())
        console.log(data)
        if(data.status === "error"){
                setMessage(data.error)
                setOpen(true)
                return
        }
        else{
            setMessage(data.message)
            setOpen(true)
            // navigate('/set-new-password')
            return
        }
            
    }
    return(
        <>
            <Container>
            <Snackbar
                anchorOrigin={{ vertical:'top', horizontal:'center' }}
                open={open}
                onClose={e=>{setOpen(false)}}
                message={message}
                key={"loginAlert"}
            />
            <Grid
                container
                justifyContent="center"
                alignItems="center"
            >
            <Grid item xs={12} lg={6} md={12} sx={{paddingTop:"10%"}}>
                <br/>
            <Card sx={{maxWidth:"500px",backgroundColor:"", border:"1px black solid"}}>
                <CardHeader title="Reset Password" sx={{color:"green"}}></CardHeader>
                <CardContent>
                    <TextField  
                    sx={{minWidth:"100%"}}
                    type="phone"
                    placeholder="Phone number"
                    size="small"
                    onChange={e=>{setPhone({phone:e.target.value})}}
                    />
                    <br/><br/>   
                    <Button variant="contained"
                     disableElevation onClick={e=>{resetPassword()}}
                    sx={{width:"50%", marginLeft:"25%", backgroundColor:"green"}}
                    >RESET PASSWORD</Button>
                </CardContent>
            </Card>
            <br/>
            <Button variant="outlined" onClick={e=>{navigate('/login')}} sx={{width:"50%", marginLeft:"25%", color:"green"}}
            >BACK TO LOGIN</Button>
            </Grid>
            </Grid>
            </Container>
        </>
    )

}




