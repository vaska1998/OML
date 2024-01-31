import {NextPage} from "next";
import {AuthorizeGuard} from "../../components/global/guard/authorize.guard";
import SidebarLayout from "../../components/layout/sidebar";

import useTranslation from "next-translate/useTranslation";
import {useAppUser} from "../../contexts/user.context";
import Button from "../../components/common/button";
import AppButton from "../../components/common/button";
import {StateFetchedBatch, StateNamed} from "../../infrastructure/state";
import {UserUpdateRequest} from "../../infrastructure/dto/profile/user.update.request";
import {ClientErrorResponse} from "../../infrastructure/client/response";
import {useEffect, useState} from "react";
import {getConnection} from "../../tools/connection";
import {LessonResDto} from "../../infrastructure/dto/lesson/lesson.res.dto";
import {CreateLessonDto} from "../../infrastructure/dto/lesson/create.lesson.dto";
import AppPopupWrapper from "../../components/common/popup-wrapper";
import {SubmitHandler, useForm} from "react-hook-form";
import StatusErrors from "../../components/common/status.errors";
import AppOption from "../../components/common/option";
import {Instrument} from "../../infrastructure/constants/instruments";
import AppField from "../../components/common/field";
import {combineDateAndTime} from "../../utils";
import {UserRoles} from "../../infrastructure/constants/roles";
import {Notify} from "notiflix";
import {UserListResponse} from "../../infrastructure/dto/profile/user-list.response";

