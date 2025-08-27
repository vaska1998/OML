import {NextPage} from "next";
import {AuthorizeGuard} from "../../components/global/guard/authorize.guard";
import SidebarLayout from "../../components/layout/sidebar";
import useTranslation from "next-translate/useTranslation";
import AppOption from "../../components/common/option";
import {StateFetchedBatch, StateNamed} from "../../infrastructure/state";
import {ClientErrorResponse} from "../../infrastructure/client/response";
import {useEffect, useState} from "react";
import { useAppUser } from "../../contexts/user.context";
import {addDays} from "../../utils";
import {getConnection} from "../../tools/connection";
import {UserListResponse} from "../../infrastructure/dto/profile/user-list.response";
import {Calendar, DateLocalizer, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';



type State = StateFetchedBatch<UserListResponse[], ClientErrorResponse> | StateNamed<'FETCH'>;
const Schedule: NextPage = () => {
    const {t} = useTranslation('common');
    const {user} = useAppUser();
    const [state, setState] = useState<State>({type: 'EMPTY'});
    const [teacherList, setTeacherList] = useState<UserListResponse[]>([]);
    const [from, setFrom] = useState<Date>(new Date());
    const [until, setUntil] = useState<Date>(addDays(from, 30));
    const localize: DateLocalizer = momentLocalizer(moment);

    const events = [
        {
            title: 'Event 1',
            start: new Date(2023, 5, 8, 10, 0),
            end: new Date(2023, 5, 8, 12, 0),
        },
        {
            title: 'Event 2',
            start: new Date(2023, 5, 9, 14, 0),
            end: new Date(2023, 5, 9, 16, 0),
        },
    ];

    useEffect( () => {
        const {client} = getConnection();
        setState({type: 'LOADING', startedTime: new Date()});
        client.user.getTeachers().then(response =>{
            if (response.type == "SUCCESS") {
                setState({type: 'SUCCESS', result: response.result});
                setTeacherList(response.result);
            } else {
                setState({ type: 'ERROR', error: {...response}});
            }
        })
    }, []);

    return (
        <SidebarLayout pageMain={false} title={t('sidebar.schedule')} login={true}>
            <div className="w-full px-3 py-4 max-w-7xl flex mx-auto flex-col">
                <div className='flex flex-row w-full max-w-lg mx-auto my-4'>
                    <AppOption
                        name={'teacher'}
                        list={teacherList.map(item => {return item.lastName + ' ' + item.firstName.charAt(0) + '. (' + item.email + ')'})}
                        size={1}
                        label={t('labels.teachers')}
                        className={'w-full'}
                        labelClassName={'mt-5 text-lg'}
                    />
                </div>
                <div className='bg-white'>
                <Calendar
                    onShowMore={() => {console.log('b')}}
                    localizer={localize}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 700 }}
                />
                </div>
            </div>
        </SidebarLayout>
    )
}

export default AuthorizeGuard(Schedule);
