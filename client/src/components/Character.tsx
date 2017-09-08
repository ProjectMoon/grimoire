import * as React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import { List, ListItem } from 'material-ui/List';
import { TouchTapEvent } from 'material-ui';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Paper from 'material-ui/Paper';

import { DotButton } from './DotButton';

import { Arcanum } from 'thaumaturge';

export interface CharacterProps {
    name: string;
    arcanaDots: Map<Arcanum, number>;
    rulingArcana: Array<Arcanum>;
    gnosis: number;
}

export interface CharacterState {
    //TODO will be used for health etc.
}

export class Character extends React.Component<CharacterProps, CharacterState> {
    constructor(props: CharacterProps) {
        super(props);
        this.state = {};
    }

    render() {
        const arcana: Array<JSX.Element> = [];

        let c = 0;
        this.props.arcanaDots.forEach((dots, arcanum) => {
            arcana.push(<DotButton key={c} text={Arcanum[arcanum]} dots={dots} />);
            c++;
        });

        return (
            <Paper zDepth={2}>
                <CardHeader title="Character" subtitle={this.props.name} />
                <div>
                    <List>
                        {arcana}
                    </List>
                </div>
            </Paper>
        );
    }
}
