
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentOrphans } from "@/components/dashboard/RecentOrphans";
import { RecentDonations } from "@/components/dashboard/RecentDonations";
import { DonationChart } from "@/components/dashboard/DonationChart";
import { Users, HeartHandshake, Home, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DashboardStats {
  orphan_count: number;
  adopted_count: number;
  total_donations: number;
  recent_donations: any[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard statistics');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <PageContainer 
      title="Dashboard" 
      description="Welcome to BalSadan Orphanage Management System"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Orphans"
          value={stats ? stats.orphan_count.toString() : "..."}
          trend={{ value: "12%", positive: true }}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Total Donations"
          value={stats ? `$${stats.total_donations.toFixed(2)}` : "..."}
          trend={{ value: "8%", positive: true }}
          icon={<HeartHandshake className="h-6 w-6" />}
        />
        <StatCard
          title="Adoptions"
          value={stats ? stats.adopted_count.toString() : "..."}
          trend={{ value: "5%", positive: true }}
          icon={<Home className="h-6 w-6" />}
        />
        <StatCard
          title="Monthly Expenses"
          value="$8,940"
          trend={{ value: "3%", positive: false }}
          icon={<Activity className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DonationChart />
        </div>
        <div className="space-y-6">
          <RecentOrphans />
          <RecentDonations />
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
