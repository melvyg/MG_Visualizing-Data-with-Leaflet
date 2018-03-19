'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A binary heap implementation. Note that in all descriptions, where we use
 * "min", it really depends on what your comparison function is. The default is
 * a min function.
 */
var Heap = function () {

  /**
   * Create a Heap.
   *
   * @param {*[]} [list] A list of initial entries into the heap
   * @param {Function} [cmp] A function to compare elements in the heap
   */
  function Heap() {
    var list = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var cmp = arguments.length <= 1 || arguments[1] === undefined ? function (a, b) {
      return a < b;
    } : arguments[1];

    _classCallCheck(this, Heap);

    this._cmp = cmp;
    this.heap = list;
    for (var i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this._heapify(i);
    }
  }

  /**
   * The number of elements in the heap
   *
   * @type {Number}
   */


  _createClass(Heap, [{
    key: 'push',


    /**
     * Insert a new element into the heap, maintaining the heap property.
     *
     * @param {*} value The value to insert
     * @returns {Number} The new size of the heap
     */
    value: function push(value) {
      var index = this.heap.push(value) - 1;
      var check = true;
      while (check) {
        var parent = this._getParent(index);
        if (parent >= 0 && this._cmp(value, this.heap[parent])) {
          this._swap(index, parent);
          index = parent;
        } else {
          check = false;
        }
      }
      return this.length;
    }

    /**
     * Gets the min value and removes it from the heap, adjusting everything else
     * in the heap to maintain heap property, then returns the value.
     *
     * @returns {*} The min value in the heap.
     */

  }, {
    key: 'pop',
    value: function pop() {
      // remove and store lowest value
      var min = this.heap.shift();
      if (typeof min === 'undefined') {
        return null;
      }
      if (this.heap.length) {
        // put the last element into the root position
        this.heap.unshift(this.heap.pop());
        this._heapify();
      }
      return min;
    }

    /**
     * Checks if the value is inside the collection
     *
     * @param {*} value The value to find
     * @returns {boolean} Whether or not the value was found in the collection
     */

  }, {
    key: 'contains',
    value: function contains(value) {
      return this.heap.indexOf(value) >= 0;
    }

    /**
     * Iteratively goes through tree, ensuring heap property is maintained,
     * correcting it if not.
     *
     * @private
     * @param {Number} i The index of what should be the largest node of a subtree
     */

  }, {
    key: '_heapify',
    value: function _heapify() {
      var _this = this;

      var i = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      // if this breaks the heap property, fix it. rinse and repeat until heap
      // property is true.
      var len = this.heap.length;
      var largest = i;
      this._getChildren(i).forEach(function (child) {
        if (child < len && _this._cmp(_this.heap[child], _this.heap[largest])) {
          largest = child;
        }
      });
      if (largest !== i) {
        this._swap(largest, i);
        this._heapify(largest);
      }
    }

    /**
     * Swaps two indexes in the heap.
     *
     * @private
     * @param {Number} a First element to swap
     * @param {Number} b Second element to swap
     */

  }, {
    key: '_swap',
    value: function _swap(a, b) {
      var _ref = [this.heap[b], this.heap[a]];
      this.heap[a] = _ref[0];
      this.heap[b] = _ref[1];
    }

    /**
     * Gets the index of the parent of the given index in the heap-array.
     *
     * @private
     * @param {Number} index  The index of the child of which to find the parent.
     * @returns {Number} the parent index
     */

  }, {
    key: '_getParent',
    value: function _getParent(index) {
      return Math.floor((index - 1) / 2);
    }

    /**
     * Gets the indexes of the children of the node at the given index.
     *
     * @private
     * @param {Number} index  The index of the parent of which to find the
     * children.
     * @returns {Number[]} an array of the children indexes
     */

  }, {
    key: '_getChildren',
    value: function _getChildren(index) {
      return [2 * index + 1, 2 * index + 2];
    }

    /**
     * Gets the min value of the heap (if your cmp function is a less-than
     * comparison).
     *
     * @returns {*} The min value
     */

  }, {
    key: 'findMin',
    value: function findMin() {
      return this.heap[0];
    }

    /**
     * Gets the max value of the heap (if your cmp function is a greater-than
     * comparison). (Functionally, identical to findMin -- included for semantic
     * reasons based on comparison function)
     *
     * @returns {*} The max value
     */

  }, {
    key: 'findMax',
    value: function findMax() {
      return this.heap[0];
    }
  }, {
    key: 'length',
    get: function get() {
      return this.heap.length;
    }
  }]);

  return Heap;
}();

exports.default = Heap;