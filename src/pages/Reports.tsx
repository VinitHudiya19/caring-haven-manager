
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample data
const monthlyDonations = [
  { month: "Jan", amount: 2500 },
  { month: "Feb", amount: 3000 },
  { month: "Mar", amount: 2700 },
  { month: "Apr", amount: 4000 },
  { month: "May", amount: 3500 },
  { month: "Jun", amount: 5000 },
  { month: "Jul", amount: 4200 },
  { month: "Aug", amount: 4800 },
  { month: "Sep", amount: 3900 },
  { month: "Oct", amount: 4500 },
  { month: "Nov", amount: 5500 },
  { month: "Dec", amount: 6500 },
];

const orphansByAge = [
  { age: "0-3", count: 8 },
  { age: "4-6", count: 12 },
  { age: "7-10", count: 18 },
  { age: "11-14", count: 10 },
  { age: "15+", count: 5 },
];

const donationsByType = [
  { name: "Money", value: 60 },
  { name: "Supplies", value: 30 },
  { name: "Other", value: 10 },
];

const COLORS = ["#9b87f5", "#7E69AB", "#6E59A5"];

const Reports = () => {
  const isMobile = useIsMobile();

  return (
    <PageContainer
      title="Reports"
      description="View analytics and reports for the orphanage"
    >
      <div className="mb-6 flex justify-end">
        <Select defaultValue="year">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Donations by Month</CardTitle>
            <CardDescription>Monthly donation amounts for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={isMobile ? monthlyDonations.slice(6) : monthlyDonations}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                  <Legend />
                  <Bar dataKey="amount" name="Donation Amount" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Orphans by Age Group</CardTitle>
            <CardDescription>Distribution of orphans by age range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orphansByAge}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Orphans" fill="#7E69AB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Donations by Type</CardTitle>
            <CardDescription>Distribution of donation types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donationsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {donationsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Donation Trends</CardTitle>
            <CardDescription>Donation amount trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyDonations}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="Donation Amount"
                    stroke="#9b87f5"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Reports;
