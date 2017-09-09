import { Arcanum } from 'thaumaturge';

export interface Character {
    id: number;
    name: string;
    order: string;
    path: string;
    arcanaDots: Map<Arcanum, number>;
    rulingArcana: Array<Arcanum>;
    gnosis: number;
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

export function saveCharacter(character: Character) {
    //cannot JSON stringify a Map, so currently save it separately.
    let arcanaKey = "character:" + character.id + ":arcana";
    let characterKey = "character:" + character.id + ":main";
    let arcana = [...character.arcanaDots];
    localStorage[characterKey] = JSON.stringify(character);
    localStorage[arcanaKey] = JSON.stringify(arcana);
}
