
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronRight } from "lucide-react";

interface Orphan {
  id: number;
  name: string;
  age: number;
  joinDate: string;
  status: "active" | "pending" | "adopted";
  avatar?: string;
}

// Sample data
const recentOrphans: Orphan[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 8,
    joinDate: "2023-10-15",
    status: "active",
  },
  {
    id: 2,
    name: "Michael Lee",
    age: 6,
    joinDate: "2023-11-02",
    status: "active",
  },
  {
    id: 3,
    name: "Emma Williams",
    age: 10,
    joinDate: "2023-11-20",
    status: "pending",
  },
  {
    id: 4,
    name: "David Brown",
    age: 5,
    joinDate: "2023-12-01",
    status: "active",
  },
];

export function RecentOrphans() {
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Orphans</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/orphans" className="flex items-center text-sm text-primary hover:text-primary-dark">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrphans.slice(0, isMobile ? 2 : 4).map((orphan) => (
            <div key={orphan.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar>
                  <div className="bg-primary-light text-primary font-semibold rounded-full w-10 h-10 flex items-center justify-center">
                    {orphan.name.charAt(0)}
                  </div>
                </Avatar>
                <div className="ml-4">
                  <p className="text-sm font-medium">{orphan.name}</p>
                  <p className="text-xs text-gray-500">{orphan.age} years old</p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block px-2 py-1 text-xs rounded-full font-medium capitalize" 
                  style={{
                    backgroundColor: 
                      orphan.status === 'active' ? '#e5deff' : 
                      orphan.status === 'pending' ? '#FEF7CD' :
                      '#D3E4FD',
                    color: 
                      orphan.status === 'active' ? '#7E69AB' : 
                      orphan.status === 'pending' ? '#806A00' :
                      '#0A49A0'
                  }}
                >
                  {orphan.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
