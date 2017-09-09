import * as React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import { TouchTapEvent } from 'material-ui';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

import { Arcanum } from 'thaumaturge';
import { Character } from './Character';

type PaneName = 'Character List' | 'Spellcasting' | 'Spell List' | 'Character Sheet';
export interface HelloProps { title: string; }
export interface HelloState {
    open: boolean;
    currentPane: PaneName;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class Hello extends React.Component<HelloProps, HelloState> {
    timerID: number;

    constructor(props: HelloProps) {
        super(props);
        this.state = { open: false, currentPane: 'Character List' };
    }

    toggleMenu = () => {
        this.setState({ open: !this.state.open });
    };

    handleClose = (e: TouchTapEvent) => {
        this.setState({ open: false });
    };

    menuChange = (e: TouchTapEvent, value: PaneName) => {
        console.log(e.target);
        console.log(value);
        this.setState({ currentPane: value });
    };

    render() {
        return (
            <div>
                <AppBar title={this.props.title} onLeftIconButtonTouchTap={this.toggleMenu} />
                <Drawer docked={false} open={this.state.open} onRequestChange={(open) => this.setState({ open })}>
                    <Menu onChange={this.menuChange}>
                        <MenuItem value="Character List" onTouchTap={this.handleClose}>Character List</MenuItem>
                        <MenuItem value="Character Sheet" onTouchTap={this.handleClose}>Character Sheet</MenuItem>
                        <MenuItem value="Spellcasting" onTouchTap={this.handleClose}>Spellcasting</MenuItem>
                        <MenuItem value="Spell List" onTouchTap={this.handleClose}>Spell List</MenuItem>
                    </Menu>
                </Drawer>
                <Card>
                    {this.renderPane()}
                </Card>
            </div >
        );
    }

    renderPane(): JSX.Element {
        const pane = this.state.currentPane;

        if (pane == 'Character List') {
            return this.renderCharacterList();
        }
        else if (pane == 'Character Sheet') {
            return this.renderCharacterPane();
        }
        else if (pane == 'Spell List') {
            return this.renderSpellList();
        }
        else if (pane == 'Spellcasting') {
            return this.renderSpellcasting();
        }
        else {
            throw new Error('Unrecognized frame');
        }
    }

    renderCharacterList(): JSX.Element {
        return (
            <div>
                <CardHeader title="Title Here" subtitle="A subtitle" />
                <CardText>What you say mate?</CardText>
            </div>
        );
    }

    renderCharacterPane(): JSX.Element {
        const arcana: Map<Arcanum, number> = new Map<Arcanum, number>();

        arcana.set(Arcanum.Life, 3);
        arcana.set(Arcanum.Time, 2);
        arcana.set(Arcanum.Spirit, 1);

        return (
            //TODO introduce list on the side for loading and making new characters.
            <Character characterID={1} />
        );
    }

    renderSpellList(): JSX.Element {
        return <div />;
    }

    renderSpellcasting(): JSX.Element {
        return <div />;
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
}
