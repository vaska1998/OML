import {NextPage} from "next";
import SidebarLayout from "../../components/layout/sidebar";
import useTranslation from "next-translate/useTranslation";
import {useRouter} from "next/router";

const Invitation: NextPage = () => {
    const {t} = useTranslation('common');
    const router = useRouter();

    return (
        <SidebarLayout pageMain={false} title={t('sidebar.invitation')} login={true}>
            <div className="w-full px-3 py-4 max-w-lg mx-auto flex flex-col items-center">
                <h2 className='text-3xl'>{t('pageTitles.invite')}</h2>
            </div>
        </SidebarLayout>
    )
}
