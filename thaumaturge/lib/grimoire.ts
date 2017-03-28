export enum Arcanum {
    Time, Space, Forces, Matter, Life,
    Fate, Spirit, Prime, Death, Mind
}

export enum Practices {
    Compelling, Knowing, Unveiling,
    Ruling, Shielding, Veiling,
    Perfecting, Fraying, Weaving,
    Patterning, Unraveling,
    Making, Unmaking,
    Dynamics,
    Entities, Excisions,
    Dominions,
    Transfiguration,
    Assumption
}

export const InitiatePractices: ReadonlyArray<Practices> = [Practices.Compelling, Practices.Knowing, Practices.Unveiling];
export const ApprenticePractices: ReadonlyArray<Practices> = [Practices.Ruling, Practices.Shielding, Practices.Veiling];
export const DisciplePractices: ReadonlyArray<Practices> = [Practices.Perfecting, Practices.Fraying, Practices.Weaving];
export const AdeptPractices: ReadonlyArray<Practices> = [Practices.Patterning, Practices.Unraveling];
export const MasterPractices: ReadonlyArray<Practices> = [Practices.Making, Practices.Unmaking];
export const SixDotPractices: ReadonlyArray<Practices> = [Practices.Dynamics];
export const SevenDotPractices: ReadonlyArray<Practices> = [Practices.Entities, Practices.Excisions];
export const EightDotPractices: ReadonlyArray<Practices> = [Practices.Dominions];
export const NineDotPractices: ReadonlyArray<Practices> = [Practices.Transfiguration];
export const TenDotPractices: ReadonlyArray<Practices> = [Practices.Assumption];

export const PracticesMap = Object.freeze(new Map<number, ReadonlyArray<Practices>>([
    [1, InitiatePractices],
    [2, ApprenticePractices],
    [3, DisciplePractices],
    [4, AdeptPractices],
    [5, MasterPractices],
    [6, SixDotPractices],
    [7, SevenDotPractices],
    [8, EightDotPractices],
    [9, NineDotPractices],
    [10, TenDotPractices]
]));

export enum CastingTimeUnit { Turn, RitualInterval }

export enum YantraRules {
    Destroyed, //Yantra must be destroyed to take effect (sacrament)
    OnlyReflexiveActions, //Can only take reflexive actions during spell's Duration (concentration)
    RitualInterval, //Takes a ritual interval to utilize the Yantra (runes)
    Rote, //Rotes do not cost Mana (mudras) -- conflicts with Praxis Situational factor
    DedicatedTool, //Dedicated Tools reduce paradox dice pool by -2
    Normal, //Nothing special aside from normal symbolism rules (everything else)
}

export interface Yantra {
    name: string;
    dieBonus: number;
    rule: YantraRules;
}

//This measures the spell factors in steps. The steps correspond
//directly to steps on the charts/rules. So a spell whose potency
//factor is set to 3 means the spell has a potency of 3. This
//interface represents dice penalty-based changes to the spellcasting
//pool, plus the primary factor. The bonus to primary factor cannot be
//calculated here, as it happens as part of spellcasting (since it's
//tied to the spellcaster's arcanum rating).
export interface SpellFactors {
    primaryFactor: "duration" | "potency";
    scale: number;
    potency: number;
    duration: number;
    ritualIntervals: number; //Technically not a factor; just included here for ease of use.
}

///How much EXTRA mana will be spent on the spell. This does not
///encode the rules for handling non-Ruling spells, praxes, and rotes.
export interface ExtraManaCosts {
    supernalPerfection: boolean; //Spells that call upon supernal perfection increase mana cost by 1 (see mana costs in book).
    paradoxReduction: number; //How much Mana is being spent to reduce the Paradox dice pool.
    extraMana: number; //Any additional Mana required by the spell.
}

export enum SituationalRules {
    IsPraxis, //Spell being cast is a praxis -- conflicts with Rote Yantra Rule.
    SleeperWitnesses, //Are there Sleepers witnessing the spell?
    Inured, //Is hte mage inured to the spell?
    SpendingWillpower, //Is the mage spending willpower on the spell?
    InGrapple //Being in a grapple is a -3 to spellcasting.
}

//Various situational factors that can affect a spellcasting. Most are
//boolean values, and thus are collected into the SituationalRules
//enum. Others are numbers or incrementable factors and are attached
//to this interface directly.
export interface SituationalFactors {
    situationalRules: Array<SituationalRules>; //Various situational rules that can come into play.
    previousParadoxRolls: number; //How many paradox rolls have occurred for the caster in this scene?
    woundPenalty: 1 | 2 | 3; //Wound penalties from health boxes being filled.
}

export interface SpellArcanumComponent {
    arcanum: Arcanum;
    dots: number;
}

export interface Spell {
    practice: Practices;
    arcana: Array<SpellArcanumComponent>;
    reach: number;
}

export interface CombinedSpell {
    spells: Array<Spell>;
}

