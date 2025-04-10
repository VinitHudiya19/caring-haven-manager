
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentOrphans } from "@/components/dashboard/RecentOrphans";
import { RecentDonations } from "@/components/dashboard/RecentDonations";
import { DonationChart } from "@/components/dashboard/DonationChart";
import { Users, HeartHandshake, Home, Activity } from "lucide-react";

const Dashboard = () => {
  return (
    <PageContainer 
      title="Dashboard" 
      description="Welcome to CaringHaven Orphanage Management System"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Orphans"
          value="48"
          trend={{ value: "12%", positive: true }}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Total Donations"
          value="$32,450"
          trend={{ value: "8%", positive: true }}
          icon={<HeartHandshake className="h-6 w-6" />}
        />
        <StatCard
          title="Adoptions"
          value="12"
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
