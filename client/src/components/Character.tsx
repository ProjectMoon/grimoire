import * as React from "react";
import { EventSubscription } from 'fbemitter';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

import { ArcanumChangeHandler } from './ArcanumListItem';
import { CharacterArcana } from './CharacterArcana';
import { CoreAttributes } from './CoreAttributes';

import * as CharacterDb from '../db/character-db';

import { Arcanum, DotsToTitles } from 'thaumaturge';

export interface CharacterProps {
    characterID: number;
}

export interface CharacterState {
    currentCharacter: CharacterDb.Character;
}

//TODO eventually this will be moved elsewhere.
function createNewCharacter(id: number) {
    const arcana = new Map<Arcanum, number>();
    arcana.set(Arcanum.Death, 0);
    arcana.set(Arcanum.Fate, 0);
    arcana.set(Arcanum.Forces, 0);
    arcana.set(Arcanum.Life, 0);
    arcana.set(Arcanum.Matter, 0);
    arcana.set(Arcanum.Mind, 0);
    arcana.set(Arcanum.Prime, 0);
    arcana.set(Arcanum.Space, 0);
    arcana.set(Arcanum.Spirit, 0);
    arcana.set(Arcanum.Time, 0);

    const character: CharacterDb.Character = {
        id: id,
        name: 'Joe',
        order: 'Seers of the Throne',
        path: 'Acanthus',
        gnosis: 1,
        arcanaDots: arcana,
        rulingArcana: [Arcanum.Life, Arcanum.Spirit]
    };

    return character;
}

//TODO this is essentially a controller, since it's the top level for all character stuff.
export class Character extends React.Component<CharacterProps, CharacterState> {
    private token: EventSubscription;
    constructor(props: CharacterProps) {
        super(props);
        this.characterUpdated = this.characterUpdated.bind(this);
        this.onArcanumChange = this.onArcanumChange.bind(this);
        this.onGnosisChange = this.onGnosisChange.bind(this);
        this.onPathChange = this.onPathChange.bind(this);
        this.onOrderChange = this.onOrderChange.bind(this);

        let character = CharacterDb.retrieveCharacter(this.props.characterID);

        //TODO this will be moved out eventually, and if we cannot find, we throw an exception instead.
        if (!character) {
            character = createNewCharacter(this.props.characterID);
            CharacterDb.saveCharacter(character);
        }

        this.state = {
            currentCharacter: character
        };
    }

    componentDidMount() {
        this.token = CharacterDb.subscribe(this.characterUpdated);
    }

    componentWillUnmount() {
        CharacterDb.unsubscribe(this.token);
    }

    characterUpdated(character: CharacterDb.Character) {
        this.setState({ currentCharacter: character });
    }

    onArcanumChange(arcanum: Arcanum, oldDots: number, newDots: number) {
        const arcana = new Map(this.state.currentCharacter.arcanaDots);
        arcana.set(arcanum, newDots);
        CharacterDb.saveCharacter(this.state.currentCharacter, {
            arcanaDots: arcana
        });
    }

    onGnosisChange(oldGnosis: number, newGnosis: number) {
        CharacterDb.saveCharacter(this.state.currentCharacter, {
            gnosis: newGnosis
        });
    }

    onPathChange(oldOrder: string, newPath: string) {
        CharacterDb.saveCharacter(this.state.currentCharacter, {
            path: newPath
        });
    }

    onOrderChange(oldOrder: string, newOrder: string) {
        CharacterDb.saveCharacter(this.state.currentCharacter, {
            order: newOrder
        });
    }

    render() {
        const currentCharacter = this.state.currentCharacter;
        const subtitle = currentCharacter.order + " " + currentCharacter.path;
        return (
            <div>
                <Card>
                    <CardTitle title={currentCharacter.name} subtitle={subtitle} />
                    <CardText>
                        This is the character sheet, where the character's attributes are defined. Spells, Artifacts, and other equipment are not listed here.

                        <CoreAttributes
                            gnosis={currentCharacter.gnosis}
                            path={currentCharacter.path}
                            order={currentCharacter.order}
                            onGnosisChange={this.onGnosisChange}
                            onPathChange={this.onPathChange}
                            onOrderChange={this.onOrderChange}
                        />
                        <CharacterArcana
                            onArcanumChanged={this.onArcanumChange}
                            arcana={currentCharacter.arcanaDots}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}
