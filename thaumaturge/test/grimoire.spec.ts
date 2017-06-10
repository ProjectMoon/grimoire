import {
    Practices, Arcanum, SpellCaster, PracticesMap, SpellCasterBuilder,
    SituationalRules, SituationalFactors, SpellcastingDefinition,
    SpellFactors, Spell, Yantra, YantraRules, SimpleSpellCasting
} from '../lib/grimoire';
import 'mocha';
import { assert, expect } from 'chai';

describe('SpellCaster class', () => {
    function assertArcana(practicesReturned: Practices[], arcanaDots: number) {
        let practices: Practices[] = [];

        for (let c = 1; c <= arcanaDots; c++) {
            const practicesAtDot = PracticesMap.get(c);

            if (practicesAtDot) {
                practices = practices.concat(practicesAtDot as Practices[]);
            }
        }

        for (let practice of practices) {
            assert.include(practicesReturned, practice);
        }
    }

    it('should listPractices correctly (single arcanum)', () => {
        const sc = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Death, 2)
            .withRulingArcana(Arcanum.Death, Arcanum.Matter)
            .build();

        //Need to convert to a readable array, as the Chai type definitions want it.
        const practices = sc.listPractices(Arcanum.Death) as Practices[];
        assert.lengthOf(practices, 6, 'Length of practices list is 6 (1 and 2 dot practices)');
        assert.frozen(practices, 'Practices list should be readonly (frozen)');
        assertArcana(practices, 2);
    });

    it('should listPractices correctly (multiple arcana)', () => {
        const sc = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Death, 2)
            .withArcanum(Arcanum.Fate, 5)
            .withRulingArcana(Arcanum.Death, Arcanum.Matter)
            .build();

        const deathPractices = sc.listPractices(Arcanum.Death) as Practices[];
        const fatePractices = sc.listPractices(Arcanum.Fate) as Practices[];
        assertArcana(deathPractices, 2);
        assertArcana(fatePractices, 5);
    });

    it('should allow a maxmimum of 6 Yantras', () => {
        const sc = new SpellCaster(10, [], new Map<Arcanum, number>());
        assert.equal(sc.maxYantras, 6);
    });

    it('should allow a minimum of 2 Yantras', () => {
        const sc = new SpellCaster(1, [], new Map<Arcanum, number>());
        assert.equal(sc.maxYantras, 2);
    });

    it('shouldn\'t act weird with negative gnosis', () => {
        //Even though the ctor doesn't allow negative values for Gnosis,
        //hack the property value to be negative and see what happens.
        const sc = new SpellCaster(0, [], new Map<Arcanum, number>());
        const scAny = sc as any;
        scAny.gnosis = -1;
        assert.equal(sc.maxYantras, 2);
    });

    it('shouldn\'t allow instantiation with negative gnosis', () => {
        //The expect function expects a function instead of a new statement.
        const fn = function() {
            return new SpellCaster(-1, [], new Map<Arcanum, number>());
        }

        expect(fn).to.throw(Error);
    });

    it('should return 0 from an arcanum the caster doesn\'t have', () => {
        const sc = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 1)
            .build();

        const dots = sc.getArcanumDots(Arcanum.Death);
        assert.equal(dots, 0);
    });

    it('should respect the paradox by gnosis table', () => {
        const paradoxByGnosis = new Map<number, number>();
        paradoxByGnosis.set(1, 1);
        paradoxByGnosis.set(2, 1);
        paradoxByGnosis.set(3, 2);
        paradoxByGnosis.set(4, 2);
        paradoxByGnosis.set(5, 3);
        paradoxByGnosis.set(6, 3);
        paradoxByGnosis.set(7, 4);
        paradoxByGnosis.set(8, 4);
        paradoxByGnosis.set(9, 5);
        paradoxByGnosis.set(10, 5);

        for (let tableEntry of paradoxByGnosis) {
            const sc = new SpellCaster(tableEntry[0], [], new Map<Arcanum, number>());
            const paradoxTableValue = tableEntry[1];
            const message = 'Gnosis ' + tableEntry[0] + ' should have ' + tableEntry[1] + ' paradox dice';
            assert.equal(sc.paradoxByGnosis, paradoxTableValue, message);
        }
    });
});

