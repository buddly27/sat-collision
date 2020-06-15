import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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
        separationAxesVisible,
        drawGrid,
        drawSeparationAxes,
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
                        <Select
                            value={example}
                            onChange={
                                (event) => drawExample(event.target.value)
                            }
                        >
                            {
                                examples.map((item) =>
                                    <MenuItem value={item}>{item}</MenuItem>
                                )
                            }
                        </Select>
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
                                checked={separationAxesVisible}
                                color="primary"
                                onChange={
                                    (event) => {
                                        drawSeparationAxes(event.target.checked)
                                    }
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

