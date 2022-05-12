import React from 'react';
import useTranslation from "next-translate/useTranslation";
import {FaFacebookF, FaTwitter} from 'react-icons/fa';

const Footer = () => {
    const {t}= useTranslation('common');
    return (
        <footer className="text-center py-4 md:py-2 px-4 md:border-t border-gray h-24 md:h-16 md:flex md:justify-between md:items-center bg-primary text-white">
            <div className="text-xs font-normal">{t('footer.allRightsReserved')}</div>
            <div className="flex place-content-center pt-8 md:pt-0 space-x-2">
                <a className="px-2">
                    <FaFacebookF/>
                </a>
                <a className="px-2">
                    <FaTwitter/>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
