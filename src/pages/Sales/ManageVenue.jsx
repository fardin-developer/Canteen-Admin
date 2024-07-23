import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as Icons from 'react-icons/tb'
import Bar from '../../charts/Bar.jsx'
import Products from '../../api/Products.json'
import axios from 'axios'
import './Manager.css'

const Overview = () => {
	const [reportData, setReportData] = useState({
		totalSales: 0,
		pendingOrder: 0,
		deliveredOrder: 0,
		paidOrder: 0,
		totalItems: 0,
		pendingAmount: 0,
		deliveredAmount: 0
	});
	const [dailySales, setDailySales] = useState([])
	const [selectedCategory, setSelectedCategory] = useState('All')
	const [categoryStore, setcategoryStore] = useState([])

	useEffect(() => {
		axios.get('http://localhost:8000/api/v1/dashboard')
		.then((res) => {
			setDailySales(res.data.todaysOrders);
		})
		.catch(err => console.error("Error fetching dashboard data:", err));


		axios.get('http://localhost:8000/api/v1/dashboard/manager-report')
			.then(res => {
				setReportData(res.data);
				console.log(res.data);
			})
			.catch(error => {
				console.error('Error fetching the report data:', error);
			});
	}, []);

	const handleCategoryChange = e => {
		setSelectedCategory(e.target.value)
	}
	const loadDynamicCategpry = async () => {
		let ssdata = await axios.get('http://localhost:8000/api/v1/category')
		console.log(ssdata.data)
		setcategoryStore(ssdata.data)
	}

	const filteredSales =
		selectedCategory === 'All'
			? dailySales
			: dailySales.filter(sale => sale.category === selectedCategory)

	return (
		<section>
			<div className='container'>
				<div className='wrapper dashboardWrappper'>
					<div className='content'>


						<div className='content_item sale_overview' id='paidReportManager'>
							<div className='sale_overview_card'>
								<Icons.TbShoppingCart />
								<div className='sale_overview_content'>
									<h5 className='sale_title'>Total Sales</h5>
									<h4 className='sale_value'>{reportData.totalSales}</h4>
								</div>
							</div>
							<div className='sale_overview_card'>
								<Icons.TbHourglass />
								<div className='sale_overview_content'>
									<h5 className='sale_title'>Pending Orders</h5>
									<h4 className='sale_value'>{reportData.pendingOrder}</h4>
								</div>
							</div>
							<div className='sale_overview_card'>
								<Icons.TbTruckDelivery />
								<div className='sale_overview_content'>
									<h5 className='sale_title'>Delivered Orders</h5>
									<h4 className='sale_value'>{reportData.deliveredOrder}</h4>
								</div>
							</div>
							<div className='sale_overview_card'>
								<Icons.TbCreditCard />
								<div className='sale_overview_content'>
									<h5 className='sale_title'>Paid Orders</h5>
									<h4 className='sale_value'>{reportData.paidOrder}</h4>
								</div>
							</div>
							<div className='sale_overview_card'>
								<Icons.TbListCheck />
								<div className='sale_overview_content'>
									<h5 className='sale_title'>Total Items</h5>
									<h4 className='sale_value'>{reportData.totalItems}</h4>
								</div>
							</div>
							<div className='sale_overview_card'>
								<Icons.TbCash />
								<div className='sale_overview_content'>
									<h5 className='sale_title'>Pending Amount</h5>
									<h4 className='sale_value'>₹{reportData.pendingAmount.toLocaleString('en-US')}</h4>
								</div>
							</div>
							<div className='sale_overview_card'>
								<Icons.TbCash />
								<div className='sale_overview_content'>
									<h5 className='sale_title'>Delivered Amount</h5>
									<h4 className='sale_value'>₹{reportData.deliveredAmount.toLocaleString('en-US')}</h4>
								</div>
							</div>
						</div>



						<div className='content_item daily-sales'>
							<h2 className='sub_heading'>Daily Item Sales</h2>
							<div className='category_filter' style={{marginTop:'20px'}}>
								<label htmlFor='category'>Filter by Category: </label>
								<select
									id='category'
									value={selectedCategory}
									onChange={handleCategoryChange}
									onClick={loadDynamicCategpry}
								>
									<option value='All'>All</option>
									{categoryStore &&
										categoryStore.map(category => (
											<option key={category.name} value={category.name}>
												{category.name}
											</option>
										))}
								</select>
							</div>
							<div className='table-wrapper' style={{marginTop:'20px'}}>
								<table className='simple'>
									<thead>
										<tr>
											<th>Item Name</th>
											<th>Category</th>
											<th>Sales</th>
											<th>Number of Items</th>
										</tr>
									</thead>
									<tbody>
										{filteredSales.map(sale => (
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

					</div>
					<div className='sidebar'>
						<div className='sidebar_item'>
							<h2 className='sub_heading'>Audience</h2>
							<Bar />
						</div>
						<div className='sidebar_item'>
							<h2 className='sub_heading'>Order Recently</h2>
							<div className='recent_orders column'>
								{Products.map((product, key) => (
									<Link
										key={key}
										to={`/orders/manage/${product.id}`}
										className='recent_order'
									>
										<figure className='recent_order_img'>
											<img src={product.images.thumbnail} alt='' />
										</figure>
										<div className='recent_order_content'>
											<h4 className='recent_order_title'>{product.name}</h4>
											<p className='recent_order_category'>
												{product.category}
											</p>
										</div>
										<div className='recent_order_details'>
											<h5 className='recent_order_price'>₹{product.price}</h5>
											<p className='recent_order_quantity'>
												items: {product.inventory.quantity}
											</p>
										</div>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Overview
