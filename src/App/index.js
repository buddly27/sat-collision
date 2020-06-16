import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Canvas from "../Canvas/index.js";
import AppDrawer from "../AppDrawer/index.js";


const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
}));


export default function App() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        gridVisible: true,
        axesVisible: true,
        example: "Hexagon + Square"
    });

    const examples = {
        "Hexagon + Square": [
            [[1, 0], [3, 2], [10, 2], [12, 0], [10, -2], [3, -2]],
            [[14, 4], [14, 7], [18, 7], [18, 4]]
        ],
        "Square + Square": [
            [[1, 1], [1, 4], [4, 4], [4, 1]],
            [[14, 4], [14, 7], [18, 7], [18, 4]]
        ],
    };

    const {gridVisible, axesVisible, example} = state;

    return (
        <div className="App">
            <AppBar
                position="fixed"
                className={classes.appBar}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Separating Axis Theorem
                    </Typography>
                </Toolbar>
            </AppBar>
            <AppDrawer
                example={example}
                examples={Object.keys(examples)}
                gridVisible={gridVisible}
                axesVisible={axesVisible}
                drawExample={(value) => setState({...state, example: value})}
                drawGrid={(value) => setState({...state, gridVisible: value})}
                drawAxes={(value) => setState({...state, axesVisible: value})}
            />
            <Canvas
                example={example}
                verticesList={examples[example]}
                gridVisible={gridVisible}
                axesVisible={axesVisible}
            />
        </div>
    );
}

