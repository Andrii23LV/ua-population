'use client'

import React, { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders, ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { redirect } from 'next/navigation'

import Link from "next/link";
import Image from "next/image";
import { BuiltInProviderType } from "next-auth/providers";

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Years', href: '/years' },
    { name: 'General', href: '/general' }
]

type User = {
    id?: string | null | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
};

const Nav = () => {
    const { data: session } = useSession();

    const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);
    const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);

    const pathname = usePathname();

    useEffect(() => {
        (async () => {
            const res = await getProviders();
            setProviders(res);
        })();
    }, []);

    return (
        <nav className="sticky top-0 flex flex-row justify-between w-full py-4 backdrop-blur-lg">
            <Link href="/" className="flex gap-2 items-center">
                <Image src="/assets/icons/ua.svg" width={20} height={20} alt="Ukraine-logo" />
                <p>UA Population</p>
            </Link>
            {/* Desktop Navigation */}
            <div className="sm:flex hidden items-center">
                <div className="flex gap-5 md:gap-5 items-center">
                    <Link href="/" className={`flex gap-2 items-center ${pathname === '/' ? 'active-link' : ''}`} key="home">
                        Home
                    </Link>
                    {session?.user &&
                        navLinks?.slice(1).map((nav) => (
                            <Link
                                href={nav.href}
                                className={`flex gap-2 items-center ${pathname === nav.href ? 'active-link' : ''}`}
                                key={nav.name}
                            >
                                {nav.name}
                            </Link>
                        ))}
                    {session?.user ? (
                        <button type="button" className="purple_btn" onClick={() => signOut().then(() => redirect('/'))}>
                            <Link href="/">Sign Out</Link>
                        </button>
                    ) : (
                        <React.Fragment>
                            {providers &&
                                Object.values(providers).map((provider) => (
                                    <button
                                        type="button"
                                        key={provider.id}
                                        className="purple_btn"
                                        onClick={() => signIn(provider.id)}
                                    >
                                        Sign In
                                    </button>
                                ))}
                        </React.Fragment>
                    )}
    {session?.user && (
        <Link href={`/profile/${session.user.name || '#'}`}>
                            <Image
                                src={session.user.image || ''}
                                width={35}
                                height={35}
                                className="rounded-full"
                                alt="profile"
                            />
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="sm:hidden flex items-center">
                {session?.user ? (
                    <>
                        <Image
                            src={session?.user.image || ''}
                            width={37}
                            height={37}
                            className='rounded-full'
                            alt='profile'
                            onClick={() => setToggleDropdown(!toggleDropdown)}
                        /> {/* Change on user image later */}
                        {toggleDropdown && (
                            <div className="dropdown">
                                <Link
                                    href={`/profile/${session?.user?.name}`}
                                    className="dropdown_link"
                                    onClick={() => setToggleDropdown(false)}
                                >
                                    My Profile
                                </Link>
                                <Link
                                    href="/years"
                                    className="dropdown_link"
                                    onClick={() => setToggleDropdown(false)}
                                >
                                    Years
                                </Link>
                                <Link
                                    href="/general"
                                    className="dropdown_link"
                                    onClick={() => setToggleDropdown(false)}
                                >
                                    General
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setToggleDropdown(false);
                                        signOut();
                                    }}
                                    className="purple_btn"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {providers &&
                            Object.values(providers).map((provider) => (
                                <button
                                    type="button"
                                    key={provider.id}
                                    onClick={() => {
                                        signIn(provider.id);
                                    }}
                                    className="black_btn"
                                >
                                    Sign in
                                </button>
                            ))}
                    </>
                )}
            </div>
        </nav >
    );
};

export default Nav;
