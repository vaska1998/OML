import {NextPage} from "next";
import SidebarLayout from "../../components/layout/sidebar";
import useTranslation from "next-translate/useTranslation";
import {useRouter} from "next/router";
import AppField from "../../components/common/field";
import {AuthorizeGuard} from "../../components/global/guard/authorize.guard";
import {SubmitHandler, useForm} from "react-hook-form";
import {UpdateUserRoleRequest} from "../../infrastructure/dto/profile/update.role.request";
import {StateFetchedBatch, StateNamed} from "../../infrastructure/state";
import {ClientErrorResponse} from "../../infrastructure/client/response";
import {useState} from "react";
import AppOption from "../../components/common/option";
import {UserRoles} from "../../infrastructure/constants/roles";
import {getConnection} from "../../tools/connection";
import {Notify} from "notiflix";
import AppButton from "../../components/common/button";
import StatusErrors from "../../components/common/status.errors";
import {useAppUser} from "../../contexts/user.context";

type State = StateFetchedBatch<Record<string, never>, ClientErrorResponse> | StateNamed<'FETCH'>;

const Invitation: NextPage = () => {
    const {t} = useTranslation('common');
    const router = useRouter();
    const { user } = useAppUser();
    const [state, setState] = useState<State>({ type: 'EMPTY'});
    const { register, handleSubmit, reset, formState: { errors }, setValue} = useForm<UpdateUserRoleRequest>();
    const [role, setRole] = useState<UserRoles>(UserRoles.User);
    const userRolesArray = Object.keys(UserRoles);
    const userRolesValues = Object.values(UserRoles);
    const defaultError = t('errorMessages.smthGoesWrong');

    const onSubmit: SubmitHandler<UpdateUserRoleRequest> = data => {
        const {client} = getConnection();
        data.role = role;
        setState({type: 'LOADING', startedTime: new Date()});
        client.user.updateRole(data).then(response => {
            if (response.type == 'SUCCESS') {
                setState({type: 'SUCCESS', result: response.result});
                Notify.success(t('successMessages.success'));
                reset();
            } else {
                setState({ type: 'ERROR', error: {...response}});
            }
        });
    };

    const getRoleFromValue = (value: string): UserRoles => {
        const index = userRolesArray.indexOf(value);
        return index >= 0 ? userRolesValues[index] : UserRoles.User;
    };


    return (
        <SidebarLayout pageMain={false} title={t('sidebar.invitation')} login={true}>
            <div className="w-full px-3 py-4 max-w-lg mx-auto flex flex-col items-center">
                <h2 className='text-3xl mt-16 mb-4'>{t('pageTitles.invite')}</h2>
                <form className='w-full space-y-4 ' id='invitation_form' onSubmit={handleSubmit(onSubmit)}>
                    <AppField
                        type={'email'}
                        label={t('labels.email')}
                        {...register('email', {
                            required: t('errorMessages.fieldIsRequired'),
                        })}
                    />
                    {user?.claims.roles.includes(UserRoles.Admin) &&
                        <AppOption
                        name={'role'}
                        list={userRolesArray}
                        size={1}
                        label={t('labels.role')}
                        onChange={(e)=>setRole(getRoleFromValue(e.target.value as UserRoles))}
                        className="pb-4"
                        />
                    }
                {state.type == 'ERROR' && <div className={'mb-4'}><StatusErrors status={state.error.status} defaultError={defaultError}/></div>}
                    <AppButton type={'submit'} disabled={state.type == 'LOADING'}>
                        {t('button.saveChanges')}
                    </AppButton>
                </form>
            </div>
        </SidebarLayout>
    )
}

export default AuthorizeGuard(Invitation);
