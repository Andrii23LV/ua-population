'use client';

import React, { useEffect, useState } from 'react';
import VerticalStackedBar from '@/components/Years/VerticalStackedBar';
import LinearPlot from '@/components/General/LinearPlot';
import VerticalStackedBarChart from '@/components/General/VerticalStackedBar';
import RadialPlot from '@/components/General/RadialPlot';

interface RegionData {
    _id: string;
    region: string;
    amount: number;
}

interface YearData {
    _id: string;
    year: number;
    data: RegionData[];
}

interface SummaryYearData {
    _id: string;
    year: number;
    population: number;
}

interface YearsData {
    list: YearData[];
}

const Years = () => {
    const [allYearData, setAllYearData] = useState(null);

    useEffect(() => {
        const fetchYears = async () => {
            const response = await fetch('/api/years');
            const data = await response.json();

            const sortedArray = data.sort((a: YearData, b: YearData) => a.year - b.year);

            setAllYearData(sortedArray.map((year: {
                [x: string]: any; data: any[]; year: any;
            }) => {
                const population = year.data.reduce((acc: any, item: { amount: any; }) => acc + item.amount, 0);
                return { _id: year._id, year: year.year, population };
            }));
        }

        fetchYears();
    }, []);

    return (
        <section>
            <h1 className='flex justify-center blue_gradient text-2xl font-extrabold pb-6'>General statistics of the population of Ukraine for all years</h1>
            <div className='flex flex-wrap w-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 py-5 rounded-xl shadow-md mt-5'>
                <LinearPlot data={allYearData || []} />
            </div>
            <div className='flex justify-center mt-5'>
                <VerticalStackedBarChart data={allYearData || []} />
                <RadialPlot data={allYearData || []} />
            </div>
        </section>
    );
};

export default Years;
