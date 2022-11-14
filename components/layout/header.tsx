import React, {useEffect, useState} from 'react';
import useTranslation from "next-translate/useTranslation";
import {useRouter} from "next/router";
import {HiOutlineMenuAlt4} from "react-icons/hi";
import {IoCloseOutline} from 'react-icons/io5';
import SelectLang from "../select-lang";
import {useAppUser} from "../../contexts/user.context";

export interface Header {
    pageMain: boolean;
}

const Header = ({pageMain}:Header) => {
    const { t, lang } = useTranslation('common');
    const router = useRouter();
    const { isAuthorized, signOut } = useAppUser();
    const [langMenu, setLangMenu] = useState<boolean>(false);

    const closeLangMenu = () => {
        switch (langMenu) {
            case false:
                setLangMenu(true);
                break;
            case true:
                setLangMenu(false);
        }
    };

    const navigateTo = (link: string | Partial<URL>) => {
        langMenu && closeLangMenu();
        router.push(link).then();
    };

    useEffect(() => {
        window.addEventListener('orientationchange', () => setLangMenu(false));
        window.addEventListener('resize', e => {
            if (langMenu && window.innerWidth > 770) {
                setLangMenu(false);
            }
        });
    }, []);

    useEffect(() => {
        window.document.body.style.overflowY = langMenu ? 'hidden' : 'auto';
    }, [langMenu]);

  return (
      <header className={`flex justify-between px-28 text-white py-6 ${pageMain ? '' : 'bg-primary'}`}>
          {!isAuthorized ? (
              <p className='text-4xl pt-0.5 cursor-pointer' onClick={() => router.push('/')}>OML</p>
          ): (
              <p className='text-4xl pt-0.5 cursor-pointer' onClick={() => router.push('/main')}>OML</p>
          )}
          {pageMain && (
              <ul className='flex justify-center text-2xl pt-2'>
                  <li className='pl-32 cursor-pointer'>{t('navMenu.aboutMe')}</li>
                  <li className='px-24 cursor-pointer'>{t('navMenu.video')}</li>
                  <li className='cursor-pointer'>{t('navMenu.lessons')}</li>
              </ul>
          )}
          <div className='flex justify-center text-2xl '>
              <div className='pr-5'>
                  <div className="md:hidden cursor-pointer" onClick={() => closeLangMenu()}>
                      {langMenu ? <IoCloseOutline/> :
                      <HiOutlineMenuAlt4/>}
                  </div>
                  <SelectLang/>
              </div>
              {!isAuthorized ? (
                  <>
                      <p className='pt-1.5 cursor-pointer' onClick={() => router.push('/auth/register')}>{t('navMenu.signUp')}</p>
                      <p className='pt-1.5 cursor-pointer pl-5' onClick={() => router.push('/auth/login')}>{t('navMenu.singIn')}</p>
                  </>
              ) : (
                  <>
                      <p className='pt-1.5 cursor-pointer pr-5' onClick={() => signOut()}>{t('navMenu.singOut')}</p>
                  </>
              )
              }
          </div>
      </header>
  )
}

export default Header;
