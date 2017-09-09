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
import Divider from 'material-ui/Divider';

import { ArcanumListItem } from './ArcanumListItem';
import { DotButton } from './DotButton';
import { CharacterArcana } from './CharacterArcana';

import { Arcanum, DotsToTitles } from 'thaumaturge';

export interface CharacterProps {
    name: string;
    arcanaDots: Map<Arcanum, number>;
    rulingArcana: Array<Arcanum>;
    gnosis: number;
}

export interface CharacterState {
    //TODO will be used for health etc.
}

//TODO a lot of the saving will live here, by exposing different on change handlers (save arcanum, save gnosis).
export class Character extends React.Component<CharacterProps, CharacterState> {
    constructor(props: CharacterProps) {
        super(props);
        this.state = {};
    }

    render() {
        const arcana: Array<JSX.Element> = [];

        return (
            <Card>
                <CardHeader title={this.props.name} subtitle="Order Path" />
                <CardText>
                    This is the character page, where basic attributes related to spellcasting are defined for the character.
                    <CharacterArcana arcana={this.props.arcanaDots} />
                </CardText>
            </Card>
        );
    }
}
