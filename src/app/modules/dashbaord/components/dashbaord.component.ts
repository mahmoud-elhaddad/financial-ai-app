import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SizeEnum } from 'src/app/core/enums/size-enum';
import { IBreadcrumbItem } from 'src/app/core/interfaces/IBreadcrumbItem';
import { DashboardChartService, DashboardStats } from 'src/app/core/services/dashboard-chart/dashboard-chart.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
@Component({
    selector: 'app-dashbaord',
    standalone: false,
    providers: [provideNativeDateAdapter()],
    templateUrl: './dashbaord.component.html',
    styleUrl: './dashbaord.component.scss'
})
export class DashbaordComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    // Chart data properties
    revenueChartData: ChartConfiguration['data'] = { datasets: [] };
    userGrowthChartData: ChartConfiguration['data'] = { datasets: [] };
    subscriptionDistributionData: ChartConfiguration['data'] = { datasets: [] };
    monthlyPerformanceData: ChartConfiguration['data'] = { datasets: [] };
    
    // Chart options
    revenueChartOptions: ChartConfiguration['options'] = {};
    userGrowthChartOptions: ChartConfiguration['options'] = {};
    subscriptionDistributionOptions: ChartConfiguration['options'] = {};
    monthlyPerformanceOptions: ChartConfiguration['options'] = {};
    
    // Chart types
    revenueChartType: ChartType = 'line';
    userGrowthChartType: ChartType = 'line';
    subscriptionDistributionType: ChartType = 'doughnut';
    monthlyPerformanceType: ChartType = 'bar';
    
    // Dashboard statistics
    dashboardStats: DashboardStats = {
        totalRevenue: 0,
        totalUsers: 0,
        totalOrders: 0,
        conversionRate: 0
    };

    // Loading states
    isLoading: boolean = true;

    // Legacy properties (keeping for compatibility)
    noDataMessage: string = "";
    collectionSize: number = 0;
    offset: number = 1;
    limit: number = 10;
    pageNumber: number = 1;
    columnConfigs: any[] = [];
    dataSource = new MatTableDataSource();

    breadcrumbSizeEnum = SizeEnum;
    breadcrumbItems: IBreadcrumbItem[] = [
        { label: 'Home', url: '/', icon: 'fas fa-home' },
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Analytics' }
    ];

    constructor(
        public translate: TranslateService,
        private router: Router,
        private dashboardChartService: DashboardChartService
    ) { }


    ngOnInit(): void {
        this.loadDashboardData();
        this.loadTranslations();
    }

    /**
     * Load translations for dashboard
     */
    loadTranslations(): void {
        // Load subscription chart data with translations
        this.dashboardChartService.getSubscriptionDistributionData().subscribe(data => {
            // Translate the labels
            this.translate.get([
                'DASHBOARD.BASIC_PLAN',
                'DASHBOARD.PREMIUM_PLAN', 
                'DASHBOARD.ENTERPRISE_PLAN',
                'DASHBOARD.TRIAL_USERS'
            ]).subscribe(translations => {
                data.labels = [
                    translations['DASHBOARD.BASIC_PLAN'],
                    translations['DASHBOARD.PREMIUM_PLAN'],
                    translations['DASHBOARD.ENTERPRISE_PLAN'],
                    translations['DASHBOARD.TRIAL_USERS']
                ];
                this.subscriptionDistributionData = data;
                this.subscriptionDistributionOptions = this.dashboardChartService.getChartOptions('doughnut');
            });
        });
    }

    /**
     * Load all dashboard data including charts and statistics
     */
    loadDashboardData(): void {
        this.isLoading = true;
        
        // Load dashboard statistics
        this.dashboardChartService.getDashboardStats().subscribe(stats => {
            this.dashboardStats = stats;
        });

        // Load revenue chart data
        this.dashboardChartService.getRevenueChartData().subscribe(data => {
            this.revenueChartData = data;
            this.revenueChartOptions = this.dashboardChartService.getChartOptions('line');
        });

        // Load user growth chart data
        this.dashboardChartService.getUserGrowthChartData().subscribe(data => {
            this.userGrowthChartData = data;
            this.userGrowthChartOptions = this.dashboardChartService.getChartOptions('line');
        });


        // Load monthly performance data
        this.dashboardChartService.getMonthlyPerformanceData().subscribe(data => {
            this.monthlyPerformanceData = data;
            this.monthlyPerformanceOptions = this.dashboardChartService.getChartOptions('bar');
        });

        // Simulate loading time
        setTimeout(() => {
            this.isLoading = false;
        }, 1000);
    }


    /**
     * Format number with commas for display
     */
    formatNumber(num: number): string {
        return num.toLocaleString('en-US');
    }

    /**
     * Format currency for display
     */
    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-SA', {
            style: 'currency',
            currency: 'SAR'
        }).format(amount);
    }

    /**
     * Refresh dashboard data
     */
    refreshDashboard(): void {
        this.loadDashboardData();
    }
}