//Collects the spell itself, yantras, and everything else into one object.
export interface SpellcastingDefinition {
    spell: Spell;
    factors: SpellFactors;
    yantras: Array<Yantra>;
    manaCosts?: ExtraManaCosts;
    situation?: SituationalFactors;
}

export class SpellCaster {
    readonly gnosis: number;
    readonly arcanaDots: Map<Arcanum, number>;
    readonly rulingArcana: Array<Arcanum>;

    constructor(gnosis: number, arcanaDots?: Map<Arcanum, number>) {
        this.gnosis = gnosis;

        if (arcanaDots) {
            this.arcanaDots = arcanaDots;
        }
    }

    listPractices(arcanum: Arcanum): ReadonlySet<Practices> {
        let dots = this.arcanaDots.get(arcanum);

        if (!dots) {
            throw new Error('Caster does not have ${arcanum}');
        }

        let practices = new Set<Practices>();
        for (let c = 1; c <= dots; c++) {
            let practicesAtDot = PracticesMap.get(c);
            if (practicesAtDot) {
                practicesAtDot.forEach(practice => practices.add(practice));
            }
            else {
                throw new Error('Something went horribly wrong...');
            }
        }

        return Object.freeze(practices);
    }

    getArcanumDots(arcanum: Arcanum): number {
        let dots = this.arcanaDots.get(arcanum);
        if (dots) {
            return dots;
        }
        else {
            return 0;
        }
    }

    get maxYantras(): number {
        let yantras = 0;
        //Divide gnosis by 2, round up.
        yantras = Math.ceil(this.gnosis / 2.0);

        //Add 1.
        yantras += 1;

        //Minimum of 2, maximum of 6.
        if (yantras < 2) yantras = 2;
        if (yantras > 6) yantras = 6;

        return 6;
    }

    get paradoxByGnosis(): number {
        return Math.ceil(this.gnosis / 2.0);
    }
}

export class SimpleSpellCasting {
    spell: Spell;
    factors: SpellFactors;
    manaCosts?: ExtraManaCosts;
    caster: SpellCaster;
    yantras: Array<Yantra>;
    situation?: SituationalFactors;

    constructor(caster: SpellCaster, definition: SpellcastingDefinition) {
        this.spell = definition.spell;
        this.factors = definition.factors;
        this.caster = caster;
        this.yantras = definition.yantras;

        if (definition.manaCosts) {
            this.manaCosts = definition.manaCosts;
        }

        if (definition.situation) {
            this.situation = definition.situation;
        }
    }

    get yantraRules(): ReadonlyArray<YantraRules> {
        let uniqueRules = new Set<YantraRules>(this.yantras.map(yantra => yantra.rule));
        return [...uniqueRules];
    }

    get yantraBonus(): number {
        return this.yantras.reduce((totalBonus, yantra) => {
            return totalBonus + yantra.dieBonus;
        }, 1);
    }

    get spellArcana(): ReadonlyArray<Arcanum> {
        return this.spell.arcana.map(arcanumComponnent => arcanumComponnent.arcanum);
    }

    get spellHighestArcanumComponent(): SpellArcanumComponent {
        let arcana = this.spell.arcana;
        return arcana.sort((a, b) => a.dots - b.dots)[arcana.length - 1];
    }

    get spellHighestArcanum(): Arcanum {
        return this.spellHighestArcanumComponent.arcanum;
    }

    get spellHighestArcanumDots(): number {
        return this.spellHighestArcanumComponent.dots;
    }

    get manaCost(): number {
        //Rotes cost 0
        if (this.hasYantraRule(YantraRules.Rote)) {
            return 0;
        }

        //Praxes cost 0
        if (this.hasSituationalRule(SituationalRules.IsPraxis)) {
            return 0;
        }

        let manaCost = 0;
        //A spell that uses any arcana outside the caster's Ruling
        //arcana costs a point of Mana.
        for (let arcanum of this.spellArcana) {
            if (this.caster.rulingArcana.indexOf(arcanum) == -1) {
                manaCost++;
                break;
            }
        }

        //Any extra mana costs.
        if (this.manaCosts) {
            if (this.manaCosts.supernalPerfection) manaCost++;
            manaCost += this.manaCosts.extraMana;
            manaCost += this.manaCosts.paradoxReduction;
        }

        return manaCost;
    }

    get dicePenalties(): number {
        let spellModifier = 0;
        spellModifier -= 2 * this.factors.duration;
        spellModifier -= 2 * this.factors.potency;
        spellModifier -= 2 * this.factors.scale;

        //Apply situational penalties.
        if (this.situation) {
            spellModifier -= this.hasSituationalRule(SituationalRules.InGrapple) ? 3 : 0;
            spellModifier -= this.situation.woundPenalty;
        }

        return spellModifier;
    }

