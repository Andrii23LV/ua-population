
'use client'

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSession, getProviders, ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import { BuiltInProviderType } from "next-auth/providers";
import RegionForm from "@/components/Profile/RegionForm";

import userImage from '../../../../public/assets/user.png';
import BarChart from "@/components/Profile/BarChart";

interface RegionData {
    _id: string;
    region: string;
    amount: number;
}

interface TransformedData {
    id: string;
    region: string;
    data: { year: number; amount: number }[];
}

const setCookie = (name: string, value: string, days: number) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = encodeURIComponent(value) + (days ? `; expires=${expirationDate.toUTCString()}` : '');
    document.cookie = `${name}=${cookieValue}; path=/`;
};

const getCookie = async (name: string) => {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return null;
};

const ProfilePage = () => {
    const { data: session, status } = useSession({ required: true });
    const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);
    const [regions, setRegions] = useState<string[]>([]);
    const [currentRegion, setCurrentRegion] = useState<string | null>(null);
    const [regionDataByYear, setRegionDataByYear] = useState<TransformedData | null>(null);

    const handleSelectRegion = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const selectedRegion = e.target.value;
        setCurrentRegion(selectedRegion);
        setCookie('currentRegion', selectedRegion, 7); // Save currentRegion in a cookie for 7 days
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!currentRegion) {
                return; // Do not fetch if currentRegion is not set
            }

            const response = await fetch('/api/years');
            const data = await response.json();

            const filteredData = data[0].data.map((item: RegionData) => item.region);
            setRegions(filteredData);

            const transformedData: TransformedData[] = filteredData.map((region: string) => {
                return {
                    id: Math.random().toString(),
                    region: region,
                    data: data.sort((a:any, b:any) => a.year - b.year).map((item: any) => {
                        return {
                            year: item.year,
                            amount: item.data.find((item: any) => item.region === region)?.amount || 0,
                        };
                    }),
                };
            });

            setRegionDataByYear(transformedData.find((item: any) => item.region === currentRegion) || null);
        };

        const initializeData = async () => {
            const res = await getProviders();
            setProviders(res);
            const storedRegion = await getCookie('currentRegion');
            if (storedRegion) {
                setCurrentRegion(storedRegion);
            }
        };

        initializeData();
        fetchData();
    }, [currentRegion]);

    return (
        <section>
            <div className="flex gap-5 flex-row items-center mt-10 p-5 rounded-lg bg-white">
                <Image
                    src={session?.user?.image || userImage}
                    width={100}
                    height={100}
                    className="rounded-full"
                    alt="profile"
                />
                <div>
                    <h1 className="text-2xl font-bold mt-4">{session?.user?.name || ''}</h1>
                    <p className="text-gray-600 mt-2">{session?.user?.email || ''}</p>
                    <RegionForm regions={regions} handler={handleSelectRegion} currentValue={currentRegion} />
                </div>
            </div>
            {currentRegion && regionDataByYear ?
                <div>
                    <BarChart data={regionDataByYear} />
                </div>
                : null}
        </section>
    );
};

export default ProfilePage;
