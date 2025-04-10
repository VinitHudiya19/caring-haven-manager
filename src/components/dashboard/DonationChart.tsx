
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample data
const data = [
  { month: "Jan", donations: 2500 },
  { month: "Feb", donations: 3000 },
  { month: "Mar", donations: 2700 },
  { month: "Apr", donations: 4000 },
  { month: "May", donations: 3500 },
  { month: "Jun", donations: 5000 },
  { month: "Jul", donations: 4200 },
  { month: "Aug", donations: 4800 },
  { month: "Sep", donations: 3900 },
  { month: "Oct", donations: 4500 },
  { month: "Nov", donations: 5500 },
  { month: "Dec", donations: 6500 },
];

export function DonationChart() {
  const isMobile = useIsMobile();
  const displayData = isMobile ? data.slice(6) : data;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Donation Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
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
              <Tooltip 
                formatter={(value) => [`$${value}`, "Amount"]}
                labelStyle={{ color: "#333" }}
                contentStyle={{ 
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.375rem",
                }}
              />
              <Legend />
              <Bar dataKey="donations" name="Donations" fill="#9b87f5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
