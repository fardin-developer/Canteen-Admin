import * as Icons from 'react-icons/tb';
import Labels from '../../api/Labels.json';
import React, { useState, useEffect } from 'react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Dropdown from '../../components/common/Dropdown.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';
import TextEditor from '../../components/common/TextEditor.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const EditProduct = ({ productData }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: 'a small desc',
    cost: '',
    price: '',
    sku: '',
    profit: '',
    margin: '',
    quantity: '',
    category: '',
    stock: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);

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
    category: ''
  });

  const [categoryOptions, setCategoryOptions] = useState([]);

  const handleInputChange = (key, value) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      [key]: value
    }));
  };

  const handleFileChange = (files) => {
    setSelectedFile(files[0]);
  };

  useEffect(() => {
    axios.get(`https://canteen.fardindev.me/api/v1/meals/${id}`).then(res => {
      console.log(res.data);
      setProduct(prevProduct => ({
        ...prevProduct,
        name: res.data.meal.name,
        description: res.data.meal.description,
        cost: res.data.meal.cost,
        price: res.data.meal.price,
        category: res.data.meal.category,
        stock: res.data.meal.stock
      }));
      setSelectedValue({
        stockValue: res.data.meal.stock,
        category: res.data.meal.category
      });
    });
  }, [id]);

  useEffect(() => {
    axios.get('https://canteen.fardindev.me/api/v1/category').then(res => {
      const options = res.data.map(category => ({
        value: category._id,
        label: category.name
      }));
      setCategoryOptions(options);
    });
  }, []);

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

  const notify1 = () => {
    toast.error('Product deleted Successfully', {
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

  const updateData = () => {
    const mealdata = new FormData();
    mealdata.append('name', product.name);
    mealdata.append('description', product.description);
    mealdata.append('cost', product.cost);
    mealdata.append('price', product.price);
    mealdata.append('category', product.category);
    mealdata.append('stock', product.stock);
    if (selectedFile) {
      mealdata.append('productImg', selectedFile);
    }

    console.log(mealdata);

    axios
      .patch(`https://canteen.fardindev.me/api/v1/meals/${id}`, mealdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
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

  const handleDelete = () => {
    // Retrieve token from local storage
    const token = JSON.parse(localStorage.getItem('token')); // Adjust the key based on how you store it
    // Set up axios configuration with the Authorization header
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    axios
      .delete(`https://canteen.fardindev.me/api/v1/meals/${id}`, config)
      .then(response => {
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
        console.log('Response:', response);
        notify1(); // Call your notification function
      })
      .catch(error => {
        if (error.response) {
          console.log('Response error:', error.response.data);
          alert(error.response.data.msg);
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
              <FileUpload onFileChange={handleFileChange} />
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
                  value={`${product.margin ? product.margin.toFixed(2) : '- -'}%`}
                />
              </div>
            </div>
          </div>
          <div className='sidebar' style={{ display: 'block' }}>
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
                label='Delete'
                icon={<Icons.TbRowRemove />}
                className=''
                onClick={handleDelete}
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
              <Button
                label='save'
                icon={<Icons.TbCircleCheck />}
                className='success'
                onClick={updateData}
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
    </section>
  );
};

export default EditProduct;
