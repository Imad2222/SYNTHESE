
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import '../../assets/admin/css/styles.css';
import '../../assets/admin/js/scripts';


const MasterLayout = () => {
  return (
    <div className='sb-nav-fixed'>
        <Navbar/>
        <div id="layoutSidenav">
            <div id="layoutSidenav_nav">
                <Sidebar/>
            </div>
            <div id="layoutSidenav_content">
                <main>
                    <Outlet/>
                </main>
               <Footer/>
            </div>
        </div>
    </div>
  );
}

export default MasterLayout;