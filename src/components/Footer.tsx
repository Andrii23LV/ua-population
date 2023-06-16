import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
    return (
        <footer className="text-sm text-zinc-400 text-center w-full mt-6 p-6 border-t-[4px]">
            <div className="flex items-center justify-center">
                <Image src="/assets/icons/github.svg" width={20} height={20} alt="github-logo" className="mr-2" />
                <Link href="https://github.com/Andrii23LV">Github repository of the developer</Link>
            </div>
            <p>All rights reserved. Andrii Tretiak 2023.</p>
        </footer>
    );
};

export default Footer;
