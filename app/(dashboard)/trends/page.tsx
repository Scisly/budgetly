import { createClient } from "@/lib/supabase/server";
import { TrendsLineChart } from "@/components/charts/trends-line-chart";
import { TrendsLatestBalance } from "@/components/trends/trends-latest-balance";
import { getTrendsData } from "@/services/trends.service";

export default async function TrendsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = user ? await getTrendsData(supabase, user.id, 6) : { points: [] };
  const latestPoint = data.points.at(-1);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Trendy</h2>
        <p className="text-muted-foreground">
          Ostatnie 6 miesięcy — przychody i wydatki.
        </p>
      </div>

      {latestPoint && (
        <TrendsLatestBalance
          label={latestPoint.label}
          balance={latestPoint.balance}
        />
      )}

      <div className="rounded-xl border border-border bg-card p-4">
        <TrendsLineChart points={data.points} />
      </div>
    </div>
  );
}
