import { Component, OnInit } from '@angular/core';
import {
  DashboardService,
  DashboardResponse,
  DashboardData,
  MostSoldProduct,
  MonthData,
  Order,
} from '@app/services/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { curveNatural } from 'd3-shape';
import { Branch, BranchService } from '@app/services/branch.service';
import { AdminService, Seller } from '@app/services/admin.service';

@Component({
  selector: 'app-dashboard-analytics',
  standalone: true,
  imports: [
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    NgxChartsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard-analytics.component.html',
  styleUrl: './dashboard-analytics.component.scss',
})
export class DashboardAnalyticsComponent implements OnInit {
  // Data state
  rawData!: DashboardData;
  isLoading = false;

  // Filters
  selectedYear = new Date().getFullYear();
  selectedBranchId?: string;
  selectedSellerId?: string;
  availableYears: number[] = [];
  branches: Branch[] = [];
  sellers: Seller[] = []; // List of sellers

  // Metrics
  totalProfit = 0;
  totalRevenue = 0;
  totalOrders = 0;
  avgOrderValue = 0;
  topProduct?: MostSoldProduct;

  // Visualizations
  monthlyProfitData: any[] = [];
  productPerformance: any[] = [];
  recentOrders: any[] = [];

  // Chart configurations
  vividScheme: Color = {
    domain: ['#647dee', '#7f53ac', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
  };
  curveShape = curveNatural;

  constructor(
    private dashboardService: DashboardService,
    private branchService: BranchService,
    private adminService: AdminService, 
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initializeYearRange();
    this.loadBranches(); 
    this.loadSellers(); 
    this.loadData();
  }

  private initializeYearRange() {
    const currentYear = new Date().getFullYear();
    const startYear = 2021; 
    this.availableYears = Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => currentYear - i 
    );
  }

  private loadBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches = branches;
      },
      error: (err) => {
        this.snackBar.open('Failed to load branches', 'Dismiss', { duration: 5000 });
      },
    });
  }

  private loadSellers() {
    this.adminService.getSellers(1, 1000).subscribe({
      next: (res) => {
        if (res.success) {
          this.sellers = res.data;
        }
      },
      error: (err) => {
        this.snackBar.open('Failed to load sellers', 'Dismiss', { duration: 5000 });
      },
    });
  }

  onYearSelect(event: MatSelectChange) {
    this.selectedYear = event.value;
    this.loadData();
  }

  onBranchSelect(event: MatSelectChange) {
    this.selectedBranchId = event.value;
    this.loadData();
  }

  onSellerSelect(event: MatSelectChange) {
    this.selectedSellerId = event.value;
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.dashboardService
      .getDashboardData(this.selectedYear, this.selectedBranchId, this.selectedSellerId)
      .subscribe({
        next: (res: DashboardResponse) => this.handleDataLoad(res),
        error: (err: Error) => this.handleError(err),
      });
  }

  private handleDataLoad(response: DashboardResponse) {
    this.isLoading = false;

    if (!response?.data) {
      this.snackBar.open('No data available', 'Dismiss', { duration: 5000 });
      return;
    }

    this.rawData = response.data;
    this.calculateMetrics();
    this.prepareVisualizations();
  }

  private calculateMetrics() {
    this.totalProfit = this.rawData.totalProfit || 0;
    this.totalOrders = this.rawData.totalOrders || 0;
    this.totalRevenue = this.rawData.orders?.reduce((sum: number, order: Order) => sum + order.totalPrice, 0) || 0;
    this.avgOrderValue = this.totalOrders > 0
      ? this.totalRevenue / this.totalOrders
      : 0;
    this.topProduct = this.rawData.mostSoldProducts?.[0];
  }

  private prepareVisualizations() {
    // Monthly profit line chart data
    this.monthlyProfitData = [{
      name: 'Monthly Profit',
      series: (this.rawData.yearlyData[String(this.selectedYear)] || [])
        .filter((month: MonthData) => month.totalProfit > 0)
        .map((month: MonthData) => ({
          name: month.monthName.substring(0, 3),
          value: month.totalProfit,
        })),
    }];

    // Product performance bar chart data
    this.productPerformance = (this.rawData.mostSoldProducts || [])
      .map((product: MostSoldProduct) => ({
        name: product.productName,
        value: product.totalRevenue,
      }));

    // Recent orders table data
    this.recentOrders = (this.rawData.orders || [])
      .sort((a: Order, b: Order) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }

  private handleError(error: Error) {
    this.isLoading = false;
    this.snackBar.open(error.message, 'Dismiss', {
      duration: 5000,
      panelClass: 'error-snackbar',
    });
  }
}