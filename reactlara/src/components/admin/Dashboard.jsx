import axios from "axios";
import { useEffect, useState } from "react";
import Load2 from "../../Load2";
import { Card, CardContent, TableContainer, Typography, Table, TableRow, TableHead, Paper, TableBody, TableCell, TextField, Box , Pagination} from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrder] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {

    document.title = 'View Dashboard';

    const token = localStorage.getItem('auth_token');
    if (!token) {
        console.log("No authentication token found.");
        return;
    }

    axios.get(`/api/admin/orders?page=${currentPage}`, { // Inclure le numéro de page dans l'URL de la requête
      headers: {
          Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if (res.data.status === 200) {
        setOrder(res.data.orders.data);
        setLoading(false);
      }
    });
  }, [currentPage]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#1510F0',
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: 14,
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
      backgroundColor: '#ACF0F2',
    },
  }));

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredOrders = orders.filter(order =>
    order.firstname.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <Load2 />
      </div>
    );
  }

  return (
    <Card variant="outlined" sx={{ mt: 4, mx: 4, p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 2, color: "black", borderRadius: "4px 4px 0 0" }}>
        <Typography variant="h4">
          Order List
        </Typography>
        <TextField
          label="Search by Full name"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
        />
        
      </Box>
      <hr />
      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Full name</StyledTableCell>
                <StyledTableCell align="right">Tracking NO</StyledTableCell>
                <StyledTableCell align="right">Email</StyledTableCell>
                <StyledTableCell align="right">Phone</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((item) => (
                <StyledTableRow key={item.id}>
                  <TableCell component="th" scope="row" style={{ fontWeight: 'bold' , color: '#1510F0'}}>
                    {item.id}
                  </TableCell>
                  <TableCell   component="th" scope="row" style={{ fontWeight: 'bold' }}>{`${item.firstname}  ${item.lastname}`}</TableCell>
                  <TableCell align="right">{item.tracking_no}</TableCell>
                  <TableCell align="right">{item.email}</TableCell>
                  <TableCell align="right" style={{fontFamily:'cursive' , color:'#00305A' , fontWeight: 'bold'  }}>{item.phone}</TableCell>
                  <TableCell align="right">
                    <Link to={`view-order/${item.id}`} style={{ textDecoration: "none", color: "#3f51b5" }}>
                      View
                    </Link>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Pagination
            count={10} // Total number of pages
            page={currentPage} // Current page
            onChange={handleChangePage} // Function called on page change
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default Dashboard;
