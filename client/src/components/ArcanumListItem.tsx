import * as React from "react";

import { DotButton } from './DotButton';
import { Arcanum, DotsToTitles, Titles } from 'thaumaturge';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

export interface ArcanumListItemProps {
    arcanum: Arcanum;
    dots: number;
}

export interface ArcanumListItemState {
    dots: number;
    title: Titles;
}

export class ArcanumListItem extends React.Component<ArcanumListItemProps, ArcanumListItemState> {
    constructor(props: ArcanumListItemProps) {
        super(props);

        const title = DotsToTitles.get(this.props.dots) || "Untrained";
        this.state = { dots: this.props.dots, title: title };
        this.updateValues = this.updateValues.bind(this);
    }

    updateValues(oldDots: number, newDots: number) {
        const newTitle = DotsToTitles.get(newDots);

        if (newTitle) {
            this.setState({ dots: newDots, title: newTitle });
        }
        else {
            this.setState({ dots: newDots, title: "Untrained" });
        }
    }

    render() {
        const arcanumName = Arcanum[this.props.arcanum];
        const title = this.state.title;
        const dots = this.state.dots;

        const primaryTitle = (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '60px' }}>{arcanumName}</div>
                <DotButton dots={dots} onChange={this.updateValues} />
            </div >

        );
        return (
            <CardTitle title={primaryTitle} subtitle={title} />
        );
    }
}
