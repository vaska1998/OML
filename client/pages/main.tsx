import { NextPage } from "next";
import {AuthorizeGuard} from "../components/global/guard/authorize.guard";
import SidebarLayout from "../components/layout/sidebar";
import useTranslation from "next-translate/useTranslation";
import {useRouter} from "next/router";

const Main: NextPage = () => {
    const {t} = useTranslation('common');
    const router = useRouter();
    return (
        <SidebarLayout pageMain={false} title={t('headTitles.main')} login={true}>

        </SidebarLayout>
    );
};

export default AuthorizeGuard(Main);
