import React from "react";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import AppWrapper from "./components/AppWrapper/AppWrapper";

function App() {

    return (
        <BrowserRouter>
            <AppWrapper>
                <AppRouter/>
            </AppWrapper>
        </BrowserRouter>
    );
}


export default App;