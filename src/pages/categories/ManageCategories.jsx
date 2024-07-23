import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Divider from "../../components/common/Divider.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import axios from "axios";

const ManageCategories = () => {
  const [categoryArr, setCategoryArr] = useState([]);
  const navigate = useNavigate();
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);
  const [tableRow, setTableRow] = useState([
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
  ]);

  const [fields, setCategories] = useState({
    name: "",
    status: "",
  });

  const handleInputChange = (key, value) => {
    setCategories({
      ...fields,
      [key]: value,
    });
  };

  const bulkAction = [
    { value: "delete", label: "Delete" },
    { value: "category", label: "Category" },
    { value: "status", label: "Status" },
  ];

  const bulkActionDropDown = (selectedOption) => {
    console.log(selectedOption);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const showTableRow = (selectedOption) => {
    setSelectedValue(selectedOption.label);
  };

  const actionItems = ["Delete", "edit"];

  const handleActionItemClick = (item, itemId) => {
    const updateItem = item.toLowerCase();
    if (updateItem === "delete") {
      deleteCategory(itemId);
    } else if (updateItem === "edit") {
      navigate(`/catalog/categories/manage/${itemId}`);
    }
  };

  const deleteCategory = (id) => {
    axios
      .delete(`http://localhost:8000/api/v1/category/${id}`)
      .then((response) => {
        console.log(response);
        setCategoryArr(categoryArr.filter((category) => category._id !== id));
        // setCategories({
        //   ...fields,
        //   status: 'deleted',
        // });
        
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const convertUTCToIST = (utcDate) => {
    const date = new Date(utcDate);
    const istOffset = 1;
    const istDate = new Date(date.getTime() + istOffset);
    const formattedDate = istDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return formattedDate;
  };

  const createCategory = () => {
    axios
      .post("http://localhost:8000/api/v1/category", fields)
      .then((response) => {
        console.log(response);
        setCategories({
          ...fields,
          status: 'created',
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/category")
      .then((res) => {
        console.log(res.data);
        setCategoryArr(res.data);
        setCategories({
          ...fields,
          status: '',
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [fields.status]);

  return (
    <section className="categories">
      <div className="container">
        <div className="wrapper">
          <div className="sidebar" style={{display:'block',width:'30%'}}>
            <div className="sidebar_item" style={{ backgroundColor: "" }}>
              <h2 className="sub_heading">Add category</h2>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Enter the fields name"
                  label="Name"
                  value={fields.name}
                  onChange={(value) => handleInputChange("name", value)}
                />
              </div>
              <Divider />
              <Button
                label="Discard"
                className="left outline"
                onClick={() => {
                  navigate("/");
                }}
              />
              <Button label="create" onClick={createCategory} />
            </div>
          </div>
          <div className="content transparent">
            <div className="content_head">
              {/* <Dropdown
                placeholder="Bulk Action"
                className="sm"
                onClick={bulkActionDropDown}
                options={bulkAction}
              /> */}
              {/* <Input placeholder="Search Categories..." className="sm table_search" /> */}
            </div>
            <div className="content_body">
              <div className="table_responsive">
                <table className="separate">
                  <thead>
                    <tr>
                      <th colSpan="2">S. No.</th>
                      <th colSpan="2">name</th>
                      <th colSpan="2">created at</th>
                      <th colSpan="2" className="td_action">actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryArr.map((category, key) => (
                      <tr key={key}>
                        <td colSpan="2">{key + 1}</td>
                        <td colSpan="2">
                          <Link to={category.id}>{category.name}</Link>
                        </td>
                        <td colSpan="2">{convertUTCToIST(category.createdAt)}</td>
                        <td className="td_action">
                          <TableAction
                            actionItems={actionItems}
                            onActionItemClick={(item) => handleActionItemClick(item, category._id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* <div className="content_footer">
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
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageCategories;
