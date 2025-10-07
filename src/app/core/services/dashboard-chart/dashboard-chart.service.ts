import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ChartData {
  labels: string[];
  datasets: any[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  conversionRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardChartService {

  constructor() { }

  /**
   * Get revenue chart data for the last 12 months
   */
  getRevenueChartData(): Observable<ChartData> {
    const data = {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      datasets: [
        {
          label: 'Revenue (SAR)',
          data: [1200, 1500, 1800, 2200, 1900, 2500, 
                 2800, 3200, 2900, 3500, 3800, 4200],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    };
    return of(data);
  }

  /**
   * Get user growth chart data
   */
  getUserGrowthChartData(): Observable<ChartData> {
    const data = {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      datasets: [
        {
          label: 'New Users',
          data: [45, 52, 38, 67, 89, 95, 78, 102, 115, 128, 142, 156],
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4
        },
        {
          label: 'Active Users',
          data: [120, 135, 142, 158, 167, 189, 201, 215, 228, 245, 267, 289],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        }
      ]
    };
    return of(data);
  }

  /**
   * Get subscription distribution pie chart data
   */
  getSubscriptionDistributionData(): Observable<ChartData> {
    const data = {
      labels: ['DASHBOARD.BASIC_PLAN', 'DASHBOARD.PREMIUM_PLAN', 'DASHBOARD.ENTERPRISE_PLAN', 'DASHBOARD.TRIAL_USERS'],
      datasets: [
        {
          data: [35, 40, 15, 10],
          backgroundColor: [
            'rgba(52, 152, 219, 0.8)',  // Blue for Basic
            'rgba(155, 89, 182, 0.8)',  // Purple for Premium
            'rgba(46, 204, 113, 0.8)',  // Green for Enterprise
            'rgba(241, 196, 15, 0.8)'   // Yellow for Trial
          ],
          borderColor: [
            'rgba(52, 152, 219, 1)',
            'rgba(155, 89, 182, 1)',
            'rgba(46, 204, 113, 1)',
            'rgba(241, 196, 15, 1)'
          ],
          borderWidth: 2
        }
      ]
    };
    return of(data);
  }

  /**
   * Get monthly performance bar chart data
   */
  getMonthlyPerformanceData(): Observable<ChartData> {
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Sales Target',
          data: [100, 120, 110, 130, 140, 150],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Actual Sales',
          data: [95, 125, 105, 145, 135, 160],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
    return of(data);
  }

  /**
   * Get dashboard statistics
   */
  getDashboardStats(): Observable<DashboardStats> {
    const stats = {
      totalRevenue: 4200,
      totalUsers: 1240,
      totalOrders: 890,
      conversionRate: 12.5
    };
    return of(stats);
  }

  /**
   * Get chart options for different chart types
   */
  getChartOptions(type: 'line' | 'bar' | 'pie' | 'doughnut'): any {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            usePointStyle: true,
            padding: 20
          }
        }
      }
    };

    switch (type) {
      case 'line':
        return {
          ...baseOptions,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          }
        };
      
      case 'bar':
        return {
          ...baseOptions,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          }
        };
      
      case 'pie':
      case 'doughnut':
        return {
          ...baseOptions,
          cutout: type === 'doughnut' ? '50%' : 0
        };
      
      default:
        return baseOptions;
    }
  }
}
