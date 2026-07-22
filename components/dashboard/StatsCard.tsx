import { ReactNode } from "react";

type StatsCardProps = {
  label: string;
  value: string | number;
  icon?: ReactNode;
};

export function StatsCard({
  label,
  value,
  icon,
}: StatsCardProps) {
  return (
    <section className="stats-card">
      <div className="stats-card-top">
        <span className="stats-label">{label}</span>

        {icon && (
          <div className="stats-icon">
            {icon}
          </div>
        )}
      </div>

      <div className="stats-value">
        {value}
      </div>
    </section>
  );
}