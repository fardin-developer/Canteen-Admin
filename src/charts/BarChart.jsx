import React, { Component } from 'react';

class Chart extends Component {
   constructor(props) {
      super(props);
      this.state = {
         dataPoints: []
      };
   }

   componentDidMount() {
      this.fetchData();
   }

   async fetchData() {
      try {
         const response = await fetch('https://canteen.fardindev.me/api/v1/dashboard/best-selling-product');
         const data = await response.json();
         this.setState({
            dataPoints: data.bestSellingProducts.map(product => ({
               y: Math.round(product.totalAmount), 
               label: product.name
            }))
         }, () => this.renderChart()); 
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   }

   renderChart() {
      const options = {
         animationEnabled: true,
         theme: "light2",
         title: {
            text: "Best Selling Products"
         },
         axisX: {
            title: "Product Name",
            reversed: true
         },
         axisY: {
            title: "Total Amount",
            includeZero: true,
            labelFormatter: this.addSymbols
         },
         data: [{
            type: "bar",
            dataPoints: this.state.dataPoints
         }]
      };

      window.CanvasJS.addSymbols = this.addSymbols;
      const chart = new window.CanvasJS.Chart("chartContainer", options);
      chart.render();
   }

   addSymbols(e) {
      const suffixes = ["", "K", "M", "B"];
      const order = Math.max(Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)), 0);
      const suffix = order > suffixes.length - 1 ? suffixes[suffixes.length - 1] : suffixes[order];
      // Ensure the value is rounded to integer
      return window.CanvasJS.formatNumber(Math.round(e.value) / Math.pow(1000, order)) + suffix;
   }

   render() {
      return (
         <div>
            <div id="chartContainer" style={{ height: "570px", width: "100%" }}></div>
         </div>
      );
   }
}

export default Chart;