    get freeReach(): number {
        //Every dot that meets or exceeds the highest arcanum is a free reach.
        let spellHighestArcanum = this.spellHighestArcanum;
        let spellHighestDots = this.spellHighestArcanumDots;
        let casterDots = this.caster.getArcanumDots(spellHighestArcanum);
        return (casterDots - spellHighestDots) + 1;
    }

    //This is the paradox dice pool, with everything factored in.
    //Undefined is returned if there is no pool, while 0 is returned
    //if there's a chance die.
    get paradoxDice(): number | undefined {
        let paradox = 0;
        if (this.situation) {
            if (this.hasSituationalRule(SituationalRules.SleeperWitnesses)) paradox++;
            if (this.hasSituationalRule(SituationalRules.Inured)) paradox += 2;
            paradox += this.situation.previousParadoxRolls;
        }

        let overreach = this.spell.reach - this.freeReach;
        if (overreach > 0) {
            paradox += overreach * this.caster.paradoxByGnosis;
        }

        //If we have no paradox at all, then there's no roll.
        if (paradox == 0) {
            return undefined;
        }

        //Otherwise we need to apply penalties to the pool.
        if (this.hasYantraRule(YantraRules.DedicatedTool)) {
            paradox -= 2;
        }

        if (this.manaCosts) {
            paradox -= this.manaCosts.paradoxReduction;
        }

        if (paradox < 0) {
            paradox = 0;
        }

        return paradox;
    }

    get dicePool(): number {
        let pool = this.caster.gnosis + this.caster.getArcanumDots(this.spellHighestArcanum);

        //Apply all penalties first.
        let spellModifier = this.dicePenalties;

        //Yantra bonus, after offsetting any penalties, cannot exceed 5 dice.
        this.yantras.forEach(yantra => spellModifier += yantra.dieBonus);

        if (spellModifier > 5) {
            spellModifier = 5;
        }

        //Ritual intervals are not technically a factor, but they are
        //included on that object for simplicity.
        spellModifier += this.factors.ritualIntervals;

        //Apply other bonuses (e.g. willpower)
        if (this.situation) {
            spellModifier += this.hasSituationalRule(SituationalRules.SpendingWillpower) ? 3 : 0;
        }

        return pool;
    }

    get castingTime(): [CastingTimeUnit, number] {
        return [CastingTimeUnit.Turn, 0];
    }

    hasYantraRule(rule: YantraRules): boolean {
        return this.yantraRules.indexOf(rule) != -1;
    }

    hasSituationalRule(rule: SituationalRules): boolean {
        if (this.situation) {
            return this.situation.situationalRules.indexOf(rule) != -1;
        }
        else {
            return false;
        }
    }

    validate(): true | string[] {
        let errors: string[] = [];

        //The caster needs all the dots in all the arcana of the spell.
        for (let arcanumComponent of this.spell.arcana) {
            if (this.caster.getArcanumDots(arcanumComponent.arcanum) < arcanumComponent.dots) {
                errors.push('Caster does not have enough dots in ${arcanumComponent.arcanum}. (${arcanumComponent.dots} required)');
            }
        }

        //A rote cannot be a praxis, and vice versa.
        if (this.hasSituationalRule(SituationalRules.IsPraxis)) {
            if (this.hasYantraRule(YantraRules.Rote)) {
                errors.push('A Praxis cannot be a Rote, and vice-versa.');
            }
        }

        //A dice pool that is a chance die and has a penalty of -5 is
        //too complex and cannot be cast.
        if (this.dicePool <= 0 && this.dicePenalties <= -5) {
            errors.push('A spell with a chance die dice pool and a penalty >= -5 is too complex to cast.');
        }

        //A spell's number of Yantras cannot exceed the limit defined by Gnosis.
        if (this.yantras.length > this.caster.maxYantras) {
            errors.push('The spell is using ${this.yantras.length}, but the caster can only use ${this.caster.maxYantras}');
        }

        if (errors.length == 0) {
            return true;
        }
        else {
            return errors;
        }
    }

    spellInfo(): string[] {
        let validationResult = this.validate();

        if (Array.isArray(validationResult)) {
            return validationResult;
        }

        let info: string[] = [];
        let arcana = this.spell.arcana;
        let arcanaMessage = '';

        info.push(arcana.map(component => Arcanum[component.arcanum] + ' ' + component.dots).join(', '));

        let paradox = this.paradoxDice;

        if (paradox) {
            info.push('Paradox Dice: ' + ((paradox > 0) ? paradox : 'Chance die'));
        }

        info.push('Dice Pool: ${this.dicePool}' + ((paradox) ? ' (penalized by Paradox successes)' : ''));
        info.push('Mana Cost: ' + this.manaCost);

        //Yantras
        info.push('Yantras: ' + this.yantras.map(yantra => yantra.name).join(', '));
        info.push('Yantra Rules: ' + this.yantraRules.map(rule => YantraRules[rule]).join(', '));

        return info;
    }
}

//TODO combined spellcasting
