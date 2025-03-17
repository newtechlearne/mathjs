iimport { factory } from '../../utils/factory.js'
import { createRange } from '../../function/matrix/range.js'

const name = 'range'
const dependencies = ['typed', 'config', '?matrix', '?bignumber', 'smaller', 'smallerEq', 'larger', 'largerEq', 'add', 'isPositive']

export const createRangeTransform = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, matrix, bignumber, smaller, smallerEq, larger, largerEq, add, isPositive }) => {
  
  // Ensure the Range data type is being used properly
  class Range {
    constructor(start, end, step = 1) {
      this.start = start;
      this.end = end;
      this.step = step;
    }

    toArray() {
      const result = [];
      for (let i = this.start; i <= this.end; i += this.step) {
        result.push(i);
      }
      return result;
    }

    toMatrix() {
      return math.matrix(this.toArray());
    }
  }

  const range = function (...args) {
    const [start, end, step = 1, includeEnd = true] = args;

    // Create a Range object
    const rangeInstance = new Range(start, end, step);

    // Adjust for includeEnd
    if (!includeEnd && rangeInstance.end === end) {
      rangeInstance.end -= rangeInstance.step;
    }

    // Return either array or matrix based on config
    if (config.isMatrix) {
      return rangeInstance.toMatrix();
    }
    
    return rangeInstance.toArray();
  };

  /**
   * Attach a transform function to math.range
   * Adds a property transform containing the transform function.
   * This transform creates a range which includes the end value.
   */
  return typed('range', {
    '...any': function (args) {
      const lastIndex = args.length - 1;
      const last = args[lastIndex];
      
      if (typeof last !== 'boolean') {
        // Append a parameter includeEnd=true
        args.push(true);
      }

      // Apply the range logic
      return range.apply(null, args);
    }
  });
}, { isTransformFunction: true });

