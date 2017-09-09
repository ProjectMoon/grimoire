import { EventEmitter, EventSubscription } from 'fbemitter';
import { Arcanum } from 'thaumaturge';

const emitter = new EventEmitter();

export interface Character {
    id: number;
    name: string;
    order: string;
    path: string;
    arcanaDots: Map<Arcanum, number>;
    rulingArcana: Array<Arcanum>;
    gnosis: number;
}

export type CharacterUpdatedHandler = (character: Character) => void;

export function subscribe(handler: CharacterUpdatedHandler): EventSubscription {
    return emitter.addListener('update', handler);
}

export function unsubscribe(token: EventSubscription) {
    token.remove();
}

export function retrieveCharacter(id: number) {
    let character = localStorage["character:" + id + ":main"];

    if (character) {
        let arcana = localStorage["character:" + id + ":arcana"];
        const parsed = JSON.parse(character);
        parsed.arcanaDots = new Map(JSON.parse(arcana));
        console.log(parsed.arcanaDots);
        return parsed;
    }
    else {
        return undefined;
    }
}

export function saveCharacter(character: Character, updatedProperties?: any) {
    const updated = Object.assign({}, character, updatedProperties);

    //cannot JSON stringify a Map, so currently save it separately.
    let arcanaKey = "character:" + updated.id + ":arcana";
    let characterKey = "character:" + updated.id + ":main";
    let arcana = [...character.arcanaDots];
    localStorage[characterKey] = JSON.stringify(updated);
    localStorage[arcanaKey] = JSON.stringify(arcana);
    emitter.emit('update', updated);
}
