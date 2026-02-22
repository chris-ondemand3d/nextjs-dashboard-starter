import { KpiCards } from "@/components/analytics/kpi-cards";
import { ChartOrdersOverTime } from "@/components/analytics/chart-orders-over-time";
import { ChartTrafficSources } from "@/components/analytics/chart-traffic-sources";
import { ChartCountries } from "@/components/analytics/chart-countries";
import { ChartOrderStatus } from "@/components/analytics/chart-order-status";
import { ChartDemographics } from "@/components/analytics/chart-demographics";
import { ChartUserRegistrations } from "@/components/analytics/chart-user-registrations";
import {
  getKpis,
  getMonthlyOrders,
  getTrafficSources,
  getTopCountries,
  getOrderStatusBreakdown,
  getAgeGroups,
  getMonthlyUserRegistrations,
} from "@/lib/data";

export default function Home() {
  const kpis = getKpis();
  const monthlyOrders = getMonthlyOrders();
  const trafficSources = getTrafficSources();
  const topCountries = getTopCountries();
  const orderStatus = getOrderStatusBreakdown();
  const ageGroups = getAgeGroups();
  const monthlyUsers = getMonthlyUserRegistrations();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <KpiCards data={kpis} />

      <div className="px-4 lg:px-6">
        <ChartOrdersOverTime data={monthlyOrders} />
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <ChartUserRegistrations data={monthlyUsers} />
        <ChartTrafficSources data={trafficSources} />
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <ChartCountries data={topCountries} />
        <ChartOrderStatus data={orderStatus} />
      </div>

      <div className="px-4 lg:px-6">
        <ChartDemographics data={ageGroups} />
      </div>
    </div>
  );
}
