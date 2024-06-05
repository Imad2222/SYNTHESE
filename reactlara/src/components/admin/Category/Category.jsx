import { useState } from "react";
import { Button, Card, Container, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Category() {
    const [categoryInput, setCategory] = useState({
        slug: '',
        name: '',
        descrip: '',
        status: '',
        meta_title: '',
        meta_keyword: '',
        meta_descrip: '',
        error_list: [],
    });

    const [activeTab, setActiveTab] = useState("home");

    const handleInput = (e) => {
        e.persist();
        setCategory({...categoryInput, [e.target.name]: e.target.value});
    }

    const submitCategory = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.log("No authentication token found.");
            return;
        }

        const data = {
            slug: categoryInput.slug,
            name: categoryInput.name,
            description: categoryInput.descrip,
            status: categoryInput.status,
            meta_title: categoryInput.meta_title,
            meta_keyword: categoryInput.meta_keyword,
            meta_descrip: categoryInput.meta_descrip,
        };

        axios.post(`/api/store-category`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.data.status === 200) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                document.getElementById('CATEGORY_FORM').reset();
            } else if (res.data.status === 400) {
                setCategory({...categoryInput, error_list: res.data.errors});
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container>
            <Typography variant="h5" component="h3" mt={3} mb={2}>
                <hr /> Add Category
                <Link to="/admin/view-category" style={{textDecoration: 'none'}}>
                    <Button variant="contained" style={{backgroundColor: '#673DE6' }} size="small" sx={{ float: 'right' }}>
                        View Category
                    </Button>
                    <hr />
                </Link>
            </Typography>
            <Tabs id="myTab" value={activeTab} onChange={handleTabChange}>
                <Tab label="Home" value="home" style={{color: "black"}} />
                <Tab label="Seo tags" value="seo-tags" />
            </Tabs>
            <Card>
            <form onSubmit={submitCategory} id="CATEGORY_FORM">
                {activeTab === "home" && (
                    <div>
                        <TextField
                            label="Slug"
                            name="slug"
                            onChange={handleInput}
                            value={categoryInput.slug}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            error={!!categoryInput.error_list.slug}
                            helperText={categoryInput.error_list.slug}
                        />
                        <TextField
                            label="Name"
                            name="name"
                            onChange={handleInput}
                            value={categoryInput.name}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            error={!!categoryInput.error_list.name}
                            helperText={categoryInput.error_list.name}
                        />
                        <TextField
                            label="Description"
                            name="descrip"
                            onChange={handleInput}
                            value={categoryInput.descrip}
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            margin="normal"
                        />
                        <div>
                            <input type="checkbox" id="status" name="status" onChange={handleInput} value={categoryInput.status} />
                            <label htmlFor="status">Status 0 = show / Status 1 = hidden</label>
                        </div>
                    </div>
                )}
                {activeTab === "seo-tags" && (
                    <div style={{padding: '20px', borderRadius: '5px', marginTop: '10px'}}>
                        <TextField
                            label="Meta Title"
                            name="meta_title"
                            onChange={handleInput}
                            value={categoryInput.meta_title}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            error={!!categoryInput.error_list.meta_title}
                            helperText={categoryInput.error_list.meta_title}
                            sx={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Meta Keywords"
                            name="meta_keyword"
                            onChange={handleInput}
                            value={categoryInput.meta_keyword}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            sx={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Meta Description"
                            name="meta_descrip"
                            onChange={handleInput}
                            value={categoryInput.meta_descrip}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            sx={{ marginBottom: '10px' }}
                        />
                    </div>
                )}
                <Button type="submit" variant="contained" style={{backgroundColor:'#673DE6'}} sx={{ float: 'right', mt: 2 }}>Submit</Button>
            </form>
            </Card>
        </Container>
    );
}

export default Category;
