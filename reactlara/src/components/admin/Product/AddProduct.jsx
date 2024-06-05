import { useEffect, useState } from "react";
import { Button, Card, Container, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function AddProduct() {
    const [categoryList, setCategoryList] = useState([]);
    const [productInput, setProduct] = useState({
        category_id:"",
        slug: "",
        name: "",
        description: "",
        meta_title: "",
        meta_keyword: "",
        meta_descrip: "",
        selling_price: "",
        original_price: "",
        qte: "",
        brand: "",
        featured: "",
        popular: "",
        status: "",
    });
    const [picture, setPicture] = useState([]);
    const [errorList, setError] = useState([]);
    const [activeTab, setActiveTab] = useState("home");

    const handleInput = (e) => {
        e.persist();
        setProduct({ ...productInput, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        setPicture({ image: e.target.files[0] });
    };


    useEffect(() => {

        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.log("No authentication token found.");
            return;
        }


        axios.get(`/api/all-category`,{
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        }).then(res => {
            if(res.data.status === 200){
                setCategoryList(res.data.category);
            }
        });
    },[]);


    const submitProduct = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("category_id", productInput.category_id);
        formData.append("slug", productInput.slug);
        formData.append("name", productInput.name);
        formData.append("description", productInput.description);
        formData.append("meta_title", productInput.meta_title);
        formData.append("meta_keyword", productInput.meta_keyword);
        formData.append("meta_descrip", productInput.meta_descrip);
        formData.append("selling_price", productInput.selling_price);
        formData.append("original_price", productInput.original_price);
        formData.append("qte", productInput.qte);
        formData.append("brand", productInput.brand);
        formData.append("featured", productInput.featured);
        formData.append("popular", productInput.popular);
        formData.append("status", productInput.status);
        formData.append("image", picture.image);

        const token = localStorage.getItem("auth_token");
        if (!token) {
            console.log("No authentication token found.");
            return;
        }

        axios.post(`/api/store-product`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => {
            if (res.data.status === 200) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: res.data.message,
                });
                setProduct({
                    ...productInput,
                    category_id:"",
                    slug: "",
                    name: "",
                    description: "",
                    meta_title: "",
                    meta_keyword: "",
                    meta_descrip: "",
                    selling_price: "",
                    original_price: "",
                    qte: "",
                    brand: "",
                    featured: "",
                    popular: "",
                    status: "",
                });
                setError([]);
            } else if (res.data.status === 422) {
                Swal.fire({
                    icon: "error",
                    title: "All Fields Are Mandatory",
                });
                setError(res.data.errors);
            }
        });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container>
            <Typography variant="h5" component="h3" mt={3} mb={2}>
                <hr /> Add Product
                <Link to="/admin/view-product" style={{ textDecoration: "none" }}>
                    <Button variant="contained" style={{ backgroundColor: "#673DE6" }} size="small" sx={{ float: "right" }}>
                        View Product
                    </Button>
                    <hr />
                </Link>
            </Typography>
            <Tabs id="myTab" value={activeTab} onChange={handleTabChange}>
                <Tab label="Home" value="home" style={{ color: "black" }} />
                <Tab label="Seo Tags" value="seo-tags" />
                <Tab label="Otherdetails" value="otherdetails" />
            </Tabs>
            <Card>
                <form onSubmit={submitProduct}>
                    {activeTab === "home" && (
                        <div style={{ padding: "20px", borderRadius: "5px", marginTop: "10px" }}>
                            <label> Select Category</label>
                                                <select name="category_id" onChange={handleInput} value={productInput.category_id} className=" form-control">
                                                    <option>Select Category</option>
                                                    {
                                                        categoryList.map((item) => {
                                                            return (
                                                                <option key={item.id} value={item.id}>{item.name}</option>
                                                            ) 
                                                        })
                                                    }
                                                </select>
                                                <small className="text-danger">{errorList.category_id}</small>
                            <TextField
                                label="Slug"
                                name="slug"
                                onChange={handleInput}
                                value={productInput.slug}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                error={!!errorList.slug}
                                helperText={errorList.slug}
                            />
                            <TextField
                                label="Name"
                                name="name"
                                onChange={handleInput}
                                value={productInput.name}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                error={!!errorList.name}
                                helperText={errorList.name}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                onChange={handleInput}
                                value={productInput.description}
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                margin="normal"
                            />
                            <div>
                                <input type="checkbox" id="status" name="status" onChange={handleInput} value={productInput.status} />
                                <label htmlFor="status">Status 0 = show / Status 1 = hidden</label>
                            </div>
                        </div>
                    )}
                    {activeTab === "seo-tags" && (
                        <div style={{ padding: "20px", borderRadius: "5px", marginTop: "10px" }}>
                            <TextField
                                label="Meta Title"
                                name="meta_title"
                                onChange={handleInput}
                                value={productInput.meta_title}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                error={!!errorList.meta_title}
                                helperText={errorList.meta_title}
                                sx={{ marginBottom: "10px" }}
                            />
                            <TextField
                                label="Meta Keywords"
                                name="meta_keyword"
                                onChange={handleInput}
                                value={productInput.meta_keyword}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                sx={{ marginBottom: "10px" }}
                            />
                            <TextField
                                label="Meta Description"
                                name="meta_descrip"
                                onChange={handleInput}
                                value={productInput.meta_descrip}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                sx={{ marginBottom: "10px" }}
                            />
                        </div>
                    )}
                    {activeTab === "otherdetails" && (
                                            <div className="row">
                                                          <div className="col-md-4 form-group mb-3">
                                                          <TextField
                                                            label="Selling Price"
                                                            name="selling_price"
                                                            onChange={handleInput}
                                                            value={productInput.selling_price}
                                                            fullWidth
                                                            variant="outlined"
                                                            margin="normal"
                                                            error={!!errorList.selling_price}
                                                            helperText={errorList.selling_price}
                                                            />
                                                          </div>
          
                                                          <div className="col-md-4 form-group mb-3">
                                                          <TextField
                                                            label="Original Price"
                                                            name="original_price"
                                                            onChange={handleInput}
                                                            value={productInput.original_price}
                                                            fullWidth
                                                            variant="outlined"
                                                            margin="normal"
                                                            error={!!errorList.original_price}
                                                            helperText={errorList.original_price}
                                                            />
                                                          </div>
          
                                                          <div className="col-md-4 form-group mb-3">
                                                          <TextField
                                                            label="Quantité"
                                                            name="qte"
                                                            onChange={handleInput}
                                                            value={productInput.qte}
                                                            fullWidth
                                                            variant="outlined"
                                                            margin="normal"
                                                            error={!!errorList.qte}
                                                            helperText={errorList.qte}
                                                            />
                                                          </div>
          
                                                          <div className="col-md-4 form-group mb-3">
                                                          <TextField
                                                            label="Brand"
                                                            name="brand"
                                                            onChange={handleInput}
                                                            value={productInput.brand}
                                                            fullWidth
                                                            variant="outlined"
                                                            margin="normal"
                                                            error={!!errorList.brand}
                                                            helperText={errorList.brand}
                                                            />
                                                          </div>
          
                                                          <div className="col-md-8 form-group mb-3">
                                                                  <label >Images </label>
                                                                  <input type="file" name="image" accept="image/*" onChange={handleImage} className="form-control"  />
                                                                  <small className="text-danger">{errorList.image}</small>
                                                          </div> 
          
                                                          <div className="col-md-4 form-group mb-3">
                                                                  <label >Featured (checked=shown) </label>
                                                                  <input type="checkbox" name="featured" onChange={handleInput} value={productInput.featured} className="w-50 h-50"/>
                                                          </div>
          
                                                          <div className="col-md-4 form-group mb-3">
                                                                  <label >Popular (checked=shown) </label>
                                                                  <input type="checkbox" name="popular" onChange={handleInput} value={productInput.popular} className="w-50 h-50"/>
                                                          </div>
          
                                                          <div className="col-md-4 form-group mb-3">
                                                                  <label >Status (checked=Hidden) </label>
                                                                  <input type="checkbox" name="status" onChange={handleInput} value={productInput.status} className="w-50 h-50"/>
                                                          </div>
          
                                            </div>
                     
                    )}
                    <Button type="submit" variant="contained" style={{ backgroundColor: "#673DE6" }} sx={{ float: "right", mt: 2 }}>
                        Submit
                    </Button>
                </form>
            </Card>
        </Container>
    );
}

export default AddProduct;
