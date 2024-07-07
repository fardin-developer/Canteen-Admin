import { Link } from 'react-router-dom'
import React, { useState,useEffect } from 'react'
import * as Icons from 'react-icons/tb'
import Input from '../../components/common/Input.jsx'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import CheckBox from '../../components/common/CheckBox.jsx'
import Dropdown from '../../components/common/Dropdown.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import TableAction from '../../components/common/TableAction.jsx'
import axios from 'axios'


const students = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    rollNo: '1001',
    department: 'Computer Science'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    rollNo: '1002',
    department: 'Electrical Engineering'
  },
  {
    id: 3,
    name: 'Jim Brown',
    email: 'jim@example.com',
    rollNo: '1003',
    department: 'Mechanical Engineering'
  }
]

const ManageStudents = () => {
  const [bulkCheck, setBulkCheck] = useState(false)
  const [specificChecks, setSpecificChecks] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedValue, setSelectedValue] = useState(5)
  const [StudentData, setStudentData] = useState([])
  const [pending, setpending] = useState()
  const [tableRow, setTableRow] = useState([
    { value: 2, label: '2' },
    { value: 5, label: '5' },
    { value: 10, label: '10' }
  ])

  const bulkAction = [
    { value: 'delete', label: 'Delete' },
    { value: 'status', label: 'Status' }
  ]

  const bulkActionDropDown = selectedOption => {
    console.log(selectedOption)
  }

  const onPageChange = newPage => {
    setCurrentPage(newPage)
  }

  const handleBulkCheckbox = isCheck => {
    setBulkCheck(isCheck)
    if (isCheck) {
      const updateChecks = {}
      students.forEach(student => {
        updateChecks[student.id] = true
      })
      setSpecificChecks(updateChecks)
    } else {
      setSpecificChecks({})
    }
  }

  const handleCheckStudent = (isCheck, id) => {
    setSpecificChecks(prevSpecificChecks => ({
      ...prevSpecificChecks,
      [id]: isCheck
    }))
  }

  const showTableRow = selectedOption => {
    setSelectedValue(selectedOption.label)
  }

  const actionItems = ['Delete', 'View', 'Edit']

  const handleActionItemClick = (item, itemID) => {
    var updateItem = item.toLowerCase()
    if (updateItem === 'delete') {
      alert(`#${itemID} student delete`)
    } else if (updateItem === 'view') {
      alert(`View student #${itemID}`)
    }
  }
 

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/users')

    .then((res)=>{
      console.log(res.data);
       setStudentData(res.data.users)
      console.log(StudentData);
    })
    
  }, [])
  

  return (
    <section className='students'>
      <div className='container'>
        <div className='wrapper'>
          <div className='content transparent'>
            <div className='content_head'>
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
              <div className='btn_parent'>
                <Link to='/students/add' className='sm button'>
                  <Icons.TbPlus />
                  <span>Create Student</span>
                </Link>
                <Button label='Advance Filter' className='sm' />
                <Button label='save' className='sm' />
              </div>
            </div>
            <div className='content_body'>
              <div className='table_responsive'>
                <table className='separate'>
                  <thead>
                    <tr>
                      <th className='td_checkbox'>
                        <CheckBox
                          onChange={handleBulkCheckbox}
                          isChecked={bulkCheck}
                        />
                      </th>
                      <th className='td_id'>Student ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Roll No</th>
                      <th>Department</th>
                      <th>status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(StudentData)?
                    StudentData.map((student, key) => {
                      return (
                        <tr key={key}>
                          <td className='td_checkbox'>
                            <CheckBox
                              onChange={isCheck =>
                                handleCheckStudent(isCheck, student.id)
                              }
                              isChecked={specificChecks[student._id] }
                            />
                          </td>
                          <td className='td_id'>{key+1}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.rollno}</td>
                          <td>{student.dept}</td>
                          <td>
                            <Badge label='success' className='light-success' />
                          </td>
                          <td className='td_action'>
                            <TableAction
                              actionItems={actionItems}
                              onActionItemClick={item =>
                                handleActionItemClick(item, student.id)
                              }
                            />
                          </td>
                        </tr>
                      )
                    }):''
                  }
                    {students.map((student, key) => {
                      return (
                        <tr key={key}>
                          {/* <td className='td_checkbox'>
                            <CheckBox
                              onChange={isCheck =>
                                handleCheckStudent(isCheck, student.id)
                              }
                              isChecked={specificChecks[student.id] || false}
                            />
                          </td> */}
                          <td className='td_id'>{student.name}</td>
                          {/* <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.rollNo}</td>
                          <td>{student.department}</td> */}
                          <td>
                            <Badge label='success' className='light-success' />
                          </td>
                          <td className='td_action'>
                            <TableAction
                              actionItems={actionItems}
                              onActionItemClick={item =>
                                handleActionItemClick(item, student.id)
                              }
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='content_footer'>
              <Dropdown
                className='top show_rows sm'
                placeholder='please select'
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
  )
}

export default ManageStudents
