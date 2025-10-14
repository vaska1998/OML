import type { NextPage } from 'next'
import SidebarLayout from "../components/layout/sidebar";
import {useAppTranslation} from "../contexts/translation.context";

const Home: NextPage = () => {
    const { t } = useAppTranslation();

  return (
      <SidebarLayout pageMain={true}>
          <div className='mt-24'>
              <div>
                  <h1 className='text-white text-8xl  ml-20 w-[700px]'>{t('lendingText.main')}</h1>
                  <p className='text-white text-5xl uppercase mt-12 ml-20 w-[600px]'>{t('lendingText.motto')}</p>
                  <button
                      className='text-white text-2xl w-80 h-16 bg-primary ml-28 mt-12 rounded-2xl hover:bg-primary-hover'>{t('button.orderALesson')}</button>
              </div>
          </div>
          <div className='lg:mt-96 mt-32' id='video'>
              <h2 className="text-4xl text-center font-bold uppercase text-primary-light">{t('navMenu.video')}</h2>
              <div className="flex justify-around mt-10 ml-5">
                  <div className="">
                      <iframe width="560" height="315" src="https://www.youtube.com/embed/ZvF3ePqF77s"
                              title="YouTube video player" frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen/>
                      <p className="text-center font-bold text-xl">{t('lendingText.chanChan')}</p>
                  </div>
                  <div className="">
                      <iframe width="560" height="315" src="https://www.youtube.com/embed/XrGzNJAeU1I"
                              title="YouTube video player" frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen/>
                      <p className="text-center font-bold text-xl">{t('lendingText.concert')}</p>
                  </div>
              </div>
          </div>
          <div className="flex justify-between mx-24 mt-24" id='aboutMe'>
              <div className="">
                  <img src="../public/img/7.png" alt="Me"/>
              </div>
              <div className="mt-10">
                  <h2 className="text-center text-4xl text-primary-light mb-5 pt-5">{t('lendingText.aboutMe')}</h2>
                  <p className="ml-10 max-w-xl indent-8">{t('lendingText.inMay')}</p>
                  <p className="ml-10 max-w-xl indent-8">{t('lendingText.firstSong')}</p>
                  <p className="ml-10 max-w-xl indent-8">{t('lendingText.partTime')}</p>
              </div>
          </div>
      </SidebarLayout>
  );
};

export default Home;