function defaultLifeSpell(...yantras: Yantra[]): SpellcastingDefinition {
    return defaultSpellWithArcanum(Arcanum.Life, 1, ...yantras);
}

function defaultSpellWithArcanum(arcanum: Arcanum, dots: number, ...yantras: Yantra[]): SpellcastingDefinition {
    const factors: SpellFactors = {
        primaryFactor: "potency",
        scale: 1,
        potency: 1,
        duration: 1,
        ritualIntervals: 1
    };

    const spell: Spell = {
        practice: Practices.Compelling,
        arcana: [{ arcanum: arcanum, dots: dots }],
        reach: 0
    };

    const definition: SpellcastingDefinition = {
        spell: spell,
        factors: factors,
        yantras: yantras
    };

    return definition;
}

function conjunctionalSpell(...arcanaAndDots: [Arcanum, number][]): SpellcastingDefinition {
    const factors: SpellFactors = {
        primaryFactor: "potency",
        scale: 1,
        potency: 1,
        duration: 1,
        ritualIntervals: 1
    };

    const spell: Spell = {
        practice: Practices.Compelling,
        arcana: [],
        reach: 0
    };

    for (const arcanumAndDots of arcanaAndDots) {
        spell.arcana.push({ arcanum: arcanumAndDots[0], dots: arcanumAndDots[1] });
    }

    const definition: SpellcastingDefinition = {
        spell: spell,
        factors: factors,
        yantras: []
    };

    return definition;
}

describe('SimpleSpellcasting class', () => {
    it('should not unique-ify yantra rule sets', () => {
        const sacrament: Yantra = {
            name: 'Bread',
            dieBonus: 1,
            rule: YantraRules.Destroyed
        };

        const sacrament2: Yantra = {
            name: 'Extra special sacrament',
            dieBonus: 2,
            rule: YantraRules.Destroyed
        };

        const def = defaultLifeSpell(sacrament, sacrament2);
        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 1)
            .build();

        const casting = new SimpleSpellCasting(caster, def);
        assert.lengthOf(casting.yantraRules, 2);
        assert.equal(casting.yantraRules[0], YantraRules.Destroyed);
        assert.equal(casting.yantraRules[1], YantraRules.Destroyed);
    });

    it('should give a yantra bonus of 0 with no yantras', () => {
        const def = defaultLifeSpell();
        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 1)
            .build();

        const casting = new SimpleSpellCasting(caster, def);
        assert.equal(casting.yantraBonus, 0);
    });

    it('should calculate yantra bonuses properly', () => {
        const sacrament: Yantra = {
            name: 'Bread',
            dieBonus: 1,
            rule: YantraRules.Destroyed
        };

        const patronTool: Yantra = {
            name: 'Seer Patron Tool',
            dieBonus: 2,
            rule: YantraRules.Normal
        };

        const dedicatedTool: Yantra = {
            name: 'Bongo Drums',
            dieBonus: 1,
            rule: YantraRules.Normal
        };

        const def = defaultLifeSpell(sacrament, patronTool, dedicatedTool);
        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 1)
            .build();

        const casting = new SimpleSpellCasting(caster, def);
        assert.equal(casting.yantraBonus, 4);
    });

    it('should calculate yantra bonuses properly with different yantras of the same type', () => {
        const sacrament: Yantra = {
            name: 'Bread',
            dieBonus: 1,
            rule: YantraRules.Destroyed
        };

        const sacrament2: Yantra = {
            name: 'Extra special sacrament',
            dieBonus: 2,
            rule: YantraRules.Destroyed
        };

        const dedicatedTool: Yantra = {
            name: 'Bongo Drums',
            dieBonus: 1,
            rule: YantraRules.DedicatedTool
        };

        const def = defaultLifeSpell(sacrament, sacrament2, dedicatedTool);
        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 1)
            .build();

        const casting = new SimpleSpellCasting(caster, def);
        assert.equal(casting.yantraBonus, 4);
    });

    it('a spell with conjunctional arcana should record both', () => {
        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 2)
            .withArcanum(Arcanum.Fate, 1)
            .withRulingArcana(Arcanum.Death, Arcanum.Matter)
            .build();

        const def = conjunctionalSpell([Arcanum.Life, 2], [Arcanum.Fate, 1]);
        const casting = new SimpleSpellCasting(caster, def);

        assert.lengthOf(casting.spellArcana, 2);
        assert.include(casting.spellArcana as Arcanum[], Arcanum.Life);
        assert.include(casting.spellArcana as Arcanum[], Arcanum.Fate);
        assert.equal(casting.spellHighestArcanum, Arcanum.Life);
    });

    it('should allow multiple dedicated tools to reduce paradox (e.g. soul stone)', () => {
        const soulStone: Yantra = {
            name: 'Soul stone',
            dieBonus: 0,
            rule: YantraRules.DedicatedTool
        };

        const dedicatedTool: Yantra = {
            name: 'Bongo Drums',
            dieBonus: 1,
            rule: YantraRules.DedicatedTool
        };

        //This definition will have 4 paradox dice (inured +2, previous rolls +2)
        const def = defaultLifeSpell(soulStone, dedicatedTool);
        def.situation = {
            previousParadoxRolls: 2,
            woundPenalty: 0,
            situationalRules: [SituationalRules.Inured]
        };

        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 1)
            .build();

        const casting = new SimpleSpellCasting(caster, def);
        assert.equal(casting.paradoxDice, 0);
    });
});

