import * as React from 'react';
import { TouchTapEvent } from 'material-ui';
import TextField from 'material-ui/TextField';
import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


export interface CoreAttributesProps {
    gnosis: number;
    order: string;
    path: string;
    onGnosisChange: (oldGnosis: number, newGnosis: number) => void;
    onPathChange: (oldPath: string, newPath: string) => void;
    onOrderChange: (oldOrder: string, newOrder: string) => void;
}

export class CoreAttributes extends React.Component<CoreAttributesProps, undefined> {
    constructor(props: CoreAttributesProps) {
        super(props);
        this.gnosisChanged = this.gnosisChanged.bind(this);
        this.pathChanged = this.pathChanged.bind(this);
        this.orderChanged = this.orderChanged.bind(this);
    }

    gnosisChanged(event: TouchTapEvent, key: number, newGnosis: number) {
        this.props.onGnosisChange(this.props.gnosis, newGnosis);
    }

    orderChanged(event: TouchTapEvent, key: number, newOrder: string) {
        this.props.onOrderChange(this.props.order, newOrder);
    }

    pathChanged(event: TouchTapEvent, key: number, newPath: string) {
        this.props.onPathChange(this.props.path, newPath);
    }

    render() {
        return (
            <Card>
                <CardTitle title="Core Attributes" subtitle="Character's core attributes" />
                <CardText>
                    These are the character's core attributes as they relate to spellcasting, such as Gnosis and Order.
                    <br />
                    <br />

                    <SelectField floatingLabelText="Gnosis" value={this.props.gnosis} onChange={this.gnosisChanged}>
                        <MenuItem value={1} primaryText="1" />
                        <MenuItem value={2} primaryText="2" />
                        <MenuItem value={3} primaryText="3" />
                        <MenuItem value={4} primaryText="4" />
                        <MenuItem value={5} primaryText="5" />
                        <MenuItem value={6} primaryText="6" />
                        <MenuItem value={7} primaryText="7" />
                        <MenuItem value={8} primaryText="8" />
                        <MenuItem value={9} primaryText="9" />
                        <MenuItem value={10} primaryText="10" />
                    </SelectField>

                    <SelectField floatingLabelText="Path" value={this.props.path} onChange={this.pathChanged}>
                        <MenuItem value="Acanthus" primaryText="Acanthus" />
                        <MenuItem value="Mastigos" primaryText="Mastigos" />
                        <MenuItem value="Moros" primaryText="Moros" />
                        <MenuItem value="Obrimos" primaryText="Obrimos" />
                        <MenuItem value="Thyrsus" primaryText="Thyrsus" />
                    </SelectField>

                    <SelectField floatingLabelText="Order" value={this.props.order} onChange={this.orderChanged}>
                        <MenuItem value="Silver Ladder" primaryText="Silver Ladder" />
                        <MenuItem value="Mysterium" primaryText="Mysterium" />
                        <MenuItem value="Adamantine Arrows" primaryText="Adamantine Arrows" />
                        <MenuItem value="Guardians of the Veil" primaryText="Guardians of the Veil" />
                        <MenuItem value="Free Council" primaryText="Free Council" />
                        <MenuItem value="Seers of the Throne" primaryText="Seers of the Throne" />
                        <MenuItem value="Tremere" primaryText="Tremere" />
                    </SelectField>
                </CardText>
            </Card >
        );
    }
}
