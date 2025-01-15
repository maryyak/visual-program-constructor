import MyModules from '../pages/MyModules/MyModules';
import EditModule from "../pages/EditModule/EditModule";
import HomePage from "../pages/HomePage/HomePage";
import MyPrograms from "../pages/MyPrograms/MyPrograms";
import ViewModule from "../pages/ViewModule/ViewModule";
import EditProgram from "../pages/EditProgram/EditProgram";
import ViewProgram from "../pages/ViewProgram/ViewProgram";

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
        path: '/my-programs',
        element: <MyPrograms />,
    },
    {
        path: '/edit-program/:id',
        element: <EditProgram />,
    },
    {
        path: '/program/:id',
        element: <ViewProgram />,
    },
];