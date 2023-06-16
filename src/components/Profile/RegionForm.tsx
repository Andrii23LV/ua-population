import React from "react";

interface Props {
    regions: string[];
    handler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    currentValue: string | null;
}

const RegionForm: React.FC<Props> = ({ regions, handler, currentValue }) => {
    return (
        <form className="border-2 border-sky-500 rounded-3xl form_input">
            <label className="p-2" htmlFor="regions">
                Choose a region:
            </label>
            <select
                onChange={(e) => handler(e)}
                name="regions"
                id="regions"
                className="p-1 rounded-xl max-h-8 bg-indigo-100"
                value={currentValue || "0"}
            >
                <option value="0">- None -</option>
                {regions?.map((region) => (
                    <option value={region} key={region}>
                        {region}
                    </option>
                ))}
            </select>
        </form>
    );
};

export default RegionForm;
