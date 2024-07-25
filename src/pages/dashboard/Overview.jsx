import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from "react-icons/tb";
import Bar from '../../charts/Bar.jsx';
import Area from '../../charts/Area.jsx';
import Products from '../../api/Products.json';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import Profile from '../../components/common/Profile.jsx';
import BarChart from '../../../src/charts/BarChart.jsx'
import axios from 'axios';
import './dashboard.css'

const Overview = () => {
	const [totalprice, setTotalPrice] = useState('');
	const [totalCost, setTotalCost] = useState('');
	const [totalOrder, setTotalOrder] = useState('');
	const [dailySales, setDailySales] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [categoryStore, setCategoryStore] = useState([]);
	const [bestSellingProducts, setBestSellingProducts] = useState([]);

	useEffect(() => {
		// Fetch dashboard data
		axios.get('https://canteen.fardindev.me/api/v1/dashboard')
			.then((res) => {
				setTotalPrice(res.data.totalPrice);
				setTotalCost(res.data.totalcost);
				console.log(res.data.totalPrice);
				setTotalOrder(res.data.totalOrder);
				setDailySales(res.data.todaysOrders);
			})
			.catch(err => console.error("Error fetching dashboard data:", err));

		// Fetch best-selling products data
		axios.get('https://canteen.fardindev.me/api/v1/dashboard/best-selling-product')
			.then((res) => {
				setBestSellingProducts(res.data.bestSellingProducts);
				console.log(bestSellingProducts);
			})
			.catch(err => console.error("Error fetching best-selling products:", err));

		const loadDynamicCategory = async () => {
			let ssdata = await axios.get('https://canteen.fardindev.me/api/v1/category');
			setCategoryStore(ssdata.data);
		};

		loadDynamicCategory();
	}, []);

	const handleCategoryChange = (e) => {
		setSelectedCategory(e.target.value);
	};

	const filteredSales = selectedCategory === 'All' ? dailySales : dailySales.filter(sale => sale.category === selectedCategory);

	return (
		<section>
			<div className="container">
				<div className="wrapper dashboardWrappper">
					<div className="content">
						<div className="content_item sale_overview" style={{}}>
							<div className="sale_overview_card">
								<Icons.TbShoppingCart />
								<div className="sale_overview_content">
									<h5 className="sale_title">Total Sale</h5>
									<h4 className="sale_value">₹{totalprice?.toLocaleString('en-US')||'loadin'}</h4>
								</div>
							</div>
							<div className="sale_overview_card">
								<Icons.TbShoppingBag />
								<div className="sale_overview_content">
									<h5 className="sale_title">Total Cost</h5>
									<h4 className="sale_value">{totalCost?.toLocaleString('en-US')}</h4>
								</div>
							</div>
							<div className="sale_overview_card">
								<Icons.TbPackage />
								<div className="sale_overview_content">
									<h5 className="sale_title">Total Orders</h5>
									<h4 className="sale_value">{totalOrder?totalOrder:'loading'}</h4>
								</div>
							</div>
							<div className="sale_overview_card">
								<Icons.TbChartBar />
								<div className="sale_overview_content">
									<h5 className="sale_title">Total Revenue</h5>
									<h4 className="sale_value">₹{totalCost && totalprice && (totalprice - totalCost).toLocaleString('en-US')}</h4>
									</div>
							</div>
						</div>
						<div className="content_item">
							<h2 className="sub_heading">
								<span>Sale Analytic</span>
							</h2>
							<Area />
						</div>
						<div className="content_item daily-sales">
							<h2 className="sub_heading">Daily Item Sales</h2>
							<div className="category_filter">
								<label htmlFor="category">Filter by Category: </label>
								<select id="category" value={selectedCategory} onChange={handleCategoryChange}>
									<option value="All">All</option>
									{categoryStore && categoryStore.map((category) => (
										<option key={category.name} value={category.name}>{category.name}</option>
									))}
								</select>
							</div>
							<div className="table-wrapper">
								<table className="simple">
									<thead>
										<tr>
											<th>Item Name</th>
											<th>Category</th>
											<th>Sales</th>
											<th>Number of Items</th>
										</tr>
									</thead>
									<tbody>
										{filteredSales.map((sale) => (
											<tr key={sale.id}>
												<td>{sale.name}</td>
												<td>{sale.category}</td>
												<td>{sale.sales}</td>
												<td>{sale.items}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						<BarChart/>
						<div className="content_item dashBoard-best-selling">
							<h2 className="sub_heading">Best Selling Products</h2>
							<div className="table-wrapper">
								<table className="simple">
									<thead>
										<tr>
											<th>Name</th>
											<th>Category</th>
											<th>Sales</th>
											<th>Quantity</th>
										</tr>
									</thead>
									<tbody>
										{bestSellingProducts.map((product) => (
											<tr key={product.productId}>
												<td>{product.name}</td>
												<td>{product.category}</td>
												<td>₹{product.totalSales}</td>
												<td>{product.totalAmount}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						<div>
						
					</div>
					</div>
					{/* <div className="sidebar">
						<div className="sidebar_item">
							<h2 className="sub_heading">Audience</h2>
							<Bar />
						</div>
						<div className="sidebar_item">
							<h2 className="sub_heading">Order Recently</h2>
							<div className="recent_orders column">
								{
									Products.map((product, key) => (
										<Link key={key} to={`/orders/manage/${product.id}`} className="recent_order">
											<figure className="recent_order_img">
												<img src={product.images.thumbnail} alt="" />
											</figure>
											<div className="recent_order_content">
												<h4 className="recent_order_title">{product.name}</h4>
												<p className="recent_order_category">{product.category}</p>
											</div>
											<div className="recent_order_details">
												<h5 className="recent_order_price">₹{product.price}</h5>
												<p className="recent_order_quantity">items: {product.inventory.quantity}</p>
											</div>
										</Link>
									))
								}
							</div>
						</div>
					</div> */}

					
				</div>
			
			</div>
		</section>
	)
}

export default Overview;
