import fs from "fs";
import path from "path";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  gender: string;
  country: string;
  traffic_source: string;
  created_at: string;
}

export interface Order {
  order_id: number;
  user_id: number;
  status: string;
  gender: string;
  created_at: string;
  returned_at: string;
  shipped_at: string;
  delivered_at: string;
  num_of_item: number;
}

function parseCSV<T>(filePath: string, mapper: (row: string[]) => T): T[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim());
  const rows = lines.slice(1); // skip header
  return rows.map((line) => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return mapper(values);
  });
}

let cachedUsers: User[] | null = null;
let cachedOrders: Order[] | null = null;

export function getUsers(): User[] {
  if (cachedUsers) return cachedUsers;
  const filePath = path.join(process.cwd(), "public/sample_data/users.csv");
  cachedUsers = parseCSV(filePath, (row) => ({
    id: parseInt(row[0]),
    first_name: row[1],
    last_name: row[2],
    email: row[3],
    age: parseInt(row[4]),
    gender: row[5],
    country: row[10],
    traffic_source: row[13],
    created_at: row[14],
  }));
  return cachedUsers;
}

export function getOrders(): Order[] {
  if (cachedOrders) return cachedOrders;
  const filePath = path.join(process.cwd(), "public/sample_data/orders.csv");
  cachedOrders = parseCSV(filePath, (row) => ({
    order_id: parseInt(row[0]),
    user_id: parseInt(row[1]),
    status: row[2],
    gender: row[3],
    created_at: row[4],
    returned_at: row[5],
    shipped_at: row[6],
    delivered_at: row[7],
    num_of_item: parseInt(row[8]) || 0,
  }));
  return cachedOrders;
}

// --- Aggregation helpers ---

export interface KpiData {
  totalUsers: number;
  totalOrders: number;
  completionRate: number;
  avgItemsPerOrder: number;
  cancelledRate: number;
  returnRate: number;
}

export function getKpis(): KpiData {
  const users = getUsers();
  const orders = getOrders();
  const completed = orders.filter((o) => o.status === "Complete").length;
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;
  const returned = orders.filter((o) => o.status === "Returned").length;
  const totalItems = orders.reduce((sum, o) => sum + o.num_of_item, 0);

  return {
    totalUsers: users.length,
    totalOrders: orders.length,
    completionRate: Math.round((completed / orders.length) * 1000) / 10,
    avgItemsPerOrder: Math.round((totalItems / orders.length) * 100) / 100,
    cancelledRate: Math.round((cancelled / orders.length) * 1000) / 10,
    returnRate: Math.round((returned / orders.length) * 1000) / 10,
  };
}

export interface MonthlyOrders {
  month: string;
  Complete: number;
  Shipped: number;
  Processing: number;
  Cancelled: number;
  Returned: number;
}

export function getMonthlyOrders(): MonthlyOrders[] {
  const orders = getOrders();
  const map = new Map<string, MonthlyOrders>();

  for (const order of orders) {
    const date = new Date(order.created_at);
    if (isNaN(date.getTime())) continue;
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!map.has(month)) {
      map.set(month, {
        month,
        Complete: 0,
        Shipped: 0,
        Processing: 0,
        Cancelled: 0,
        Returned: 0,
      });
    }
    const entry = map.get(month)!;
    const status = order.status as keyof Omit<MonthlyOrders, "month">;
    if (status in entry) {
      entry[status]++;
    }
  }

  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
}

export interface TrafficSourceData {
  source: string;
  count: number;
}

export function getTrafficSources(): TrafficSourceData[] {
  const users = getUsers();
  const map = new Map<string, number>();
  for (const user of users) {
    map.set(user.traffic_source, (map.get(user.traffic_source) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
}

export interface CountryData {
  country: string;
  count: number;
}

export function getTopCountries(limit = 10): CountryData[] {
  const users = getUsers();
  const map = new Map<string, number>();
  for (const user of users) {
    if (user.country) {
      map.set(user.country, (map.get(user.country) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export interface OrderStatusData {
  status: string;
  count: number;
  fill: string;
}

const STATUS_COLORS: Record<string, string> = {
  Complete: "var(--chart-1)",
  Shipped: "var(--chart-2)",
  Processing: "var(--chart-3)",
  Cancelled: "var(--chart-4)",
  Returned: "var(--chart-5)",
};

export function getOrderStatusBreakdown(): OrderStatusData[] {
  const orders = getOrders();
  const map = new Map<string, number>();
  for (const order of orders) {
    map.set(order.status, (map.get(order.status) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([status, count]) => ({
      status,
      count,
      fill: STATUS_COLORS[status] || "var(--chart-1)",
    }))
    .sort((a, b) => b.count - a.count);
}

export interface AgeGroupData {
  ageGroup: string;
  male: number;
  female: number;
}

export function getAgeGroups(): AgeGroupData[] {
  const users = getUsers();
  const groups = new Map<string, { male: number; female: number }>();

  for (const user of users) {
    if (isNaN(user.age)) continue;
    const decade = Math.floor(user.age / 10) * 10;
    const label = decade >= 70 ? "70+" : `${decade}s`;

    if (!groups.has(label)) {
      groups.set(label, { male: 0, female: 0 });
    }
    const entry = groups.get(label)!;
    if (user.gender === "M") entry.male++;
    else if (user.gender === "F") entry.female++;
  }

  const order = ["10s", "20s", "30s", "40s", "50s", "60s", "70+"];
  return order
    .filter((g) => groups.has(g))
    .map((ageGroup) => ({
      ageGroup,
      ...groups.get(ageGroup)!,
    }));
}

export interface MonthlyUsers {
  month: string;
  count: number;
}

export function getMonthlyUserRegistrations(): MonthlyUsers[] {
  const users = getUsers();
  const map = new Map<string, number>();

  for (const user of users) {
    const date = new Date(user.created_at);
    if (isNaN(date.getTime())) continue;
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    map.set(month, (map.get(month) || 0) + 1);
  }

  return Array.from(map.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
