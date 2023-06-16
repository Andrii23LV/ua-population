import React from 'react';

interface Population {
    amount: number;
    region: string;
}

interface PopulationTableProps {
    data: Population[];
}

const PopulationTable: React.FC<PopulationTableProps> = ({ data }) => {
    const totalAmount = data.reduce((acc: number, curr: { region: string, amount: number }) => acc + curr.amount, 0);
    return (
        <table className="rounded-xl border-separate bg-white dark:bg-slate-800 text-xs shadow-sm p-1">
            <thead>
                <tr>
                    <th className="border border-slate-300 dark:border-slate-600 font-semibold p-2 text-slate-900 dark:text-slate-200 text-center">
                        Region
                    </th>
                    <th className="border border-slate-300 dark:border-slate-600 font-semibold p-2 text-slate-900 dark:text-slate-200 text-center">
                        Population
                    </th>
                    <th className="border border-slate-300 dark:border-slate-600 font-semibold p-2 text-slate-900 dark:text-slate-200 text-center">
                        Percentage part %
                    </th>
                </tr>
            </thead>
            <tbody>
                {data.map((population, index) => (
                    <tr key={index}>
                        <td className="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
                            {population.region}
                        </td>
                        <td className="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
                            {population.amount}
                        </td>
                        <td className="border border-slate-300 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400">
                            {(population.amount * 100 / totalAmount).toFixed(2)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};


export default PopulationTable;