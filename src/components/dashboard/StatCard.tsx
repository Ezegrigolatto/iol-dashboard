import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value?: number;
  currency?: string;
  change?: number;
  icon: LucideIcon;
  loading?: boolean;
  delay?: number;
}

export function StatCard({
  title,
  value,
  currency,
  change,
  icon: Icon,
  loading,
  delay = 0,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className="animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = (change ?? 0) >= 0;

  return (
    <Card
      className="animate-fade-up hover:shadow-md transition-shadow duration-200"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-xs font-medium text-[hsl(var(--muted-fg))] uppercase tracking-wide">
              {title}
            </p>
            {value !== undefined ? (
              <p className="text-2xl font-bold tracking-tight truncate">
                {formatCurrency(value, currency)}
              </p>
            ) : null}
            {change !== undefined && (
              <div
                className={cn(
                  'flex items-center gap-1',
                  isPositive ? 'positive' : 'negative',
                  Boolean(value) ? 'text-xs font-medium' : 'text-2xl font-bold'
                )}
              >
                {isPositive ? (
                  <TrendingUp
                    className={cn(
                      Boolean(value) ? 'h-3 w-3' : 'h-5 w-5',
                      'text-green-500'
                    )}
                  />
                ) : (
                  <TrendingDown
                    className={cn(Boolean(value) ? 'h-3 w-3' : 'h-5 w-5', 'text-red-500')}
                  />
                )}
                {isPositive ? '+' : ''}
                {change.toFixed(2)}%
              </div>
            )}
          </div>
          <div className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent))]">
            <Icon className="h-5 w-5 text-[hsl(var(--primary))]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
