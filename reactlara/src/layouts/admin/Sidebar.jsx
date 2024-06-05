import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion" style={{ background: 'linear-gradient(135deg, #002253 0%, #1510F0 100%)', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)' }}>
      <div className="sb-sidenav-menu">
        <div className="nav">
          <div className="sb-sidenav-menu-heading mt-3">Core</div>
          <Link className="nav-link text-white mt-3" to="/admin/dashboard">
            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt text-white"></i></div>
            Dashboard
          </Link>
          <Link className="nav-link text-white mt-3" to="/admin/add-Category">
            <div className="sb-nav-link-icon"><i className="fas fa-plus text-white"></i></div>
             Add Category
          </Link>
          <Link className="nav-link text-white mt-3" to="/admin/view-Category">
            <div className="sb-nav-link-icon"><i className="fas fa-list text-white"></i></div>
             View Category
          </Link>

          <Link className="nav-link text-white collapsed mt-3" to="#" data-bs-toggle="collapse" data-bs-target="#collapseProduct" aria-expanded="false" aria-controls="collapseProduct">
            <div className="sb-nav-link-icon"><i className="fas fa-boxes text-white"></i></div>
            Products
            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
          </Link>
          <div className="collapse" id="collapseProduct" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
            <nav className="sb-sidenav-menu-nested nav">
              <Link className="nav-link text-white mt-3" to="/admin/add-product">Add Product</Link>
              <Link className="nav-link text-white mt-3" to="/admin/view-product">View Product</Link>
            </nav>
          </div>

          <Link className="nav-link text-white mt-3" to="/admin/profile">
            <div className="sb-nav-link-icon"><i className="fas fa-user text-white"></i></div>
            Profile
          </Link>
        </div>
      </div>
      {/* <div className="sb-sidenav-footer" style={{backgroundColor:'#1510F0', color:'white'}}>
        <div className="small"></div>
        Food
      </div> */}
    </nav>
  );
}

export default Sidebar;
