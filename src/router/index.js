import MyModules from '../pages/MyModules/MyModules';
import EditModule from "../pages/EditModule/EditModule";
import HomePage from "../pages/HomePage/HomePage";
import MyDisciplines from "../pages/MyDisciplines/MyDisciplines";
import ViewModule from "../pages/ViewModule/ViewModule";
import EditDiscipline from "../pages/EditDiscipline/EditDiscipline";
import ViewDiscipline from "../pages/ViewDiscipline/ViewDiscipline";
import EditStudyplan from "../pages/EditStudyplan/EditStudyplan";
import MyStudyplans from "../pages/MyStudyplans/MyStudyplans";
import ViewStudyplan from "../pages/ViewStudyplan/ViewStudyplan";

export const routes = [
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/my-modules',
        element: <MyModules />,
    },
    {
        path: '/edit-module/:id',
        element: <EditModule />,
    },
    {
        path: '/module/:id',
        element: <ViewModule />,
    },
    {
        path: '/my-disciplines',
        element: <MyDisciplines />,
    },
    {
        path: '/edit-discipline/:id',
        element: <EditDiscipline />,
    },
    {
        path: '/discipline/:id',
        element: <ViewDiscipline />,
    },
    {
        path: '/my-studyplans',
        element: <MyStudyplans />,
    },
    {
        path: '/edit-studyplan/:id',
        element: <EditStudyplan />,
    },
    {
        path: '/studyplan/:id',
        element: <ViewStudyplan />,
    },
];