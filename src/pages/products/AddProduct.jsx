import * as Icons from 'react-icons/tb';
import Labels from '../../api/Labels.json';
import React, { useState, useEffect } from 'react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Dropdown from '../../components/common/Dropdown.jsx';
import DropZone from '../../components/common/FileUpload.jsx';
import TextEditor from '../../components/common/TextEditor.jsx';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AddProduct = ( ) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    cost: '',
    price: '',
    sku: '',
    profit: '',
    margin: '',
    quantity: '',
    category: '',
    stock: ''
    // user: '6664287d08cf545c449aa6dd'
  });

  const [selectOptions, setSelectOptions] = useState([
    {
      value: 'success',
      label: 'available'
    },
    {
      value: 'false',
      label: 'unavailable'
    }
  ]);

  const [selectedValue, setSelectedValue] = useState({
    stockValue: '',
    attribute: '',
    attributeValue: ''
  });

  const MAX_DESCRIPTION_LENGTH = 200; // Maximum description length

  const handleInputChange = (key, value) => {
    if (key === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
      toast.error(`Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }
    setProduct(prevProduct => ({
      ...prevProduct,
      [key]: value
    }));
  };

  const navigate = useNavigate();

  useEffect(() => {
    const profit = product.price - product.cost;
    const margin = (profit / product.price) * 100;
    setProduct(prevProduct => ({
      ...prevProduct,
      profit: profit,
      margin: margin ? margin : ''
    }));
  }, [product.cost, product.price]);

  const handleStockSelect = selectedOption => {
    setProduct(prevProduct => ({
      ...prevProduct,
      stock: selectedOption.label
    }));
    setSelectedValue(prevSelectedValue => ({
      ...prevSelectedValue,
      stockValue: selectedOption.label
    }));
  };

  const handleCategorySelect = selectedOption => {
    setProduct(prevProduct => ({
      ...prevProduct,
      category: selectedOption.label
    }));
    setSelectedValue(prevSelectedValue => ({
      ...prevSelectedValue,
      category: selectedOption.label
    }));
  };

  const categoryOptions = [
    { value: 'breakfast', label: 'breakfast' },
    { value: 'lunch', label: 'lunch' },
    { value: 'snacks', label: 'snacks' },
    { value: 'juice', label: 'juice' },
    { value: 'others', label: 'others' }
  ];

  const [labels, setLabels] = useState(Labels);

  const handleCheckTax = (id, checked) => {
    setTaxes(prevCheckboxes =>
      prevCheckboxes.map(checkbox =>
        checkbox.id === id ? { ...checkbox, isChecked: checked } : checkbox
      )
    );
  };

  const handleCheckCollection = (id, checked) => {
    setCollections(prevCheckboxes =>
      prevCheckboxes.map(checkbox =>
        checkbox.id === id ? { ...checkbox, isChecked: checked } : checkbox
      )
    );
  };

  const handleCheckLabels = (id, checked) => {
    setLabels(prevCheckboxes =>
      prevCheckboxes.map(checkbox =>
        checkbox.id === id ? { ...checkbox, isChecked: checked } : checkbox
      )
    );
  };

  const notify = () => {
    toast.success('Product saved Successfully', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    setTimeout(() => {
      navigate('/catalog/product/manage');
    }, 2000);
  };

  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (file) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      productImg: file // Assuming 'productImg' matches your backend's expected field name
    }));
  };

  const submitData = () => {
    const formData = new FormData();
    Object.keys(product).forEach(key => {
      formData.append(key, product[key]);
    });
    if (imageFile) {
      formData.append('productImg', imageFile);
    }

    axios
      .post('http://localhost:8000/api/v1/meals', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log('Response Status:', response.status); // Logs the status code
        console.log('Response Data:', response.data); // Logs the response data
        console.log('Response:', response);
        notify();
      })
      .catch(error => {
        if (error.response) {
          console.log('Response error:', error.response.data);
        } else if (error.request) {
          console.log('Request error:', error.request);
        } else {
          console.log('Error:', error.message);
        }
        console.log('Error config:', error.config);
      });
  };

  return (
    <section>
      <div className='container'>
        <div className='wrapper'>
          <div className='content'>
            <div className='content_item'>
              <h2 className='sub_heading'>Product Info</h2>
              <div className='column'>
                <Input
                  type='text'
                  placeholder='Enter the product name'
                  label='Name'
                  icon={<Icons.TbShoppingCart />}
                  value={product.name}
                  onChange={value => handleInputChange('name', value)}
                />
              </div>
              <div className='column'>
                <TextEditor
                  label='Description'
                  placeholder='Enter a description'
                  value={product.description}
                  onChange={value => handleInputChange('description', value)}
                />
              </div>
            </div>
            <div className='content_item'>
              <h2 className='sub_heading'>Product Images</h2>
              <DropZone onFileChange={handleFileChange} />
              </div>
            <div className='content_item'>
              <h2 className='sub_heading'>Pricing</h2>
              <div className='column_2'>
                <Input
                  type='number'
                  placeholder='Enter the product Cost'
                  icon={<Icons.TbCoin />}
                  label='Cost'
                  value={product.cost}
                  onChange={value => handleInputChange('cost', value)}
                />
              </div>
              <div className='column_2'>
                <Input
                  type='number'
                  placeholder='Enter the selling Price of the product'
                  icon={<Icons.TbCoin />}
                  label='Price sale'
                  value={product.price}
                  onChange={value => handleInputChange('price', value)}
                />
              </div>
              <div className='column_3'>
                <Input
                  type='number'
                  placeholder='- -'
                  label='Profit'
                  readOnly={true}
                  value={product.profit}
                />
              </div>
              <div className='column_3'>
                <Input
                  type='text'
                  placeholder='- -'
                  label='Margin'
                  readOnly={true}
                  value={`${
                    product.margin ? product.margin.toFixed(2) : '- -'
                  }%`}
                />
              </div>
            </div>
          </div>
          <div className='sidebar' style={{display:'block'}}>
            <div className='sidebar_item'>
              <h2 className='sub_heading'>Stock status</h2>
              <div className='column'>
                <Dropdown
                  placeholder='select stock status'
                  selectedValue={selectedValue.stockValue}
                  onClick={handleStockSelect}
                  options={selectOptions}
                  className='sm'
                />
              </div>
            </div>
            <div className='sidebar_item'>
              <h2 className='sub_heading'>Categories</h2>
              <Dropdown
                className='sm'
                options={categoryOptions}
                placeholder='Select category...'
                onClick={handleCategorySelect}
                selectedValue={selectedValue.category}
              />
            </div>
            <div className='sidebar_item'>
              <h2 className='sub_heading'>Publish</h2>
              <Button
                label='save & exit'
                icon={<Icons.TbDeviceFloppy />}
                className=''
              />
              <div>
                <Button
                  label='save'
                  icon={<Icons.TbCircleCheck />}
                  className='success'
                  onClick={submitData}
                />
                <ToastContainer
                  position='top-right'
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme='light'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;
