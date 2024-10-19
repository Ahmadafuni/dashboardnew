import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./card"; // Import your card components

interface DashboardCardProps {
    title: string;
    value: number;
    unit: string;
    maxValue?: number; // Optional max value for progress bar
    color?: string; // Optional color for progress bar
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, unit, maxValue, color = "#4fc3f7" }) => {
    const progress = maxValue ? (value / maxValue) * 100 : 0; // Calculate progress if maxValue is provided

    return (
        <Card className="w-full max-w-xs"> {/* Each card will have a max width */}
            <CardHeader>
                <CardTitle>{title}</CardTitle> {/* Display the title */}
            </CardHeader>
            <CardContent>
                {maxValue && ( // Only render the progress bar if maxValue is provided
                    <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
                        <div
                            className="absolute h-full rounded-full"
                            style={{ width: `${progress}%`, backgroundColor: color }} // Progress bar foreground
                        />
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <CardDescription>{value.toLocaleString()} {unit}</CardDescription> {/* Display value and unit */}
                </div>
            </CardContent>
        </Card>
    );
};

export default DashboardCard;
