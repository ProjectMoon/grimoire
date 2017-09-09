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

type PaneName = 'Home' | 'Spellcasting' | 'Spell List' | 'Character';
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
        this.state = { open: false, currentPane: 'Home' };
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
                        <MenuItem value="Home" onTouchTap={this.handleClose}>Home</MenuItem>
                        <MenuItem value="Character" onTouchTap={this.handleClose}>Character</MenuItem>
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
        //TODO replace with individual functions for rendering characters.
        const pane = this.state.currentPane;
        const items = ['ok', 'not ok', 'u wot'];

        if (pane == 'Home') {
            return (
                <div>
                    <CardHeader title="Title Here" subtitle="A subtitle" />
                    <CardText>What you say mate?</CardText>
                    <ExampleList name="Stuff List" items={items} />
                </div>
            );
        }
        else if (pane == 'Character') {
            const arcana: Map<Arcanum, number> = new Map<Arcanum, number>();

            arcana.set(Arcanum.Life, 3);
            arcana.set(Arcanum.Time, 2);
            arcana.set(Arcanum.Spirit, 1);

            return (
                <Character arcanaDots={arcana} name="Joe" gnosis={6} rulingArcana={[Arcanum.Life, Arcanum.Death]} />
            );
        }

        return <ExampleList name="Oh no" items={items} />
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
}

export interface ExampleListProps {
    name: string;
    items: Array<string>;
}

export class ExampleList extends React.Component<ExampleListProps, undefined> {
    render() {
        let listItems: Array<JSX.Element> = [];

        for (let item of this.props.items) {
            listItems.push(<li>{item}</li>);
        }

        return (
            <div>
                <h2>{this.props.name}'s TODO list:</h2>
                <ul>{listItems}</ul>
            </div>
        );
    }
}
