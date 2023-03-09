import {NextPage} from "next";
import {AuthorizeGuard} from "../../components/global/guard/authorize.guard";
import SidebarLayout from "../../components/layout/sidebar";

import useTranslation from "next-translate/useTranslation";


const MyLessons: NextPage = () => {
    const {t} = useTranslation('common');
    return (
        <SidebarLayout pageMain={false} title={t('sidebar.myLessons')} login={true}>
            <div className="w-full px-3 py-4 max-w-lg mx-auto flex flex-col">

            </div>
        </SidebarLayout>
    )
}

export default AuthorizeGuard(MyLessons);