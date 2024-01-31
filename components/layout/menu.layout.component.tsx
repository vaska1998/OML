import React, {useState} from 'react';
import {StateFetchedBatch, StateNamed} from "../../infrastructure/state";
import {ClientErrorResponse} from "../../infrastructure/client/response";
import {useRouter} from "next/router";
import {useAppTranslation} from "../../contexts/translation.context";
import {useAppUser} from "../../contexts/user.context";
import NavigationListItem from "../nav/navigation.list.item";
import {HiOutlineUserCircle} from "react-icons/hi";
import {AiFillCheckCircle, AiFillSchedule} from "react-icons/ai";
import {UserRoles} from '../../infrastructure/constants/roles';

type MenuLayoutComponentProps = {
    onClick?: () => unknown,
}

type State = StateFetchedBatch<ClientErrorResponse> | StateNamed<'FETCH'>;

const MenuLayoutComponent: React.FunctionComponent<MenuLayoutComponentProps> = ({ onClick }) => {
    const router = useRouter();
    const { t, lVal } = useAppTranslation();
    const { isAuthorized, user } = useAppUser();
    const [state, setState] = useState<State>( { type: 'EMPTY'});

    const navigateTo = (path: string | Partial<URL>) => {
        router.push(path).then();
        onClick && onClick();
    };

    return (
        <div className={'h-full h-menu-overflow overflow-y-auto md:h-auto pb-4 md:pb-0'}>
            {isAuthorized ? (
                <>
                    <NavigationListItem
                        label={t('sidebar.myProfile')}
                        onClick={() => {
                            router.push('/user/my-profile').then();
                        }}
                        prepend={<HiOutlineUserCircle />}
                        additionalStyle={`py-3 mb-4 pl-3 text-white ${router.asPath == '/user/my-profile' ? 'bg-primary-light' : ''}`}
                    />
                    <NavigationListItem
                        label={t('sidebar.myLessons')}
                        onClick={() => {
                            router.push('/user/lessons').then();
                        }}
                        prepend={<AiFillCheckCircle />}
                        additionalStyle={`py-3 mb-4 pl-3 text-white ${router.asPath == '/user/lessons' ? 'bg-primary-light' : ''}`}
                    />
                    {user?.claims.roles.includes(UserRoles.Teacher || UserRoles.Admin) && (
                        <>
                            <hr className='my-5'/>
                            <NavigationListItem
                                label={t('sidebar.invitation')}
                                onClick={() => {
                                    router.push('/teacher/invitation').then();
                                }}
                                prepend={<AiFillSchedule />}
                                additionalStyle={`py-3 mb-4 pl-3 text-white ${router.asPath == '/teacher/invitation' ? 'bg-primary-light' : ''}`}
                            />
                            <NavigationListItem
                                label={t('sidebar.schedule')}
                                onClick={() => {
                                    router.push('/teacher/schedule').then();
                                }}
                                prepend={<AiFillSchedule />}
                                additionalStyle={`py-3 mb-4 pl-3 text-white ${router.asPath == '/teacher/schedule' ? 'bg-primary-light' : ''}`}
                            />
                        </>
                    )}
                </>
            ) :
                (<></>
            )}
        </div>
    );
};

export default MenuLayoutComponent;
