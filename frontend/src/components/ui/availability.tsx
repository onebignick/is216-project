"use client"

import { useState } from "react";

interface AvailabilityProps {
    days: number;
    period: number;
}

export function Availability({ days, period } : AvailabilityProps) {
    const interval = 1440 / period >> 0;

    // generate dp table
    const dp: boolean[][] = Array.from({ length: interval }, () => Array(days).fill(false));
    const [availability, setAvailability] = useState(dp);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [selectState, setSelectState] = useState(false);
    
    function handleMouseDown(x: number, y:number) {
        setSelectState(availability[y][x]);
        availability[y][x] = !selectState;
        setAvailability([...availability]);
        setIsMouseDown(true)
    }

    function handleMouseUp() {
        setIsMouseDown(false)
    }

    function handleMouseEnter(x: number, y: number) {
        if (isMouseDown) {
            availability[y][x] = !selectState;
            setAvailability([...availability]);
        }
    }


    return (
        <table className="border border-foreground w-full" onMouseUp={handleMouseUp} draggable={false}>
            <thead>
                <tr>
                    {
                        [...Array(days)].map((_, idx) => {
                            return <th key={idx} className="border border-foreground">title</th>
                        })
                    }
                </tr>
            </thead>
            <tbody>
            {
                availability.map((dayAvailability, idy) => {
                    return (
                        <tr key={idy}>
                            {
                                dayAvailability.map((val, idx) => {
                                    if (!val) {
                                        return <td 
                                            key={idx}
                                            className="h-4 w-4 border border-foreground hover:bg-green-400"
                                            onMouseEnter={(e) =>  {
                                                e.preventDefault();
                                                handleMouseEnter(idx, idy)
                                            }}
                                            onMouseDown={() => {
                                                handleMouseDown(idx, idy);
                                            }}
                                        ></td>
                                    } else {
                                        return <td 
                                            key={idx}
                                            className="h-8 w-8 border border-foreground bg-green-200 hover:bg-green-400"
                                            onMouseEnter={(e) =>  {
                                                e.preventDefault();
                                                handleMouseEnter(idx, idy)
                                            }}
                                            onMouseDown={() => {
                                                handleMouseDown(idx, idy);
                                            }}
                                        ></td>
                                    }
                                })
                            }
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
    )
}