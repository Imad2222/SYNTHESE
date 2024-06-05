import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Load2 from "../../../Load2";
import Swal from "sweetalert2";
import { Button, Card, CardContent, CardHeader, TableContainer, Typography, Table, TableRow, TableHead, Paper, TableBody, Pagination } from "@mui/material";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AddIcon from '@mui/icons-material/Add';

function ViewCategory() {

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#2196f3',
      color: theme.palette.common.white,
      fontWeight: 'bold',
      fontSize: 14,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {

    document.title = 'View Category';

    const token = localStorage.getItem('auth_token'); // Get JWT token from localStorage
    if (!token) {
      console.log("No authentication token found."); // Handle case where no token is found
      return;
    }
    axios.get(`/api/view-category?page=${currentPage}`, {
      headers: {
        Authorization: `Bearer ${token}` // Add JWT token to the auth header
      }
    }).then(res => {
      if (res.status === 200) {
        setCategoryList(res.data.category.data);
        setLoading(false);
      }
    }).catch(err => {
      console.log(err);
      setLoading(false);
    });
  }, [currentPage]);

  const deleteCategory = (e, id) => {
    e.preventDefault();

    const token = localStorage.getItem('auth_token'); // Get JWT token from localStorage
    if (!token) {
      console.log("No authentication token found."); // Handle case where no token is found
      return;
    }

    const thisClicked = e.currentTarget;
    thisClicked.innerText = "Deleting ...";

    axios.delete(`/api/delete-category/${id}`, {
      headers: {
        Authorization: `Bearer ${token}` // Add JWT token to the auth header
      }
    }).then(res => {
      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: res.data.message,
        });

        thisClicked.closest("tr").remove();
      } else if (res.data.status === 404) {
        Swal.fire({
          icon: "warning",
          title: res.data.message,
        });
        thisClicked.innerText = "Delete";
      }
    });
  }

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  var view_category_HTMLTABLE = '';
  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <Load2 />
    </div>
  } else {
    view_category_HTMLTABLE =
      categoryList.map((item) => {
        return (
          <StyledTableRow key={item.id}>
            <StyledTableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
              {item.id}
            </StyledTableCell>
            <StyledTableCell align="right">{item.name}</StyledTableCell>
            <StyledTableCell align="right">{item.slug}</StyledTableCell>
            <StyledTableCell align="right">{item.status}</StyledTableCell>
            <StyledTableCell align="right">
              <Link to={`/admin/edit-category/${item.id}`} style={{ textDecoration: "none" }}>
                <Button variant="contained" size="small" style={{ backgroundColor: '#3f51b5', color: '#fff' }}>
                  <ModeEditIcon />
                </Button>
              </Link>
            </StyledTableCell>
            <StyledTableCell align="right">
              <Button variant="contained" color="error" size="small" onClick={(e) => deleteCategory(e, item.id)}>Delete</Button>
            </StyledTableCell>
          </StyledTableRow>
        )
      });
  }

  return (
    <Card variant="outlined" sx={{ mt: 4, mx: 4, p: 2 }}>
      <CardHeader
        title={
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, color: "#fff", backgroundColor: "#3f51b5", borderRadius: "4px 4px 0 0" }}>
            Category List
            <Link to="/admin/add-category" style={{ textDecoration: "none" }}>
              <Button variant="contained" size="small" style={{ backgroundColor: '#2196f3', color: '#fff' }}>
                <AddIcon /> Category
              </Button>
            </Link>
          </Typography>
        }
      />
      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell align="right">Name</StyledTableCell>
                <StyledTableCell align="right">Slug</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
                <StyledTableCell align="right">Edit</StyledTableCell>
                <StyledTableCell align="right">Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {view_category_HTMLTABLE}
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
  )
}

export default ViewCategory;
