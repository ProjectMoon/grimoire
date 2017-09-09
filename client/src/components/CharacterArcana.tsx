import * as React from "react";
import { ArcanumListItem, ArcanumChangeHandler } from './ArcanumListItem';
import Divider from 'material-ui/Divider';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

import { Arcanum, DotsToTitles } from 'thaumaturge';

export type Arcana = Map<Arcanum, number>;

interface CharacterArcanaProps {
    arcana: Arcana;
    onArcanumChanged?: ArcanumChangeHandler;
}

export class CharacterArcana extends React.Component<CharacterArcanaProps, undefined> {
    constructor(props: CharacterArcanaProps) {
        super(props);
        this.updateArcanum.bind(this);
    }

    updateArcanum(arcanum: Arcanum, oldDots: number, newDots: number) {
        this.setState(oldState => {
            if (this.props.onArcanumChanged && oldDots != newDots)
                this.props.onArcanumChanged(arcanum, oldDots, newDots);
        });
    }

    render() {
        const arcana: Array<JSX.Element> = [];

        let c = 0;
        this.props.arcana.forEach((dots, arcanum) => {
            arcana.push(
                <ArcanumListItem
                    key={'arcanum' + c}
                    onChange={this.props.onArcanumChanged}
                    arcanum={arcanum}
                    title={DotsToTitles.get(dots) || "Untrained"}
                    dots={dots} />
            );

            arcana.push(<Divider key={'divider' + c} />);
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
