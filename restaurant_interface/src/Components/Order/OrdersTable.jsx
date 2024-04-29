import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../Dashboard/Title";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Tab,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useAuthOwner } from "../../Context";
import BACKEND_URL from "../../config";
import CancelDialog from "./CancelDialog";
import ViewDialog from "./ViewDialog";


function preventDefault(event) {
  event.preventDefault();
}

export default function OrdersTable() {
  const { isAuthenticated } = useAuthOwner();
  const [orders, setOrders] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const getIncomingOrder = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/owner/orders/incoming`,
        {
          headers: {
            Authorization: isAuthenticated,
          },
      
        }
      );
      setOrders(response.data);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleApproveOrder = async (oc) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/owner/order/accept`,
        {
          oc,
        },
        {
          headers: {
            Authorization: isAuthenticated,
          },
        }
      );
      getIncomingOrder();
      alert(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelOrder = async (oc, rejectReason) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/owner/order/reject`,
        {
          oc,
          rejectReason,
        },
        {
          headers: {
            Authorization: isAuthenticated,
          },
        }
      );
      getIncomingOrder();
      alert(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  
 
  React.useEffect(() => {
    getIncomingOrder();
  }, []);
  return (
    <React.Fragment>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Title>Recent Orders</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Ship To</TableCell>
              <TableCell>Order Code </TableCell>
              <TableCell>Sale Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, i) => (
              <TableRow key={i}>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.recipientName}</TableCell>
                <TableCell>{order.orderLocation}</TableCell>
                <TableCell>{order.orderCode}</TableCell>
                <TableCell>{`$${order.orderCost}`}</TableCell>
                <TableCell align="center">
                  <Button onClick={() => handleApproveOrder(order.orderCode)}>
                    Approve
                  </Button>
                  <CancelDialog
                    handleCancelOrder={handleCancelOrder}
                    oc={order.orderCode}
                  />
                  <ViewDialog
                  oc={order.orderCode}
                  refresh={getIncomingOrder}
                  total={order.orderCost}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
          See more orders
        </Link>
      </Paper>
    </React.Fragment>
  );
}
