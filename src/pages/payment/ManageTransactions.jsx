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
import { useCookies } from 'react-cookie';
import axios from "axios";
import './transaction.css';

const ManageTransactions = () => {
  const [cookies] = useCookies(['token']);
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();
  const [inputFieldVisible, setInputFieldVisible] = useState({});
  const [paymentId, setPaymentId] = useState('');

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
  const [render, setrender] = useState(false);

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

  const actionItems = ["paid", "unpaid", "Edit"];

  const handleActionItemClick = (item, itemID) => {
    if (item === 'paid') {
      setInputFieldVisible((prevState) => ({
        ...prevState,
        [itemID]: !prevState[itemID],
      }));
    }
  };

  useEffect(() => {
    const token = cookies.token;
    setrender(false)
    axios.get('http://localhost:8000/api/v1/orders?status=pending', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        setOrderData(res.data.orders);
        console.log(res.data.orders);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cookies.token, render]);

  const handleTransactionUpdate = (orderId, status) => {
    const token = cookies.token;
    console.log(paymentId);
    axios.patch(`http://localhost:8000/api/v1/orders/${orderId}?status=${status}&payment=${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      setrender(true);
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <section className="orders">
      <div className="container">
        <div className="wrapper">
          <div className="content transparent">
            <div className="content_head">
              <Dropdown placeholder="Bulk Action" className="sm" onClick={bulkActionDropDown} options={bulkAction} />
              <Input placeholder="Search Order..." className="sm table_search" />
              <div className="btn_parent">
                <Link to="/orders/add" className="sm button">
                  <Icons.TbPlus />
                  <span>Create Order</span>
                </Link>
                <Button label="Advance Filter" className="sm" />
                <Button label="Save" className="sm" />
              </div>
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
                      <th>Name</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.map((order, key) => (
                      <React.Fragment key={key}>
                        <tr>
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
                            {order.status.toLowerCase() === "completed" || order.status.toLowerCase() === "approved" ||
                              order.status.toLowerCase() === "delivered" || order.status.toLowerCase() === "new" ? (
                              <Badge
                                label={order.status}
                                className="light-success"
                              />
                            ) :
                              order.status.toLowerCase() === "out of stock" ||
                                order.status.toLowerCase() === "rejected" ? (
                                <Badge
                                  label={order.status}
                                  className="light-danger"
                                />
                              ) :
                                order.status.toLowerCase() === "pending" ? (
                                  <Badge
                                    label={order.status}
                                    className="light-warning"
                                  />
                                ) : order.status.toLowerCase() === "pause" ? (
                                  <Badge
                                    label={order.status}
                                    className="light-secondary"
                                  />
                                ) : (
                                  order.status
                                )}
                          </td>
                          <td className="td_action">
                            <TableAction
                              actionItems={actionItems}
                              onActionItemClick={(item) =>
                                handleActionItemClick(item, order._id)
                              }
                            />
                          </td>
                        </tr>
                        {inputFieldVisible[order._id] && (
                          <tr id="slowDown" style={{ backgroundColor: 'yellow' }}>
                            <td colSpan="8" style={{ padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
                              <div className={`paymentIdInput ${inputFieldVisible[order._id] ? 'visible' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <input
                                  type="text"
                                  placeholder="Enter Payment ID"
                                  value={paymentId}
                                  onChange={(e) => setPaymentId(e.target.value)}
                                  style={{ flex: 1, marginRight: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                />
                                <button
                                  style={{ backgroundColor: 'green', width: '60px', height: '50px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                  onClick={() => handleTransactionUpdate(order._id, 'paid')}
                                >
                                  Paid
                                </button>
                                <button
                                  style={{ backgroundColor: 'red', width: '80px', height: '50px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px', padding: '0 10px' }}
                                  onClick={() => handleTransactionUpdate(order._id, 'unpaid')}
                                >
                                  Unpaid
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
            <div className="content_footer">
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

export default ManageTransactions;
