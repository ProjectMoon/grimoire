import * as React from "react";
import Checkbox from 'material-ui/Checkbox';
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
    dots: number;
    onChange: (oldDots: number, newDots: number) => void;
}

export interface DotButtonState {
    selectedDots: number;
}

//TODO add support for disabled and higher than 5 dots.
export class DotButton extends React.Component<DotButtonProps, DotButtonState> {
    constructor(props: DotButtonProps) {
        super(props);
        this.state = { selectedDots: props.dots };
    }

    updateCheck(event: CheckboxEvent, isInputChecked: boolean) {
        let input = event.target;
        this.setState(oldState => {
            let newDots = parseInt(input.value);
            if (oldState.selectedDots == 1 && newDots == 1) {
                newDots = 0;
            }

            this.props.onChange(oldState.selectedDots, newDots);
            return { selectedDots: newDots };
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

        return <div style={containerStyle}>{dotButtons}</div>;
    }
}