type State = StateFetchedBatch<UserUpdateRequest, ClientErrorResponse> | StateNamed<'FETCH'>;
const MyLessons: NextPage = () => {
    const {t} = useTranslation('common');
    const {  user } = useAppUser();
    const [state, setState] = useState<State>({ type: 'EMPTY'});
    const { handleSubmit, setValue, register} = useForm<CreateLessonDto>();
    const [lessons, setLessons] = useState<LessonResDto[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [date, setDate] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [instrumentsArray, setInstrumentArray] = useState<Instrument[]>([]);
    const [instrument, setInstrument] = useState<Instrument>(instrumentsArray[0]);
    const [studentArray, setStudentArray] = useState<UserListResponse[]>([]);
    const [studentId, setStudentId] = useState<string>('');
    const defaultError = t('errorMessages.smthGoesWrong');

    useEffect(() => {
        const { client } = getConnection();
        setState({
            type: 'FETCH',
        });
        client.lesson.getMyLessons().then(response => {
            if (response.type === 'SUCCESS') {
                setState({
                    type: 'EMPTY',
                });
                setLessons(response.result);
            } else {
                setState({
                    type: 'ERROR',
                    error: response,
                });
            }
        });
        client.user.getUserStudents().then(response => {
            if (response.type === 'SUCCESS') {
                setState({
                    type: 'EMPTY',
                });
                setStudentArray(response.result);
                setStudentId(response.result[0].id);
            } else {
                setState({
                    type: 'ERROR',
                    error: response,
                });
            }
        })
    }, []);

    useEffect(() => {
        if (user) {
            setInstrumentArray(user.claims.instrument)
            setInstrument(user.claims.instrument[0]);
        }
    }, [user]);

    useEffect(() => {
        if (date && startTime) {
            const resultDate = combineDateAndTime(new Date(date), startTime);
            setValue("startDate", resultDate);
        }
    }, [date, startTime]);

    const createLesson: SubmitHandler<CreateLessonDto> = data => {
        data.instrument = instrument;
        if (studentId) {
            data.studentId = studentId;
        }

        const { client } = getConnection();
        setState({
            type: 'FETCH',
        });
        client.lesson.create(data).then(response => {
            if (response.type === 'SUCCESS') {
                setState({
                    type: 'EMPTY',
                });
                setLessons([...lessons, response.result]);
                setIsPopupOpen(false);
                Notify.success(t('successMessages.success'));
            } else {
                setState({
                    type: 'ERROR',
                    error: response,
                });
            }
        });
    }

    const deleteLesson = (lessonId: string) => {
        const { client } = getConnection();
        setState({
            type: 'FETCH',
        });
        client.lesson.deleteById(lessonId).then(response => {
            if (response.type === 'SUCCESS') {
                setState({
                    type: 'EMPTY',
                });
                setLessons(lessons.filter(lesson => lesson.id !== lessonId));
                Notify.success(t('successMessages.success'));
            } else {
                setState({
                    type: 'ERROR',
                    error: response,
                });
            }
        });
    }

    return (
        <SidebarLayout pageMain={false} title={t('sidebar.myLessons')} login={true}>
            <div className='w-full pt-4 px-3 flex justify-end'>
                {user?.claims.roles.includes(UserRoles.Admin) &&
                    <div><Button onClick={() => setIsPopupOpen(true)}>{t('button.create')}</Button></div>
                }
            </div>
            <div className="w-full px-3 py-4 mx-auto flex flex-col justify-center items-center">
                <table className='table-fixed w-full bg-white px-4'>
                    <thead>
                    <tr className='font-bold bg-primary-lighter border border-solid border-gray-lighter'>
                        <td className='text-primary py-4 pl-4'>{t('table.time')}</td>
                        <td className='text-primary py-4'>{t('table.status')}</td>
                        <td className='text-primary py-4'>{t('table.teacher')}</td>
                        <td className='text-primary py-4'>{t('table.studentId')}</td>
                        <td className='text-primary py-4'>{t('table.instrument')}</td>
                        <td className='text-primary py-4'>{t('table.action')}</td>
                    </tr>
                    </thead>
                    <tbody>
                    {lessons.map((lesson: LessonResDto, index: number) => {
                        return (
                            <tr className='border border-solid border-black' key={lesson.id}>
                                <td className='text-primary-hover py-4 pl-4'>{lesson.startDate}</td>
                                <td className='text-primary-hover py-4'>{lesson.status}</td>
                                <td className='text-primary-hover py-4'>{lesson.teacherLastName + ' ' + lesson.teacherFirstName}</td>
                                <td className='text-primary-hover py-4'>{lesson.studentLastName && lesson.studentFirstName ? lesson.studentLastName + ' ' + lesson.studentFirstName : <span className='pl-6'>—</span>}</td>
                                <td className='text-primary-hover py-4'>{lesson.instrument}</td>
                                <td className='text-primary-hover py-4 flex justify-around'>
                                    <Button onClick={() => deleteLesson(lesson.id)}>{t('button.cancel')}</Button>
                                    <Button additionalStyle='mx-4'>{t('button.details')}</Button>
                                </td>
                            </tr>
                        );
                    })}

                    </tbody>
                </table>
            </div>
            <AppPopupWrapper
                isOpen={isPopupOpen}
                title={t('lesson.new')}
                closeModal={() => setIsPopupOpen(false)}
            >
                <form onSubmit={handleSubmit(createLesson)} className='mx-4' noValidate>
                    <AppOption
                        name={'studentId'}
                        list={studentArray.map(item => {return item.lastName + ' ' + item.firstName})}
                        size={1}
                        label={t('labels.studentId')}
                        className='mb-4'
                    />
                    <AppOption
                        name={'instrument'}
                        list={instrumentsArray}
                        size={1}
                        label={t('labels.instrument')}
                        className='mb-4'
                        onChange={(e)=>setInstrument(e.target.value as Instrument)}
                    />
                    <AppField
                        name={''}
                        type={'date'}
                        label={t('labels.date')}
                        className='mb-4'
                        onChange={async (e)=> setDate(e.target.value)}
                        error={t('errorMessages.fieldIsRequired')}
                    />
                    <AppField
                        name={''}
                        type={'time'}
                        label={t('labels.time')}
                        className='mb-4'
                        onChange={async (e): Promise<void> => setStartTime(e.target.value)}
                        required={true}
                        error={t('errorMessages.fieldIsRequired')}
                    />
                    {state.type == 'ERROR' && <div className={'mb-4'}><StatusErrors status={state.error.status} defaultError={defaultError}/></div>}
                    <AppButton type={'submit'} disabled={state.type == 'LOADING'}>
                        {t('button.save')}
                    </AppButton>
                </form>
            </AppPopupWrapper>
        </SidebarLayout>
    )
}

export default AuthorizeGuard(MyLessons);
