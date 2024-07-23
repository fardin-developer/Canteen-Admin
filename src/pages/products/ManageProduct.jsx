import * as Icons from 'react-icons/tb'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input.jsx'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import CheckBox from '../../components/common/CheckBox.jsx'
import Dropdown from '../../components/common/Dropdown.jsx'
import Offcanvas from '../../components/common/Offcanvas.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import TableAction from '../../components/common/TableAction.jsx'
import RangeSlider from '../../components/common/RangeSlider.jsx'
import MultiSelect from '../../components/common/MultiSelect.jsx'
import { Cookies } from 'react-cookie'
import axios from 'axios'

const ManageProduct = () => {
  const [data, setData] = useState([])
  const navigate = useNavigate()
  const [fields, setFields] = useState({
    name: '',
    sku: '',
    store: '',
    status: '',
    priceRange: [0, 100]
  })
  const [test, settest] = useState('')

  const handleRowClick = (productId) => {
    navigate(`/catalog/product/edit/${productId}`);
  };

  useEffect(() => {
    const cookies = new Cookies()
    let cdata = cookies.get('token')
    settest(cdata)
    console.log('djfjn ' + cdata)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        console.log('2')
        const requestOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${test}` // Set the token in the Authorization header
          }
        }

        const response = await fetch(
          'http://localhost:8000/api/v1/meals/',
          requestOptions
        )
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const responseData = await response.json()
        console.log('Data:', responseData)
        setData(responseData.meals)
      } catch (error) {
        console.error('Error fetching meals:', error.message)
      }
    }

    fetchData()
  }, [test])

  const [bulkCheck, setBulkCheck] = useState(false)
  const [specificChecks, setSpecificChecks] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedValue, setSelectedValue] = useState(5)
  const [tableRow, setTableRow] = useState([
    { value: 2, label: '2' },
    { value: 5, label: '5' },
    { value: 10, label: '10' }
  ])
  const handleInputChange = (key, value) => {
    setFields({
      ...product,
      [key]: value
    })
  }

  const bulkAction = [
    { value: 'delete', label: 'Delete' },
    { value: 'category', label: 'Category' },
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
      products.forEach(product => {
        updateChecks[product.id] = true
      })
      setSpecificChecks(updateChecks)
    } else {
      setSpecificChecks({})
    }
  }

  const handleCheckProduct = (isCheck, id) => {
    setSpecificChecks(prevSpecificChecks => ({
      ...prevSpecificChecks,
      [id]: isCheck
    }))
  }

  const showTableRow = selectedOption => {
    setSelectedValue(selectedOption.label)
  }

  const actionItems = ['Delete', 'edit']

  const handleActionItemClick = (item, itemID) => {
    var updateItem = item.toLowerCase()
    if (updateItem === 'delete') {
      alert(`#${itemID} item delete`)
    } else if (updateItem === 'edit') {
      navigate(`/catalog/product/manage/${itemID}`)
    }
  }

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false)

  const handleToggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen)
  }

  const handleCloseOffcanvas = () => {
    setIsOffcanvasOpen(false)
  }

  const handleSliderChange = newValues => {
    setFields({
      ...fields,
      priceRange: newValues
    })
  }

  const stores = [
    { label: 'FashionFiesta' },
    { label: 'TechTreasures' },
    { label: 'GadgetGrove' },
    { label: 'HomeHarbor' },
    { label: 'HealthHaven' },
    { label: 'BeautyBoutique' },
    { label: "Bookworm's Haven" },
    { label: 'PetParadise' },
    { label: 'FoodieFinds' }
  ]
  const status = [
    { label: 'In Stock' },
    { label: 'Out of Stock' },
    { label: 'Available Soon' },
    { label: 'Backorder' },
    { label: 'Refurbished' },
    { label: 'On Sale' },
    { label: 'Limited Stock' },
    { label: 'Discontinued' },
    { label: 'Coming Soon' },
    { label: 'New Arrival' },
    { label: 'Preorder' }
  ]
  const handleSelectStore = selectedValues => {
    setFields({
      ...fields,
      store: selectedValues
    })
  }

  const handleSelectStatus = selectedValues => {
    setFields({
      ...fields,
      status: selectedValues.label
    })
  }

  return (
    <section className='products'>
      <div className='container'>
        <div className='wrapper'>
          <div className='content transparent'>
            <div className='content_head'>
              {/* <Dropdown
                placeholder='Bulk Action'
                className='sm'
                onClick={bulkActionDropDown}
                options={bulkAction}
              />
             */}
              <Input
                placeholder='Search Product...'
                className='sm table_search'
              />
                <Button
                label='Search'
                className='sm'
                icon={<Icons.TbSearch />}
                onClick={handleToggleOffcanvas}
              />
              <Offcanvas
                isOpen={isOffcanvasOpen}
                onClose={handleCloseOffcanvas}
              >
                <div className='offcanvas-head'>
                  <h2>Advance Search</h2>
                </div>
                <div className='offcanvas-body'>
                  <div className='column'>
                    <Input
                      type='text'
                      placeholder='Enter the product name'
                      label='Name'
                      value={fields.name}
                      onChange={value => handleInputChange('name', value)}
                    />
                  </div>
                  <div className='column'>
                    <Input
                      type='text'
                      label='Price'
                      value={fields.price}
                      placeholder='Enter the product price'
                      onChange={value => handleInputChange('price', value)}
                    />
                  </div>
                  <div className='column'>
                    <MultiSelect
                      options={stores}
                      placeholder='Select Store'
                      label='Store'
                      isSelected={fields.store}
                      onChange={handleSelectStore}
                    />
                  </div>
                  <div className='column'>
                    <Dropdown
                      options={status}
                      placeholder='Select Store'
                      label='Store'
                      selectedValue={fields.status}
                      onClick={handleSelectStatus}
                    />
                  </div>
                  <div className='column'>
                    <RangeSlider
                      label='Price range'
                      values={fields.priceRange}
                      onValuesChange={handleSliderChange}
                    />
                  </div>
                </div>
                <div className='offcanvas-footer'>
                  <Button
                    label='Discard'
                    className='sm outline'
                    icon={<Icons.TbX />}
                    onClick={handleCloseOffcanvas}
                  />
                  <Button
                    label='Filter'
                    className='sm'
                    icon={<Icons.TbFilter />}
                    onClick={handleCloseOffcanvas}
                  />
                </div>
              </Offcanvas>
              <div className='btn_parent'>
                <Link to='/catalog/product/add' className='sm button'>
                  <Icons.TbPlus />
                  <span>Create Product</span>
                </Link>
                <Button
                  label='Reload'
                  icon={<Icons.TbRefresh />}
                  className='sm'
                />
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
                      <th className='td_id'>id</th>
                      <th className='td_image'>image</th>
                      <th colSpan='2'>name</th>
                      <th>price</th>
                      <th>Category</th>
                      {/* <th>sku</th> */}
                      {/* <th>created at</th> */}
                      {/* <th className='td_status'>status</th> */}
                      <th className='td_status'>stock status</th>
                      <th className='td_action'>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((product, key) => {
                      return (
                        <tr key={product._id} onClick={() => handleRowClick(product._id)}>
                          <td className='td_checkbox'>
                            <CheckBox
                              onChange={isCheck =>
                                handleCheckProduct(isCheck, product.id)
                              }
                              isChecked={specificChecks[product.id] || false}
                            />
                          </td>

                          <td className='td_id'>{key + 1}</td>
                          <td className='td_image'>
                            <img src={product.image} alt={product.name} />
                          </td>

                          <td colSpan='2'>
                            <Link to={product.id}>{product.name}</Link>
                          </td>
                          <td>
                            {`${product.price} `}
                            <b>₹ </b>
                          </td>
                          <td>
                            <Link>{product.category}</Link>
                          </td>

                          {/* <td>{product.availability_dates.start_date}</td> */}

                          <td className='td_status'>
                            {product.stock === 'available' ? (
                              <Badge
                                label='In Stock'
                                className='light-success'
                              />
                            ) : (
                              <Badge
                                label='Low Stock'
                                className='light-warning'
                              />
                            )}
                          </td>
                          <td className='td_action'>
                            <TableAction
                              actionItems={actionItems}
                              onActionItemClick={item =>
                                handleActionItemClick(item, product.id)
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

export default ManageProduct
