import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Load2 from "../../../Load2";

function ViewOrd() {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.log("No authentication token found.");
      return;
    }
    axios
      .get(`/api/view-order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          setOrder(res.data.order);
          setLoading(false);
        }
      });
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Load2 />
      </div>
    );
  }

  return (
    <div className="container my-5">
      <header className="d-flex justify-content-between align-items-center mb-4">
        
        <button
          className="btn btn-black d-flex align-items-center"
          onClick={handleBackClick}
        >
          <FaArrowLeft className="mr-2" style={{color:'#020873'}} />
          Back
        </button>
       
      
        <h1
          className="display-4  text-center mx-auto fw-bold"
          style={{ color: "#020873" , textShadow:'30px'}}
        >
          Order Details
        </h1>
      </header>
      <div className="card shadow">
        <div className="card-body">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th style={{ backgroundColor: "#020873", color: "white" }}>
                  First Name
                </th>
                <td>{order.firstname}</td>
              </tr>
              <tr>
                <th style={{ backgroundColor: "#020873", color: "white" }}>
                  Last Name
                </th>
                <td>{order.lastname}</td>
              </tr>
              <tr>
                <th style={{ backgroundColor: "#020873", color: "white" }}>
                  Email
                </th>
                <td>{order.email}</td>
              </tr>
              <tr>
                <th style={{ backgroundColor: "#020873", color: "white" }}>
                  Address
                </th>
                <td>{order.address}</td>
              </tr>
              <tr>
                <th style={{ backgroundColor: "#020873", color: "white" }}>
                  City
                </th>
                <td>{order.city}</td>
              </tr>
              <tr>
                <th style={{ backgroundColor: "#020873", color: "white" }}>
                  State
                </th>
                <td>{order.state}</td>
              </tr>
              <tr>
                <th style={{ backgroundColor: "#020873", color: "white" }}>
                  Phone
                </th>
                <td>{order.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewOrd;