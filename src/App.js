import React from "react";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import AppWrapper from "./components/AppWrapper/AppWrapper";
import {UserStudyplansProvider} from "./components/UserStudyplansContext";

function App() {

    return (
        <BrowserRouter>
            <UserStudyplansProvider>
                <AppWrapper>
                    <AppRouter/>
                </AppWrapper>
            </UserStudyplansProvider>
        </BrowserRouter>
    );
}


export default App;