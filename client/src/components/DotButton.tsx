import * as React from "react";
import Checkbox from 'material-ui/Checkbox';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';

type CheckboxEvent = React.ChangeEvent<HTMLInputElement>;

const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
};

const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    width: '100px'
};

const checkboxStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '25px'
};

export interface DotButtonProps {
    text: string;
    dots: number;
}

export interface DotButtonState {
    selectedDots: number;
}

export class DotButton extends React.Component<DotButtonProps, DotButtonState> {
    constructor(props: DotButtonProps) {
        super(props);
        this.state = { selectedDots: props.dots };
    }

    updateCheck(event: CheckboxEvent, isInputChecked: boolean) {
        let input = event.target;
        this.setState(oldState => {
            if (oldState.selectedDots == 1 && input.value == '1') {
                return { selectedDots: 0 };
            }
            else {
                return { selectedDots: parseInt(input.value) };
            }
        });
    }

    render() {

        const dotButtons = [];

        for (let c = 1; c <= 5; c++) {
            const checked = c <= this.state.selectedDots;
            dotButtons.push(<Checkbox
                key={c}
                checkedIcon={<RadioButtonChecked />}
                uncheckedIcon={<RadioButtonUnchecked />}
                checked={checked}
                style={checkboxStyle}
                onCheck={this.updateCheck.bind(this)}
                value={c}
            />
            );
        }

        var dots = (
            <div>
                <div style={containerStyle}>
                    <div style={labelStyle}>
                        <span>{this.props.text}</span>
                    </div>
                    <div>
                        {dotButtons}
                    </div>
                </div>
            </div>
        );

        return dots;
    }
}
