import  { useState, useEffect } from 'react';
import { Container, Typography, TextField, Grid } from '@mui/material';
import axios from 'axios';
import Load2 from '../../Load2';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import Avatar from '@mui/material/Avatar';

function Profile() {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.log("No authentication token found.");
            return;
        }
        axios.get(`/api/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.status === 200) {
                setProfile(res.data);
                setLoading(false);
            }

        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <Load2 />
            </div>
        );
    }

    return (
        <Container style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Avatar style={{ margin: '0 auto', marginBottom: '1rem', backgroundColor: '#1976d2', width: '100px', height: '100px' }}>
                <AssignmentIcon style={{ fontSize: '4rem' }} />
            </Avatar>
            <Typography variant="h4" gutterBottom style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', marginBottom: '50px' }}>
                Profile
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Name"
                        value={profile.name || ''}
                        fullWidth
                        disabled
                        style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}
                        InputProps={{
                            startAdornment: (
                                <AccountCircleIcon />
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Email"
                        value={profile.email || ''}
                        fullWidth
                        disabled
                        style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}
                        InputProps={{
                            startAdornment: (
                                <EmailIcon />
                            )
                        }}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}

export default Profile;
