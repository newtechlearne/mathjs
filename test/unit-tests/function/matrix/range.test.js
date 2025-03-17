import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const range = math.range
const matrix = math.matrix
const bignumber = math.bignumber
const unit = math.unit
const evaluate = math.evaluate

describe('range', function () {
  it('should parse a valid string correctly', function () {
    assert.deepStrictEqual(range('1:6'), matrix([1, 2, 3, 4, 5]))
    assert.deepStrictEqual(range('0:2:10'), matrix([0, 2, 4, 6, 8]))
    assert.deepStrictEqual(range('5:-1:0'), matrix([5, 4, 3, 2, 1]))
    assert.deepStrictEqual(range('2:-2:-3'), matrix([2, 0, -2]))
  })

  it('should throw an error in case of invalid string', function () {
    assert.throws(function () { range('1:2:6:4') }, /is no valid range/)
    assert.throws(function () { range('1') }, /is no valid range/)
    assert.throws(function () { range('1,3:4') }, /is no valid range/)
    assert.throws(function () { range('1:2,4') }, /is no valid range/)
    assert.throws(function () { range('1:a') }, /is no valid range/)
  })

  it('should create a range start:1:end if called with 2 numbers', function () {
    assert.deepStrictEqual(range(3, 6), matrix([3, 4, 5]))
    assert.deepStrictEqual(range(1, 6), matrix([1, 2, 3, 4, 5]))
    assert.deepStrictEqual(range(1, 6.1), matrix([1, 2, 3, 4, 5, 6]))
    assert.deepStrictEqual(range(1, 5.9), matrix([1, 2, 3, 4, 5]))
    assert.deepStrictEqual(range(6, 1), matrix([]))
  })

  it('should create a range start:step:end if called with 3 numbers', function () {
    assert.deepStrictEqual(range(0, 10, 2), matrix([0, 2, 4, 6, 8]))
    assert.deepStrictEqual(range(5, 0, -1), matrix([5, 4, 3, 2, 1]))
    assert.deepStrictEqual(range(2, -4, -2), matrix([2, 0, -2]))
  })

  it('should create an empty range when step==0', function () {
    assert.deepStrictEqual(range(0, 10, 0), matrix([]))
    assert.deepStrictEqual(range(0, 10, 0, true), matrix([]))
  })

  it('should output an array when setting matrix==="array"', function () {
    const math2 = math.create({
      matrix: 'Array'
    })

    assert.deepStrictEqual(math2.range(0, 10, 2), [0, 2, 4, 6, 8])
    assert.deepStrictEqual(math2.range(5, 0, -1), [5, 4, 3, 2, 1])
  })

  it('should create a range with bigints', function () {
    assert.deepStrictEqual(range(1n, 3n), matrix([1n, 2n]))
    assert.deepStrictEqual(range(3n, 1n, -1n), matrix([3n, 2n]))
    assert.deepStrictEqual(range(1n, 3n, true), matrix([1n, 2n, 3n]))
    assert.deepStrictEqual(range(3n, 1n, -1n, true), matrix([3n, 2n, 1n]))
  })

  it('should handle mixed numbers and bigints appropriately', function () {
    assert.deepStrictEqual(range(1n, 3), matrix([1n, 2n]))
    assert.deepStrictEqual(range(3, 1n, -1n), matrix([3n, 2n]))
    assert.deepStrictEqual(range(3n, 1, -1), matrix([3n, 2n]))
    assert.deepStrictEqual(range(1, 3n, true), matrix([1n, 2n, 3n]))
    assert.deepStrictEqual(range(3n, 1, -1n, true), matrix([3n, 2n, 1n]))
    assert.deepStrictEqual(range(3, 1n, -1, true), matrix([3n, 2n, 1n]))
    assert.deepStrictEqual(range(1, 5, 2n), matrix([1, 3]))
    assert.deepStrictEqual(range(5, 1, -2n, true), matrix([5, 3, 1]))
  })

  it('should create a range with bignumbers', function () {
    assert.deepStrictEqual(range(bignumber(1), bignumber(3)), matrix([bignumber(1), bignumber(2)]))
    assert.deepStrictEqual(range(bignumber(3), bignumber(1), bignumber(-1)), matrix([bignumber(3), bignumber(2)]))
  })

  it('should create an empty range from bignumbers when step==0', function () {
    assert.deepStrictEqual(range(bignumber(0), bignumber(10), bignumber(0)), matrix([]))
    assert.deepStrictEqual(range(bignumber(0), bignumber(10), bignumber(0), true), matrix([]))
  })

  it('should create a range with mixed numbers and bignumbers', function () {
    assert.deepStrictEqual(range(bignumber(1), 3), matrix([bignumber(1), bignumber(2)]))
    assert.deepStrictEqual(range(1, bignumber(3)), matrix([bignumber(1), bignumber(2)]))

    assert.deepStrictEqual(range(1, bignumber(3), bignumber(1)), matrix([bignumber(1), bignumber(2)]))
    assert.deepStrictEqual(range(bignumber(1), 3, bignumber(1)), matrix([bignumber(1), bignumber(2)]))
    assert.deepStrictEqual(range(bignumber(1), bignumber(3), 1), matrix([bignumber(1), bignumber(2)]))

    assert.deepStrictEqual(range(bignumber(1), 3, 1), matrix([bignumber(1), bignumber(2)]))
    assert.deepStrictEqual(range(1, bignumber(3), 1), matrix([bignumber(1), bignumber(2)]))
    assert.deepStrictEqual(range(1, 3, bignumber(1)), matrix([bignumber(1), bignumber(2)]))
  })

  it('should parse a range with bignumbers', function () {
    const bigmath = math.create({ number: 'BigNumber' })
    const bignumber = bigmath.bignumber
    const matrix = bigmath.matrix
    assert.deepStrictEqual(bigmath.range('1:3'), matrix([bignumber(1), bignumber(2)]))
    assert.deepStrictEqual(bigmath.range('3:-1:0'), matrix([bignumber(3), bignumber(2), bignumber(1)]))
  })

  it('should throw an error when parsing an invalid string to a bignumber range', function () {
    const bigmath = math.create({ number: 'BigNumber' })
    assert.throws(function () { bigmath.range('1:a') }, /is no valid range/)
  })

  it('should create a range with units', function () {
    assert.deepStrictEqual(range(unit(1, 'm'), unit(3, 'm'), unit(1, 'm')), matrix([unit(1, 'm'), unit(2, 'm')]))
    assert.deepStrictEqual(range(unit(3, 'm'), unit(1, 'm'), unit(-1, 'm')), matrix([unit(3, 'm'), unit(2, 'm')]))
  })

  it('should parse a range with units', function () {
    assert.deepStrictEqual(evaluate('1m:1m:3m'), matrix([unit(1, 'm'), unit(2, 'm'), unit(3, 'm')]))
    assert.deepStrictEqual(evaluate('3m:-1m:0m'), matrix([unit(3, 'm'), unit(2, 'm'), unit(1, 'm'), unit(0, 'm')]))
    assert.deepStrictEqual(evaluate('range(1m,3m,1m)'), matrix([unit(1, 'm'), unit(2, 'm'), unit(3, 'm')]))
    assert.deepStrictEqual(evaluate('range(3m,0m,-1m)'), matrix([unit(3, 'm'), unit(2, 'm'), unit(1, 'm'), unit(0, 'm')]))
  })

  it('should gracefully handle round-off errors', function () {
    assert.deepStrictEqual(range(1, 2, 0.1, true)._size, [11])
    assert.deepStrictEqual(range(0.1, 0.2, 0.01, true)._size, [11])
    assert.deepStrictEqual(range(1, 5, 0.1)._size, [40])
    assert.deepStrictEqual(range(2, 1, -0.1, true)._size, [11])
    assert.deepStrictEqual(range(5, 1, -0.1)._size, [40])
    assert.deepStrictEqual(range(-3.2909135802469143, 3.2909135802469143, (3.2909135802469143 + 3.2909135802469143) / 10, true)._size, [11])
    assert.deepStrictEqual(range(-3.2909135802469143, 3.2909135802469143, (3.2909135802469143 + 3.2909135802469143) / 9, true)._size, [10])
    assert.deepStrictEqual(range(-3.2909135802469143, 3.2909135802469143, (3.2909135802469143 + 3.2909135802469143) / 10)._size, [10])
    assert.deepStrictEqual(range(-3.2909135802469143, 3.2909135802469143, (3.2909135802469143 + 3.2909135802469143) / 9)._size, [9])
  })

  describe('option includeEnd', function () {
    it('should parse a string and include end', function () {
      assert.deepStrictEqual(range('1:6', false), matrix([1, 2, 3, 4, 5]))
      assert.deepStrictEqual(range('1:2:6', false), matrix([1, 3, 5]))
      assert.deepStrictEqual(range('1:6', true), matrix([1, 2, 3, 4, 5, 6]))
    })

    it('should create a range start:1:end and include end', function () {
      assert.deepStrictEqual(range(3, 6, false), matrix([3, 4, 5]))
      assert.deepStrictEqual(range(3, 6, true), matrix([3, 4, 5, 6]))
    })

    it('should create a range start:step:end and include end', function () {
      assert.deepStrictEqual(range(0, 10, 2, false), matrix([0, 2, 4, 6, 8]))
      assert.deepStrictEqual(range(0, 10, 2, true), matrix([0, 2, 4, 6, 8, 10]))
    })

    it('should create a range with bignumbers and include end', function () {
      assert.deepStrictEqual(range(bignumber(1), bignumber(3), true), matrix([bignumber(1), bignumber(2), bignumber(3)]))
      assert.deepStrictEqual(range(bignumber(3), bignumber(1), bignumber(-1), true), matrix([bignumber(3), bignumber(2), bignumber(1)]))
    })

    it('should handle Fractions', function () {
      const frac = math.fraction
      assert.deepStrictEqual(
        range(frac(1, 3), frac(10, 3)),
        matrix([frac(1, 3), frac(4, 3), frac(7, 3)]))
      assert.deepStrictEqual(
        range(frac(1, 3), frac(7, 3), true),
        matrix([frac(1, 3), frac(4, 3), frac(7, 3)]))
      assert.deepStrictEqual(
        range(frac(1, 3), frac(4, 3), frac(1, 3)),
        matrix([frac(1, 3), frac(2, 3), frac(1)]))
      assert.deepStrictEqual(
        range(frac(1, 3), frac(4, 3), frac(1, 3), true),
        matrix([frac(1, 3), frac(2, 3), frac(1), frac(4, 3)]))
    })

    it('should allow mixed number and Fraction', function () {
      const frac = math.fraction
      assert.deepStrictEqual(
        range(1, frac(10, 3)),
        matrix([frac(1), frac(2), frac(3)]))
      assert.deepStrictEqual(
        range(frac(1, 3), 3, true),
        matrix([frac(1, 3), frac(4, 3), frac(7, 3), 2, frac(7, 3)]))
    })
  })
})
