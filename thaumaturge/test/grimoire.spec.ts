import { Practices, Arcanum, SpellCaster, PracticesMap } from '../lib/grimoire';
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
        const arcana = new Map<Arcanum, number>();
        arcana.set(Arcanum.Death, 2);
        const sc = new SpellCaster(1, arcana);

        //Need to convert to a readable array, as the Chai type definitions want it.
        const practices = sc.listPractices(Arcanum.Death) as Practices[];
        assert.lengthOf(practices, 6, 'Length of practices list is 6 (1 and 2 dot practices)');
        assert.frozen(practices, 'Practices list should be readonly (frozen)');
        assertArcana(practices, 2);
    });

    it('should listPractices correctly (multiple arcana)', () => {
        const arcana = new Map<Arcanum, number>();
        arcana.set(Arcanum.Death, 2);
        arcana.set(Arcanum.Fate, 5);
        const sc = new SpellCaster(1, arcana);

        const deathPractices = sc.listPractices(Arcanum.Death) as Practices[];
        const fatePractices = sc.listPractices(Arcanum.Fate) as Practices[];
        assertArcana(deathPractices, 2);
        assertArcana(fatePractices, 5);
    });

    it('should allow a maxmimum of 6 Yantras', () => {
        const sc = new SpellCaster(10, new Map<Arcanum, number>());
        assert.equal(sc.maxYantras, 6);
    });

    it('should allow a minimum of 2 Yantras', () => {
        const sc = new SpellCaster(1, new Map<Arcanum, number>());
        assert.equal(sc.maxYantras, 2);
    });

    it('shouldn\'t act weird with negative gnosis', () => {
        //Even though the ctor doesn't allow negative values for Gnosis,
        //hack the property value to be negative and see what happens.
        const sc = new SpellCaster(0, new Map<Arcanum, number>());
        const scAny = sc as any;
        scAny.gnosis = -1;
        assert.equal(sc.maxYantras, 2);
    });

    it('shouldn\'t allow instantiation with negative gnosis', () => {
        //The expect function expects a function instead of a new statement.
        const fn = function() {
            return new SpellCaster(-1, new Map<Arcanum, number>());
        }

        expect(fn).to.throw(Error);
    });

    it('should return 0 from an arcanum the caster doesn\'t have', () => {
        const arcana = new Map<Arcanum, number>();
        arcana.set(Arcanum.Life, 1);
        const sc = new SpellCaster(1, arcana);
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
            const sc = new SpellCaster(tableEntry[0], new Map<Arcanum, number>());
            const paradoxTableValue = tableEntry[1];
            const message = 'Gnosis ' + tableEntry[0] + ' should have ' + tableEntry[1] + ' paradox dice';
            assert.equal(sc.paradoxByGnosis, paradoxTableValue, message);
        }
    });
});

describe('SimpleSpellcasting class', () => {

});
