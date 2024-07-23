import { Link, useNavigate } from "react-router-dom";
import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import SelectOption from "../../components/common/SelectOption.jsx";
import { useCookies } from 'react-cookie';
import axios from "axios";

const DeliveredList = () => {
  const [cookies] = useCookies(['token']);
  console.log(cookies);
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);
  const [orderData, setOrderData] = useState([]);
  const [token, settoken] = useState('')
  const navigate = useNavigate();
  const [tableRow, setTableRow] = useState([
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
  ]);

  const bulkAction = [
    { value: "delete", label: "Delete" },
    { value: "category", label: "Category" },
    { value: "status", label: "Status" },
  ];
  const [render, setrender] = useState(false)

  const bulkActionDropDown = (selectedOption) => {
    console.log(selectedOption);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    if (isCheck) {
      const updateChecks = {};
      orderData.forEach((order) => {
        updateChecks[order._id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  const handleCheckOrder = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  const showTableRow = (selectedOption) => {
    setSelectedValue(selectedOption.label);
  };

  const actionItems = ["delivered", "unpaid", "Edit"];

  const handleActionItemClick = (item, itemID) => {
    const token = cookies.token;
    var updateItem = item.toLowerCase();
    if (updateItem === "delivered") {
      alert(`#${itemID} item delivered`);
      axios.patch(`http://localhost:8000/api/v1/orders/${itemID}?status=delivered&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((res) => {
        console.log(res.data);
        console.log('rjej');
        setrender(true)
      })
    } else if (updateItem === "unpaid") {
      navigate(`/orders/manage/${itemID.toString()}`);
    }
  };

  useEffect(() => {
    const token = cookies.token;
    settoken(token)
    setrender(false)
    axios.get('http://localhost:8000/api/v1/orders?status=delivered', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        console.log(res.data);
        setOrderData(res.data.orders);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cookies.token, render]);

  return (
    <section className="orders" style={{height:'100%'}}>
      <div className="container" style={{height:'100%'}}>
        <div className="wrapper" style={{height:'100%'}}>
          <div className="content transparent" style={{height:'100%' ,display:'flex',justifyContent:'space-between'}}>
         <div>
         <div className="content_head">

<Input
  placeholder="Search Order..."
  className="sm table_search"
/>
<Button label="Search" className="sm" />


</div>
<div className="content_body">
<div className="table_responsive">
  <table className="separate">
    <thead>
      <tr>
        <th className="td_checkbox">
          <CheckBox
            onChange={handleBulkCheckbox}
            isChecked={bulkCheck}
          />
        </th>
        <th className="td_id">ID</th>
        <th>name</th>
        <th>Email</th>
        <th>Amount</th>
        <th>Payment Method</th>
        <th>Status</th>
        {/* <th>Actions</th> */}
      </tr>
    </thead>
    <tbody>
      {orderData.map((order, key) => (
        <tr key={key}>
          <td className="td_checkbox">
            <CheckBox
              onChange={(isCheck) =>
                handleCheckOrder(isCheck, order._id)
              }
              isChecked={specificChecks[order._id] || false}
            />
          </td>
          <td className="td_id">{key}</td>
          <td>
            <Link to={`/customers/manage/${order.user._id}`}>{order.user.name}</Link>
          </td>
          <td>{order.user.email}</td>
          <td>{order.total}</td>
          <td>Static method</td>
          <td>
            {order.status.toLowerCase() === "active" ||
              order.status.toLowerCase() === "completed" ||
              order.status.toLowerCase() === "approved" ||
              order.status.toLowerCase() === "delivered" ||
              order.status.toLowerCase() === "shipped" ||
              order.status.toLowerCase() === "paid" ||
              order.status.toLowerCase() === "coming soon" ? (
              <Badge
                label={order.status}
                className="light-success"
              />
            ) : order.status.toLowerCase() === "inactive" ||
              order.status.toLowerCase() === "out of stock" ||
              order.status.toLowerCase() === "rejected" ||
              order.status.toLowerCase() === "locked" ||
              order.status.toLowerCase() === "discontinued" ? (
              <Badge
                label={order.status}
                className="light-danger"
              />
            ) : order.status.toLowerCase() === "on sale" ||
              order.status.toLowerCase() === "featured" ||
              order.status.toLowerCase() === "shipping" ||
              order.status.toLowerCase() === "processing" ||
              order.status.toLowerCase() === "pending" ? (
              <Badge
                label={order.status}
                className="light-warning"
              />
            ) : order.status.toLowerCase() === "archive" ||
              order.status.toLowerCase() === "pause" ? (
              <Badge
                label={order.status}
                className="light-secondary"
              />
            ) : (
              order.status
            )}
          </td>
  
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>
         </div>
            <div className="content_footer" style={{marginTop:'0px'}}>
              <Dropdown
                className="top show_rows sm"
                placeholder="please select"
                selectedValue={selectedValue}
                onClick={showTableRow}
                options={tableRow}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveredList;
