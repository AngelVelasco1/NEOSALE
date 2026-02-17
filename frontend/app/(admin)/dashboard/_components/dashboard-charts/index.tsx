import ChartsClient from "./ChartsClient";
import { getChartData, getCategorySalesData, DateRangeParams } from "../../../actions/dashboard/getChartData";
import { getDashboardStats } from "../../../actions/dashboard/getDashboardStats";

interface DashboardChartsProps {
  dateRange?: DateRangeParams;
}

export default async function DashboardCharts({ dateRange }: DashboardChartsProps) {
  // Create a unique key based on date range for cache busting
  const cacheKey = dateRange?.from && dateRange?.to
    ? `${dateRange.from instanceof Date ? dateRange.from.toISOString() : dateRange.from}-${dateRange.to instanceof Date ? dateRange.to.toISOString() : dateRange.to}`
    : 'default';

  const [dailyData, categoryResponse, stats] = await Promise.all([
    getChartData(dateRange),
    getCategorySalesData(dateRange),
    getDashboardStats(dateRange),
  ]);

  // Ensure we have valid arrays
  const safeDaily = Array.isArray(dailyData) ? dailyData : [];
  const safeCategory = Array.isArray(categoryResponse) ? categoryResponse : [];
  const safeStats = stats || { totalOrders: 0 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" key={cacheKey}>
      <ChartsClient
        dailyData={safeDaily}
        categoryData={safeCategory}
        totalOrders={safeStats.totalOrders}
        dateRange={dateRange}
      />
    </div>
  );
}
