import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Canvas from "../Canvas/index.js";


function App() {
    return (
        <div className="App">
            <AppBar position="static" style={{padding: 10}}>
                <Typography variant="h6" noWrap>
                    Collision demonstration
                </Typography>
            </AppBar>
            <Canvas/>
        </div>
    );
}

export default App;

