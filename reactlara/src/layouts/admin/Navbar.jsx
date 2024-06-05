import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import myim from '../../images/F.png'
const Navbar = () => {

    const navigate = useNavigate();

    const logoutSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            if (token) {
                const response = await axios.post('/api/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.status === 200) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_name');
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: response.data.message,
                    });
                    navigate('/');
                }
            } else {
                console.log("No authentication token found.");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark" style={{ background: 'linear-gradient(135deg, #002253 0%, #1510F0 100%)', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)' }}>
             <Link className="navbar-brand ps-3" to="/admin">
          <img src={myim} alt="Logo" style={{ height: '40px' }} />
        </Link>
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i className="fas fa-bars"></i></button>
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                <div className="input-group">
                    <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                    <button className="btn btn-sm" style={{ backgroundColor: '#1510F0' }} id="btnNavbarSearch" type="button">
                        <i className="fas fa-search" style={{ color: 'white' }}></i>
                    </button>
                </div>
            </form>
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <Link to="#" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fas fa-user fa-fw"></i>
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                            <button className="dropdown-item" onClick={logoutSubmit}>
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
