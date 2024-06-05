import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Load2 from "../../../Load2";
import { Button, Card, Container, Tab, Tabs, TextField, Typography } from "@mui/material";

function EditCategory() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [categoryInput, setCategoryInput] = useState({});
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState("home");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                if (!token) {
                    console.log("No authentication token found.");
                    return;
                }
                const res = await axios.get(`/api/edit-category/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.data.status === 200) {
                    setCategoryInput(res.data.category);
                } else if (res.status === 404) {
                    Swal.fire({
                        icon: "warning",
                        title: "Warning",
                        text: res.data.message,
                    });
                    navigate("/admin/view-category");
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);



    

    const handleInput = (e) => {
        e.persist();
        setCategoryInput({ ...categoryInput, [e.target.name]: e.target.value });
    };





    const updateCategory = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("auth_token");
        if (!token) {
            console.log("No authentication token found.");
            return;
        }
       
        axios.put(`/api/update-category/${id}`, categoryInput, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.data.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: res.data.message,
                    });
                    setErrors({});
                } else if (res.data.status === 422) {
                    setErrors(res.data.errors);
                } else if (res.data.status === 404) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: res.data.message,
                    }).then(() => {
                        navigate("/admin/view-category");
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <Load2 />
            </div>
        );
    }

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };


    return (
        <Container>
            
                   <Typography variant="h5" component="h3" mt={3} mb={2}>
                              <hr /> Edit Category
                        <Link to="/admin/view-category" style={{textDecoration: 'none'}}>
                          <Button variant="contained" style={{backgroundColor: '#673DE6' }} size="small" sx={{ float: 'right' }}>
                               Back
                          </Button>
                          <hr />
                       </Link>
                    </Typography>
                    <Tabs id="myTab" value={activeTab} onChange={handleTabChange}>
                        <Tab label="Home" value="home" style={{color: "black"}} />
                        <Tab label="Seo tags" value="seo-tags" />
                    </Tabs>
                    <Card>
                    <form onSubmit={updateCategory}>
                        {activeTab === "home" && (
                            <div>
                                <TextField
                                label="Slug"
                                name="slug"
                                onChange={handleInput}
                                value={categoryInput.slug || ""}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                error={!!errors.slug}
                                helperText={errors.slug}
                            />
                            <TextField
                                label="Name"
                                name="name"
                                onChange={handleInput}
                                value={categoryInput.name || ""}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                onChange={handleInput}
                                value={categoryInput.description || ""}
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
                            
                        ) } 
                            
                        {activeTab === "seo-tags" && (
                            <div style={{padding: '20px', borderRadius: '5px', marginTop: '10px'}}>
                            <TextField
                            label="Meta Title"
                            name="meta_title"
                            onChange={handleInput}
                            value={categoryInput.meta_title || ""}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            error={!!errors.meta_title}
                            helperText={errors.meta_title}
                            />
                            <TextField
                            label="Meta Keywords"
                            name="meta_keyword"
                            onChange={handleInput}
                            value={categoryInput.meta_keyword || ""}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            />
                            <TextField
                            label="Meta Description"
                            name="meta_descrip"
                            onChange={handleInput}
                            value={categoryInput.meta_descrip || ""}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            />
                            </div>

                        )}
                            
                        <Button type="submit" variant="contained" style={{backgroundColor:'#673DE6'}} sx={{ float: 'right', mt: 2 }}>
                            Update
                        </Button>
                    </form>
                    </Card>
        </Container>
    );
}

export default EditCategory;
