import * as React from "react";

import { DotButton } from './DotButton';
import { Arcanum, DotsToTitles, Titles } from 'thaumaturge';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

export type ArcanumChangeHandler = (arcanum: Arcanum, oldDots: number, newDots: number) => void;


export interface ArcanumListItemProps {
    arcanum: Arcanum;
    dots: number;
    title: Titles;
    onChange?: ArcanumChangeHandler;
}

export class ArcanumListItem extends React.Component<ArcanumListItemProps, undefined> {
    constructor(props: ArcanumListItemProps) {
        super(props);
        this.updateValues = this.updateValues.bind(this);
    }

    updateValues(oldDots: number, newDots: number) {
        if (this.props.onChange)
            this.props.onChange(this.props.arcanum, oldDots, newDots);
    }

    render() {
        const arcanumName = Arcanum[this.props.arcanum];
        const title = this.props.title;
        const dots = this.props.dots;

        const primaryTitle = (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '75px' }}>{arcanumName}</div>
                <DotButton dots={dots} onChange={this.updateValues} />
            </div >

        );
        return (
            <CardTitle title={primaryTitle} subtitle={title} />
        );
    }
}
