
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string | number;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center">
        <div className="flex-shrink-0 p-3 rounded-lg bg-primary-light text-primary">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-semibold text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
      {trend && (
        <div className="mt-2">
          <span
            className={cn(
              "text-sm font-medium",
              trend.positive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
          <span className="text-sm text-gray-500 ml-2">from previous month</span>
        </div>
      )}
    </Card>
  );
}
