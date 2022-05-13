import React, {useState} from 'react';
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import {useRouter} from "next/router";
import {HiOutlineMenuAlt4} from "react-icons/hi";
import {IoCloseOutline} from 'react-icons/io5';
import SelectLang from "../select-lang";

export interface Header {
    pageMain: boolean;
}

const Header = ({pageMain}:Header) => {
    const { t, lang } = useTranslation('common');
    const router = useRouter();
    const [langMenu, setLangMenu] = useState<boolean>(false);

    const closeLangMenu = () => {
        switch (langMenu) {
            case false:
                setLangMenu(true);
                break;
            case true:
                setLangMenu(false);
        }
    }
  return (
      <header className={`flex justify-between px-28 text-white py-6 ${pageMain ? '' : 'bg-primary'}`}>
          <p className='text-4xl pt-0.5 cursor-pointer' onClick={() => router.push('/')}>OML</p>
          {pageMain && (
              <ul className='flex justify-center text-2xl pt-2'>
                  <li className='pl-32 cursor-pointer'>{t('navMenu.aboutMe')}</li>
                  <li className='px-24 cursor-pointer'>{t('navMenu.video')}</li>
                  <li className='cursor-pointer'>{t('navMenu.lessons')}</li>
              </ul>
          )}
          <div className='flex justify-center text-2xl '>
              <div className='pr-10'>
                  <div className="md:hidden cursor-pointer" onClick={() => closeLangMenu()}>
                      {langMenu ? <IoCloseOutline/> :
                      <HiOutlineMenuAlt4/>}
                  </div>
                  <SelectLang/>
              </div>
              <p className='pt-1.5 cursor-pointer' onClick={() => router.push('/auth/login')}>{t('navMenu.singIn')}</p>
          </div>
      </header>
  )
}

export default Header;
