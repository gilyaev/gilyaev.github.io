'use strict'
var sortTable = (function (global) {

    var SORT_DIRECTION_ASC = 'ASC';
    var SORT_DIRECTION_DESC = 'DESC';

    function Tablesort(element, options) {
        if (!(this instanceof Tablesort)) return new Tablesort(element, options);

        if (!element || element.nodeName !== 'TABLE') {
            return Error('Element should be table');
        }

        options = options || {};
        this.init(element, options)
    }

    Tablesort.prototype.init = function (element, options) {
        var that = this;
        this.table = element;
        this.desc_class = options.desc_class || 'sort-desc';
        this.asc_class = options.asc_class || 'sort-asc';
        this.direction = global.localStorage.getItem('sort_direction') || SORT_DIRECTION_ASC;
        this.index = global.localStorage.getItem('sort_index') || 0;

        element.addEventListener('click', function (e) {
            var target = e.target,
                tr,
                nodes;

            if (target.nodeName === 'TH') {
                tr = target.parentNode;
                nodes = tr.cells;
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i] === target) {
                        that.index = i;
                    } else {
                        that.updateClassName(nodes[i], true);
                    }
                }
                if (target.className.indexOf(that.desc_class) !== -1) {
                    that.direction = SORT_DIRECTION_ASC;
                } else {
                    that.direction = SORT_DIRECTION_DESC;
                }

                that.updateClassName(target)
                that.doSorting();
            }
        });


        if (this.index !== null) {
            this.doSorting();
            this.updateClassName(this.table.querySelectorAll('th')[this.index]);
        }
    }

    Tablesort.prototype.updateClassName = function (element, reset = false) {
        if (reset) {
            var regexp = new RegExp(this.asc_class + '|' + this.desc_class, "g");
            element.className = element.className.replace(regexp, '')
            return;
        }

        regexp = this.direction === SORT_DIRECTION_ASC ? this.desc_class : this.asc_class;
        var direction_class = this.direction === SORT_DIRECTION_ASC ? this.asc_class : this.desc_class;
        regexp = new RegExp(" ?" + regexp + " ?", "g");
        element.className = element.className.replace(regexp, '') + ' ' + direction_class;
    }

    Tablesort.prototype.doSorting = function () {
        var original_tbody = this.table.tBodies[0];
        var clone_tbody = original_tbody.cloneNode();
        var rows = [].slice.call(original_tbody.cloneNode(true).rows, 0);
        var reverse = (this.direction === SORT_DIRECTION_DESC);
        var index = this.index;

        rows.sort(function (a, b) {
            var c;
            a = a.cells[index].innerText.replace(/[$\s-]/g, '');
            b = b.cells[index].innerText.replace(/[$\s-]/g, '');
            if (reverse) {
                c = a;
                a = b;
                b = c;
            }
            return isNaN(a - b) ? a.localeCompare(b) : a - b;
        });

        for (var i in rows) {
            clone_tbody.appendChild(rows[i]);
        }
        this.table.replaceChild(clone_tbody, original_tbody);


        global.localStorage.setItem('sort_index', index);
        global.localStorage.setItem('sort_direction', this.direction);
    }
    return Tablesort;
})(window);