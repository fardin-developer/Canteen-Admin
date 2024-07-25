import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'react-icons/tb';
import Input from '../../components/common/Input.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import CheckBox from '../../components/common/CheckBox.jsx';
import Dropdown from '../../components/common/Dropdown.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import TableAction from '../../components/common/TableAction.jsx';
import axios from 'axios';
import './ManageStudents.css';

const ManageStudents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);
  const [StudentData, setStudentData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [specificChecks, setSpecificChecks] = useState({});
  const [bulkCheck, setBulkCheck] = useState(false);
  const [viewedStudent, setViewedStudent] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [userVerify, setuserVerify] = useState(false)

  const tableRow = [
    { value: 2, label: '2' },
    { value: 5, label: '5' },
    { value: 10, label: '10' }
  ];

  const bulkAction = [
    { value: 'delete', label: 'Delete' },
    { value: 'status', label: 'Status' }
  ];

  const bulkActionDropDown = selectedOption => {
    console.log(selectedOption);
  };

  const onPageChange = newPage => {
    setCurrentPage(newPage);
  };

  const handleBulkCheckbox = isCheck => {
    setBulkCheck(isCheck);
    if (isCheck) {
      const updateChecks = {};
      StudentData.forEach(student => {
        updateChecks[student.id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  const handleCheckStudent = (isCheck, id) => {
    setSpecificChecks(prevSpecificChecks => ({
      ...prevSpecificChecks,
      [id]: isCheck
    }));
  };

  const showTableRow = selectedOption => {
    setSelectedValue(selectedOption.label);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const actionItems = ['View', 'Delete'];

  const handleActionItemClick = (item, student) => {
    const updateItem = item.toLowerCase();
    if (updateItem === 'view') {
      setViewedStudent(student);
      setIsOverlayVisible(true);
    } else if (updateItem === 'delete') {
      alert(`#${student.id} student delete`);
    }
  };

  const fetchStudents = (page, limit) => {
    axios.get(`https://canteen.fardindev.me/api/v1/users?page=${page}&limit=${limit}`)
      .then(res => {
        setStudentData(res.data.users);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
      });
  };

  useEffect(() => {
    fetchStudents(currentPage, selectedValue);
  }, [currentPage, selectedValue]);

  const handleCloseOverlay = () => {
    setIsOverlayVisible(false);
    setViewedStudent(null);
  };

  const refreshData = () => {
    fetchStudents(currentPage, selectedValue);
  };

  const handleVerifyStudent = (student, status) => {
    console.log(status);
    axios.get(`https://canteen.fardindev.me/api/v1/users/verify-user?id=${student._id}&status=${status}`)
      .then((res) => {
        console.log(res.data.success);
        if (res.data.success) {
          setuserVerify(true)
        }
        refreshData();
        handleCloseOverlay();
      })
      .catch(err => {
        console.error("Error verifying student:", err);
      });
  };

  return (
    <section className='students'>
      <div className='container'>
        <div className='wrapper'>
          <div className='content transparent'>
            <div className='content_head' style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Dropdown
                placeholder='Bulk Action'
                className='sm'
                onClick={bulkActionDropDown}
                options={bulkAction}
              />
              <Input
                placeholder='Search Student...'
                className='sm table_search'
              />
            </div>
            <div className='content_body'>
              <div className='table_responsive'>
                <table className='separate'>
                  <thead>
                    <tr>
                      <th className='td_id td_checkbox'>S.N</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Roll No</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {StudentData.map((student, key) => (
                      <tr key={key}>
                        <td>{key + 1}</td>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.rollno}</td>
                        <td>{student.dept}</td>
                        <td>
                          {student.verified ? <Badge label='verified' className='light-success' /> : <Badge label='not verified' className='light-danger' />}
                        </td>
                        <td className='td_action'>
                          <button onClick={() => handleActionItemClick('view', student)}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='content_footer'>
              <Dropdown
                className='top show_rows sm'
                placeholder='Please Select'
                selectedValue={selectedValue}
                onClick={showTableRow}
                options={tableRow}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </div>

          {isOverlayVisible && viewedStudent && (
            <div className='overlay'>
              <div className='overlay-content'>
                <span className='close' onClick={handleCloseOverlay}>&times;</span>
                {console.log(viewedStudent)}
                <img src={"https://canteen.fardindev.me/" + viewedStudent.studentID} alt='Student ID' className='student-image' />
                <div className='student-actions'>
                  <button onClick={() => handleVerifyStudent(viewedStudent, 'accept')}>Accept</button>
                  <button onClick={() => handleVerifyStudent(viewedStudent, 'reject')}>Reject</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ManageStudents;