describe('SimpleSpellcasting mana tests', () => {
    it('a rote from non-ruling Arcanum should have 0 mana base cost', () => {
        const mudras: Yantra = {
            name: 'Rote mudras',
            dieBonus: 4,
            rule: YantraRules.Rote
        };

        const def = defaultLifeSpell(mudras);
        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 1)
            .withRulingArcana(Arcanum.Death)
            .build();
        const casting = new SimpleSpellCasting(caster, def);
        assert.equal(casting.manaCost, 0);
    });

    it('a praxis from a non-ruling arcanum should have 0 mana base cost', () => {
        const mudras: Yantra = {
            name: 'Tool',
            dieBonus: 1,
            rule: YantraRules.Normal
        };

        let def = defaultLifeSpell(mudras);
        def.situation = {
            situationalRules: [SituationalRules.IsPraxis],
            previousParadoxRolls: 0,
            woundPenalty: 0
        };

        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 1)
            .withRulingArcana(Arcanum.Death)
            .build();
        const casting = new SimpleSpellCasting(caster, def);
        assert.equal(casting.manaCost, 0);
    });

    it('a rote with extra mana costs should have a cost', () => {
        const mudras: Yantra = {
            name: 'Rote mudras',
            dieBonus: 4,
            rule: YantraRules.Rote
        };

        const def = defaultLifeSpell(mudras);
        def.manaCosts = {
            paradoxReduction: 1,
            supernalPerfection: true,
            extraMana: 1
        };

        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 1)
            .build();

        const casting = new SimpleSpellCasting(caster, def);
        assert.equal(casting.manaCost, 3);
    });

    it('a non-ruling arcanum improvised spell should have a base cost of 1 mana', () => {
        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 1)
            .withRulingArcana(Arcanum.Death, Arcanum.Matter)
            .build();

        let def = defaultLifeSpell();
        const casting = new SimpleSpellCasting(caster, def);
        assert.equal(casting.manaCost, 1);
    });

    it('a spell with multiple non-ruling arcana should cost 1 mana', () => {
        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 2)
            .withArcanum(Arcanum.Fate, 1)
            .withRulingArcana(Arcanum.Death, Arcanum.Matter)
            .build();

        const def = conjunctionalSpell([Arcanum.Life, 2], [Arcanum.Fate, 1]);
        const casting = new SimpleSpellCasting(caster, def);
        assert.equal(casting.manaCost, 1);
    });

    it('a spell calling on supernal perfection costs 1 mana extra', () => {
        //Test a non-ruling spell that calls on supernal reflection.
        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 2)
            .withArcanum(Arcanum.Fate, 1)
            .withRulingArcana(Arcanum.Death, Arcanum.Matter)
            .build();

        let def = defaultSpellWithArcanum(Arcanum.Fate, 1);
        def.manaCosts = {
            supernalPerfection: true,
            extraMana: 0,
            paradoxReduction: 0
        };

        const casting = new SimpleSpellCasting(caster, def);
        assert.equal(casting.manaCost, 2);
    });

    it('should factor in paradox reduction and extra mana costs', () => {
        //Test a non-ruling spell with extra mana costs for the spell
        //itself and paradox reduction.
        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 2)
            .withArcanum(Arcanum.Fate, 1)
            .withRulingArcana(Arcanum.Death, Arcanum.Matter)
            .build();

        let def = defaultSpellWithArcanum(Arcanum.Fate, 1);
        def.manaCosts = {
            supernalPerfection: false,
            extraMana: 5,
            paradoxReduction: 5
        };

        const casting = new SimpleSpellCasting(caster, def);
        assert.equal(casting.manaCost, 11);
    });
});

