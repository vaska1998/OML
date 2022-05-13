import type { NextPage } from 'next'
import SidebarLayout from "../components/layout/sidebar";
import {userAppTranslation} from "../contexts/translation.context";

const Home: NextPage = () => {
    const { t } = userAppTranslation();
  return (
    <SidebarLayout pageMain={true}>
        <section className='mt-24'>
            <h1 className='text-white text-8xl  ml-20 w-[700px]'>{t('lendingText.main')}</h1>
            <p className='text-white text-5xl uppercase mt-12 ml-20 w-[600px]'>{t('lendingText.motto')}</p>
            <button className='text-white text-2xl w-80 h-16 bg-primary ml-28 mt-12 rounded-2xl hover:bg-primary-hover'>{t('button.orderALesson')}</button>
        </section>
    </SidebarLayout>
  );
};

export default Home;
