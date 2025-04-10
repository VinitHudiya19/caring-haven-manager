
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronRight } from "lucide-react";

interface Donation {
  id: number;
  donor: string;
  amount: number;
  date: string;
  type: "money" | "supplies" | "other";
}

// Sample data
const recentDonations: Donation[] = [
  {
    id: 1,
    donor: "John Smith",
    amount: 500,
    date: "2023-12-01",
    type: "money",
  },
  {
    id: 2,
    donor: "ABC Corporation",
    amount: 1000,
    date: "2023-11-28",
    type: "money",
  },
  {
    id: 3,
    donor: "City Council",
    amount: 1500,
    date: "2023-11-20",
    type: "money",
  },
  {
    id: 4,
    donor: "Local Grocery Store",
    amount: 0,
    date: "2023-11-15",
    type: "supplies",
  },
];

export function RecentDonations() {
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Donations</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/donations" className="flex items-center text-sm text-primary hover:text-primary-dark">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentDonations.slice(0, isMobile ? 2 : 4).map((donation) => (
            <div key={donation.id} className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-sm font-medium">{donation.donor}</p>
                <p className="text-xs text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                {donation.type === "money" ? (
                  <p className="text-sm font-semibold text-green-600">${donation.amount.toLocaleString()}</p>
                ) : (
                  <p className="text-sm font-semibold text-blue-600">Supplies</p>
                )}
                <div className="text-xs text-gray-500 capitalize">{donation.type}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