describe('SimpleSpellCasting dice penalties', () => {
    //Create a default spell and overwrite its spell factors, then assert
    //that the penalty is as expected
    function checkDicePenalties(factors: SpellFactors, expectedPenalty: number) {
        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 2)
            .withArcanum(Arcanum.Fate, 1)
            .withRulingArcana(Arcanum.Death, Arcanum.Matter)
            .build();

        let def = defaultSpellWithArcanum(Arcanum.Fate, 1);
        def.factors = factors;

        const casting = new SimpleSpellCasting(caster, def);
        assert.equal(casting.dicePenalties, expectedPenalty);
    }

    it('should apply spell potency factor penalties properly', () => {
        const factors: SpellFactors = {
            primaryFactor: "potency",
            potency: 1,
            duration: 0,
            scale: 0,
            ritualIntervals: 0
        };

        checkDicePenalties(factors, -2);
        factors.potency++;
        checkDicePenalties(factors, -4);
    });

    it('should apply duration spell factor penalties properly', () => {
        const factors: SpellFactors = {
            primaryFactor: "potency",
            potency: 0,
            duration: 1,
            scale: 0,
            ritualIntervals: 0
        };

        checkDicePenalties(factors, -2);
        factors.duration++;
        checkDicePenalties(factors, -4);
    });

    it('should apply scale spell factor penalties properly', () => {
        const factors: SpellFactors = {
            primaryFactor: "potency",
            potency: 0,
            duration: 0,
            scale: 1,
            ritualIntervals: 0
        };

        checkDicePenalties(factors, -2);
        factors.scale++;
        checkDicePenalties(factors, -4);
    });

    it('should apply multiple spell factor penalties properly', () => {
        const factors: SpellFactors = {
            primaryFactor: "potency",
            potency: 1,
            duration: 1,
            scale: 1,
            ritualIntervals: 0
        };

        checkDicePenalties(factors, -6);
        factors.duration++;
        factors.potency++;
        factors.scale++;
        checkDicePenalties(factors, -12);
    });
});

describe('Spellcasting integration test', () => {
    it('should do something', () => {
        const caster = new SpellCasterBuilder()
            .withGnosis(1)
            .withArcanum(Arcanum.Life, 1)
            .withRulingArcanum(Arcanum.Life)
            .build();

        const def = defaultSpellWithArcanum(Arcanum.Life, 1);

        const casting = new SimpleSpellCasting(caster, def);
    });
});
