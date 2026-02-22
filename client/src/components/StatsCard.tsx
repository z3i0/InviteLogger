import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatsCard({ title, value, icon, trend, trendUp, className }: StatsCardProps) {
  return (
    <div className={cn(
      "glass-panel p-6 rounded-2xl relative overflow-hidden group hover:bg-card/80 transition-all duration-300",
      className
    )}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
        {icon}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2 text-muted-foreground">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <h3 className="font-semibold text-sm uppercase tracking-wider">{title}</h3>
        </div>
        
        <div className="mt-4">
          <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
          {trend && (
            <p className={cn(
              "text-xs mt-1 font-medium",
              trendUp ? "text-green-400" : "text-red-400"
            )}>
              {trend}
            </p>
          )}
        </div>
      </div>
      
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />
    </div>
  );
}
