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
      <header className={`flex justify-between xl:px-28 px-10 text-white py-6 ${pageMain ? '' : 'bg-primary'}`}>
          {!isAuthorized ? (
              <p className='text-4xl pt-0.5 cursor-pointer' onClick={() => router.push('/')}>OML</p>
          ): (
              <p className='text-4xl pt-0.5 cursor-pointer' onClick={() => router.push('/main')}>OML</p>
          )}
          {pageMain && (
              <ul className='md:flex justify-center lg:text-2xl text-xl pt-2 hidden'>
                  <li className='xl:pl-32 md:pl-6 cursor-pointer'>{t('navMenu.aboutMe')}</li>
                  <li className='xl:px-24 md:px-6 cursor-pointer'>{t('navMenu.video')}</li>
                  <li className='cursor-pointer'>{t('navMenu.lessons')}</li>
              </ul>
          )}
          {pageMain && (
              <div className="md:hidden cursor-pointer text-2xl" onClick={() => closeLangMenu()}>
                  {langMenu ? <div className=''><IoCloseOutline/></div> :
                      <HiOutlineMenuAlt4/>}
              </div>
          )}
          <div className={`md:flex justify-center text-2xl ${pageMain ? 'hidden' : ''}`}>
              <div className='pr-5'>
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
