import {NextPage} from "next";
import {AuthorizeGuard} from "../../components/global/guard/authorize.guard";
import SidebarLayout from "../../components/layout/sidebar";
import useTranslation from "next-translate/useTranslation";

const Lessons: NextPage = () => {
    const {t} = useTranslation('common');

    return (
        <SidebarLayout pageMain={false} title={t('sidebar.myLessons')} login={true}>
            <div className="w-full px-3 py-4 max-w-lg mx-auto flex flex-col items-center">
                <h2 className='text-3xl'>{t('sidebar.myLessons')}</h2>
            </div>
        </SidebarLayout>
    )
}

export default AuthorizeGuard(Lessons);
