import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SellerService } from '@app/services/seller.service';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, NgbDropdownModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.scss'],
})
export class SellerDashboardComponent implements AfterViewInit {
  sellerProducts: any[] = [];
  sellerOrders: any[] = [];
  mostSoldProducts: any[] = [];
  totalProfit: number = 0;
  availableYears: number[] = []; // Years available in the data
  selectedYear: number = new Date().getFullYear(); // Default to current year
  yearlyData: any = {}; // Data for all years
  monthlyData: any[] = [];

  ordersChart: Chart | null = null; // Store the orders chart instance
  profitChart: Chart | null = null; // Store the profit chart instance

  constructor(private sellerService: SellerService) {}

  ngAfterViewInit(): void {
    Chart.register(...registerables);
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.sellerService.getDashboardData().subscribe({
      next: (response) => {
        this.sellerProducts = response.data.sellerProducts;
        this.sellerOrders = response.data.sellerOrders;
        this.mostSoldProducts = response.data.mostSoldProducts;
        this.totalProfit = response.data.totalProfit;
        this.yearlyData = response.data.yearlyData;
        this.availableYears = Object.keys(this.yearlyData).map((year) => +year); // Extract available years
        this.updateMonthlyData(this.selectedYear); // Initialize with the default year
        this.createCharts();
      },
      error: (err) => {
        console.error('Failed to fetch dashboard data:', err);
      },
    });
  }

  // Update monthly data for the selected year
  updateMonthlyData(year: number) {
    this.monthlyData = this.yearlyData[year] || [];
  }

  onYearChange(year: number) {
    this.selectedYear = year;
    this.updateMonthlyData(this.selectedYear);
    this.updateCharts();
  }

  // Create or update the charts
  createCharts(): void {
    this.createOrdersChart();
    this.createProfitChart();
  }

  // Create or update the orders chart
  createOrdersChart(): void {
    const ctx = document.getElementById('ordersChart') as HTMLCanvasElement;

    // Destroy the existing chart if it exists
    if (this.ordersChart) {
      this.ordersChart.destroy();
    }

    this.ordersChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.monthlyData.map((month) => month.monthName),
        datasets: [
          {
            label: 'Orders',
            data: this.monthlyData.map((month) => month.ordersCount),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Create or update the profit chart
  createProfitChart(): void {
    const ctx = document.getElementById('profitChart') as HTMLCanvasElement;

    // Destroy the existing chart if it exists
    if (this.profitChart) {
      this.profitChart.destroy();
    }

    this.profitChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.monthlyData.map((month) => month.monthName),
        datasets: [
          {
            label: 'Profit',
            data: this.monthlyData.map((month) => month.totalProfit),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Update both charts
  updateCharts(): void {
    this.createCharts();
  }
}