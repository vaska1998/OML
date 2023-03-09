import {NextPage} from "next";
import {AuthorizeGuard} from "../../components/global/guard/authorize.guard";
import SidebarLayout from "../../components/layout/sidebar";
import useTranslation from "next-translate/useTranslation";
import AppOption from "../../components/common/option";
import {useAppRole} from "../../contexts/admin.context";
import {StateFetchedBatch, StateNamed} from "../../infrastructure/state";
import {UserUpdateRequest} from "../../infrastructure/dto/profile/user.update.request";
import {ClientErrorResponse} from "../../infrastructure/client/response";
import {useEffect, useState} from "react";

type State = StateFetchedBatch<UserUpdateRequest, ClientErrorResponse> | StateNamed<'FETCH'>;
const Schedule: NextPage = () => {
    const {t} = useTranslation('common');
    const {isAdmin} = useAppRole();
    const [state, setState] = useState<State>({type: 'EMPTY'});
    const [usersList, setUsersList] = useState<string[]>([]);

    useEffect( () => {

    }, []);

    return (
        <SidebarLayout pageMain={false} title={t('sidebar.schedule')} login={true}>
            <div>
                <AppOption name={''} list={usersList}/>
            </div>
        </SidebarLayout>
    )
}

export default AuthorizeGuard(Schedule);