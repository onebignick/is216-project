"use client"

import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { ChartConfig, ChartContainer } from "../ui/chart"

interface Props {
    className: string
    chartData: object[];
}

export function WeeksMeetings({className, chartData}: Props) {
    const chartConfig = {
        meetings: {
            label: "Meetings",
        },
    } satisfies ChartConfig;

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-center">Meetings this week</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <RadialBarChart
                        data={chartData}
                        endAngle={100}
                        innerRadius={80}
                        outerRadius={140}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar dataKey="meetings" background/>
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                <Label
                                    content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-4xl font-bold"
                                            >
                                            {chartData[0].meetings.toLocaleString()}
                                            </tspan>
                                            <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                            >
                                            Meetings
                                            </tspan>
                                        </text>
                                        )
                                    }
                                    }}
                                />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer> 
            </CardContent>
        </Card>
    )
}