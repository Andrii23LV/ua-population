'use client';

import React, { useEffect, useState } from 'react';
import ChoropletMap from '@/components/Years/ChoropletMap';
import CircularBarplot from '@/components/Years/CircularBarplot';
import ByYearPopulationTable from '@/components/Years/ByYearPopulationTable';
import BarChart from '@/components/Years/BarChart';
import ButtonListYears from '@/components/Years/ButtonListYears';
import VerticalStackedBar from '@/components/Years/VerticalStackedBar';

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
	const [yearsData, setYearsData] = useState<YearData[] | null>(null);
	const [allYearData, setAllYearData] = useState(null)
	const [currentYear, setCurrentYear] = useState<YearData | null>(null);

	const totalAmount: number | undefined = currentYear?.data.reduce((acc: number, curr: { region: string, amount: number }) => acc + curr.amount, 0);

	const handleSetYear = (year: YearData): void => {
		setCurrentYear(year);
	}

	useEffect(() => {
		const fetchYears = async () => {
			const response = await fetch('/api/years');
			const data = await response.json();

			setYearsData(data);

			const sortedArray = data.sort((a: YearData, b: YearData) => a.year - b.year);
			setCurrentYear(sortedArray[sortedArray.length - 1]);
			setAllYearData(data.map((year: {
				[x: string]: any; data: any[]; year: any;
			}) => {
				const population = year.data.reduce((acc: any, item: { amount: any; }) => acc + item.amount, 0);
				return { _id: year._id, year: year.year, population };
			}));
		}

		fetchYears();
	}, []);

	return (
		<section className='flex flex-col justify-center'>
			<h1 className='flex justify-center blue_gradient text-2xl font-extrabold pb-6'>Detailed statistics of the population of Ukraine for each year</h1>
			<ButtonListYears list={yearsData} currentYear={currentYear?.year} handleSetYear={handleSetYear} />
			<h2 className='flex justify-center blue_gradient text-2xl font-extrabold leading-[1.15] sm:text-3xl pt-6'>
				Total population on {currentYear?.year}
			</h2>
			<h3 className='flex justify-center text-3m font-extrabold leading-[1.15] sm:text-3xl'>
				{totalAmount}
			</h3>
			<ChoropletMap data={currentYear?.data || []} />
			<p className='flex justify-center'>Radial and sortable bar charts</p>
			<div className='flex flex-wrap bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 py-5 rounded-xl shadow-md mt-5 m-auto'>
				<CircularBarplot data={currentYear?.data || []} />
				<BarChart data={currentYear?.data || []} />
			</div>
			<p className='flex mt-5 justify-center'>Percentage table and comparison of the current year with others</p>
			<div className='flex mt-5 justify-center'>
				<ByYearPopulationTable data={currentYear?.data || []} />
				<VerticalStackedBar data={allYearData || []} year={currentYear?.year} />
			</div>
		</section>
	);
};

export default Years;
