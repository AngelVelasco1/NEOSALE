import ChartsClient from "./ChartsClient";
import { getDailyChartData, getCategorySalesData, DateRangeParams } from "../../../actions/dashboard/getChartData";

interface DashboardChartsProps {
  dateRange?: DateRangeParams;
}

export default async function DashboardCharts({ dateRange }: DashboardChartsProps) {
  // Create a unique key based on date range for cache busting
  const cacheKey = dateRange?.from && dateRange?.to
    ? `${dateRange.from}-${dateRange.to}`
    : 'default';

  const [dailyData, categoryResponse] = await Promise.all([
    getDailyChartData(dateRange),
    getCategorySalesData(dateRange),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" key={cacheKey}>
      <ChartsClient
        dailyData={dailyData}
        categoryData={categoryResponse.data}
        totalOrders={categoryResponse.totalOrders}
        dateRange={dateRange}
      />
    </div>
  );
}
