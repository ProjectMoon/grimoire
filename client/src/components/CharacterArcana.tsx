import * as React from "react";
import { ArcanumListItem } from './ArcanumListItem';
import Divider from 'material-ui/Divider';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

import { Arcanum, DotsToTitles } from 'thaumaturge';

export type Arcana = Map<Arcanum, number>;

interface CharacterArcanaProps {
    arcana: Arcana;
    onChange?: (oldArcana: Arcana, newArcana: Arcana) => void;
}

interface CharacterArcanaState {
    arcana: Map<Arcanum, number>;
}

export class CharacterArcana extends React.Component<CharacterArcanaProps, CharacterArcanaState> {
    constructor(props: CharacterArcanaProps) {
        super(props);
        //TODO handle sparse arcana dots properly.
        this.state = { arcana: this.props.arcana };
        this.updateArcana.bind(this);
    }

    updateArcana(newArcana: Arcana) {
        this.setState(oldState => {
            if (this.props.onChange)
                this.props.onChange(oldState.arcana, newArcana);
        });
    }

    render() {
        const arcana: Array<JSX.Element> = [];

        let c = 0;
        this.props.arcana.forEach((dots, arcanum) => {
            arcana.push(
                <ArcanumListItem key={c} arcanum={arcanum} dots={dots} />
            );

            arcana.push(<Divider />);
            c++;
        });

        return (
            <Card>
                <CardTitle title="Arcana" subtitle="Your mastery over the forces of the Supernal" />
                <CardText>
                    {arcana}
                </CardText>
            </Card>
        );
    }
}
