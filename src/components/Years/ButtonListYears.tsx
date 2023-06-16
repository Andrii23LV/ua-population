'use client';

import React from "react";

interface ButtonListYearsProps {
    list: YearData[] | null;
    currentYear: number | undefined; // Update the type to allow undefined
    handleSetYear: (yearData: YearData) => void;
}


interface YearData {
    _id: string;
    year: number;
    data: RegionData[];
}

interface RegionData {
    _id: string;
    region: string;
    amount: number;
}

const ButtonListYears: React.FC<ButtonListYearsProps> = ({ list, currentYear, handleSetYear }) => {
    return (

        <ul className="flex flex-wrap max-w-[40%] m-auto gap-2 justify-center">
            {list?.sort((a, b) => a.year - b.year).map((item, _index) => (
                <li key={item.year}>
                    <button className={item.year === currentYear ? 'blue_btn w-16' : 'outline_btn w-16'} onClick={() => handleSetYear(item)}>
                        {item.year}
                    </button>
                </li>

            ))}
        </ul>
    );
};

export default ButtonListYears;


