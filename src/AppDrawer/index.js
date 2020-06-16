import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import Checkbox from "@material-ui/core/Checkbox";
import NativeSelect from "@material-ui/core/NativeSelect";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";


const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    formControl: {
        margin: theme.spacing(2),
    },
    formGroup: {
        margin: theme.spacing(2),
    }
}));


export default function AppDrawer(props) {
    const classes = useStyles();
    const {
        example,
        examples,
        gridVisible,
        axesVisible,
        drawGrid,
        drawAxes,
        drawExample
    } = props;

    return (
        <Drawer
            className={classes.drawer}
            classes={{paper: classes.drawerPaper}}
            variant="permanent"
            open
        >
            <Toolbar/>

            <FormControl
                component="fieldset"
                className={classes.formControl}
            >
                <FormLabel component="legend">
                    Examples
                </FormLabel>

                <FormGroup className={classes.formGroup}>
                    <FormControl>
                        <NativeSelect
                            value={example}
                            onChange={
                                (event) => drawExample(event.target.value)
                            }
                        >
                            {
                                examples.map((item, index) =>
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                )
                            }
                        </NativeSelect>
                    </FormControl>
                </FormGroup>

                <FormLabel component="legend">
                    Settings
                </FormLabel>

                <FormGroup className={classes.formGroup}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={gridVisible}
                                color="primary"
                                onChange={
                                    (event) => drawGrid(event.target.checked)
                                }
                            />
                        }
                        label="Display Grid"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={axesVisible}
                                color="primary"
                                onChange={
                                    (event) => drawAxes(event.target.checked)
                                }
                            />
                        }
                        label="Display Axes of Separation"
                    />
                </FormGroup>
            </FormControl>
        </Drawer>
    );
}

