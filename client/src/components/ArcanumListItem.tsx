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

        /* const title = DotsToTitles.get(this.props.dots) || "Untrained";
         * this.state = { dots: this.props.dots, title: title };*/
        this.updateValues = this.updateValues.bind(this);
    }

    updateValues(oldDots: number, newDots: number) {
        /* const newTitle = DotsToTitles.get(newDots);

         * if (newTitle) {
         *     this.setState({ dots: newDots, title: newTitle });
         * }
         * else {
         *     this.setState({ dots: newDots, title: "Untrained" });
         * }*/

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
