var assert = require('assert');

const {calcRightSpeedRatio, calcLeftSpeedRation} = require('../arduino/cmd/direction');

describe('Arduino', function() {
  describe('direction', function() {
    it('should calc left speed for possitive values', function() {
        //given
        const x = 0.3;

        //when
        const ratio = calcLeftSpeedRation(x);

        //then
        assert.equal(ratio, 1.3);
    });

    it('should calc left speed for negative values', function() {
        //given
        const x = -0.5;

        //when
        const ratio = calcLeftSpeedRation(x);

        //then
        assert.equal(ratio, 0.5);
    });

    it('should calc right speed for possitive values', function() {
        //given
        const x = 0.3;

        //when
        const ratio = calcRightSpeedRatio(x);

        //then
        assert.equal(ratio, 0.7);
    });

    it('should calc right speed for negative values', function() {
        //given
        const x = -0.5;

        //when
        const ratio = calcRightSpeedRatio(x);

        //then
        assert.equal(ratio, 1.5);
    });
  });
});

