"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type CravingPoint = { date: string; intensity: number; createdAt: string };

export function CravingChart({ logs }: { logs: CravingPoint[] }) {
  const grouped = new Map<string, number[]>();
  for (const log of logs) {
    const key = new Date(log.createdAt).toLocaleDateString(undefined, { weekday: "short" });
    grouped.set(key, [...(grouped.get(key) ?? []), log.intensity]);
  }
  const data = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const label = date.toLocaleDateString(undefined, { weekday: "short" });
    const values = grouped.get(label) ?? [];
    return { day: label, average: values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)) : null };
  });
  const timeBuckets = ["Morning", "Afternoon", "Evening", "Night"].map((period, index) => {
    const ranges = [[5, 12], [12, 17], [17, 22], [22, 29]];
    const values = logs
      .filter((log) => {
        const hour = new Date(log.createdAt).getHours();
        const adjusted = index === 3 && hour < 5 ? hour + 24 : hour;
        return adjusted >= ranges[index][0] && adjusted < ranges[index][1];
      })
      .map((log) => log.intensity);
    return { period, average: values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)) : 0 };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patterns, not judgments</CardTitle>
        <CardDescription>Average intensity by day, from your last seven days of check-ins.</CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length ? (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">By day</p>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }} />
                    <Line type="monotone" dataKey="average" name="Average intensity" stroke="#647e70" strokeWidth={3} dot={{ r: 4, fill: "#647e70" }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">By time of day · last seven days</p>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeBuckets} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }} />
                    <Bar dataKey="average" name="Average intensity" fill="#647e70" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-xl bg-background px-6 text-center text-sm text-muted-foreground">
            Your check-in patterns will appear here when you have a few entries. There&apos;s no right amount to log.
          </div>
        )}
        <p className="mt-2 text-xs text-muted-foreground">Only your own check-ins are shown. This is for reflection, not diagnosis.</p>
      </CardContent>
    </Card>
  );
}
