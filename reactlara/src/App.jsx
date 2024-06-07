import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MasterLayout from "./layouts/admin/MasterLayout";
import Dashboard from "./components/admin/Dashboard";
import Profile from "./components/admin/Profile";
// import Home from "./components/frontend/Home";
import Login from "./components/frontend/auth/Login";
import Register from "./components/frontend/auth/Register";
import NotFound from "./NotFnd";
import axios from "axios";
import { useEffect, useState } from "react";
import Load from "./Load";
import Swal from "sweetalert2";
import Category from "./components/admin/Category/Category";
import ViewCategory from "./components/admin/Category/ViewCategory";
import EditCategory from "./components/admin/Category/EditCategory";
import AddProduct from "./components/admin/Product/AddProduct";
import ViewProduct from "./components/admin/Product/ViewProduct";
import EditProduct from "./components/admin/Product/EditProduct";
import LandingPage from "./component/LandingPage";
import ViewCategoryy from "./components/frontend/collection/ViewCategoryy";
import ViewProductt from "./components/frontend/collection/ViewProductt";
import ProductDetail from "./components/frontend/collection/ProductDetail";
import Cart from "./components/frontend/Cart";
import Checkout from "./components/frontend/Checkout";
import ViewOrd from "./components/admin/Order/ViewOrd";
import ForgotPassword from "./PSF/ForgotPassword";
import ResetPassword from "./PSF/ResetPassword";
import Tky from "./Tky";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000/";
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Effacer le jeton d'authentification au chargement de l'application
    localStorage.removeItem('auth_token'); // ligne  li zadt 

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const res = await axios.get('/api/checkingAuthenticated', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (res.data.status === 200) {
            setAuthenticated(true);
          }
        } else {
          console.log("No authentication token found.");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const axiosInterceptor = axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
      if (err.response.status === 401) {
        console.log('Unauthorized');
      }
      return Promise.reject(err);
    });

    return () => {
      axios.interceptors.response.eject(axiosInterceptor);
    };
  }, []);

  axios.interceptors.response.use(function(response) {
    return response;
  }, function(error) {
    if (error.response.status === 403) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Access Denied',
      });
    } else if (error.response.status === 404) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Page Not Found',
      });
    }
    return Promise.reject(error);
  });

  return (
    <div className="App">
      {loading ? (
        <Load />
      ) : (
        <Router>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={localStorage.getItem('auth_token') ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={localStorage.getItem('auth_token') ? <Navigate to="/" /> : <Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/collection" element={<ViewCategoryy />} />
            <Route path="/collection/:slug" element={<ViewProductt />} />
            <Route path="/collection/:category_slug/:product_slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thank-you" element={<Tky />} />
            <Route path='/admin' element={authenticated ? <MasterLayout /> : <Navigate to="/login" />}>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-Category" element={<Category />} />
              <Route path="edit-category/:id" element={<EditCategory />} />
              <Route path="view-category" element={<ViewCategory />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="view-product" element={<ViewProduct />} />
              <Route path="edit-product/:id" element={<EditProduct />} />
              <Route path="profile" element={<Profile />} />
              <Route path="dashboard/view-order/:id" element={<ViewOrd />} />
            </Route>
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
