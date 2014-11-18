/**
 * jQuery TableSearch
 *
 * Created by Pierre Rineau
 *
 * Copyright(c) 2014 Pierre Rineau
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Pieces of code comes from random comments in Stack Overflow
 * please never forget to credit their respective authors.
 */
/*jslint browser: true, devel: true, continue: true, eqeq: false, plusplus: true, todo: true, white: true, indent: 2 */
(function ($) {
  "use strict";

  // https://stackoverflow.com/a/3855394/552405
  var QueryString = (function(a) {
    if (!a) {
      return {};
    }
    var b = {}, p, i;
    for (i = 0; i < a.length; ++i) {
      p = a[i].split('=');
      if (p.length !== 2) {
        continue;
      }
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  }(window.location.search.substr(1).split('&')));

  // https://stackoverflow.com/a/498995/552405
  if (!String.prototype.trim) {
    String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
  }

  // https://stackoverflow.com/a/13820024/552405
  var getTableColumnCount = function (table) {
    var columnCount = 0, rows = table.rows, cells, i, len;
    if (rows.length > 0) {
      cells = rows[0].cells;
      for (i = 0, len = cells.length; i < len; ++i) {
        columnCount += cells[i].colSpan;
      }
    }
    return columnCount;
  };

  /**
   * Constructor.
   */
  var TableSearch = function (table, options) {
    var self = this, input;

    this.table = table;

    this.options = options || {};
    if (!this.options.name) {
      this.options.name = "search";
    }
    if (!this.options.placeholder) {
      this.options.placeholder = "Search";
    }

    // Server side code or generated HTML might already have set
    // the HTML content, case in which we don't need to prepare
    // it already.
    if (!this.options.prepared) {
      this.prepareTable();
    }
    this.input = this.table.find('input.search-query');
    this.initForm();

    if (!this.options.get) {
      this.input.typeWatch({
        wait: 300,
        callback: function (query) {
          self.search(query);
        }
      });
      this.input.keyup(function () {
        if (!self.input.val().trim()) {
          self.reset();
        }
      });
    }
  };

  /**
   * Preprend form into table head.
   */
  TableSearch.prototype.prepareTable = function () {
    var
      head = this.table.find('thead'),
      colspan = getTableColumnCount(this.table.get(0));
    if (!head) {
      head = document.createElement('thead');
      this.table.prepend(head);
    }
    // @todo ensure tbody as well
    head.prepend('<tr class="search"><th colspan="' + colspan + '"><form class="search-form" method="get"><input type="text" class="search-query"/></form></th></tr>');
  };

  /**
   * If form already exists, prepare form default values.
   */
  TableSearch.prototype.initForm = function () {
    var value, form, name;
    form = this.table.find('form.search-form');
    if (!form.attr("action")) {
      form.attr({action: window.location.href});
    }
    if (this.options.get && QueryString[this.options.name]) {
      value = QueryString[this.options.name];
    }
    // Keep other GET attributes that are being erased when submitting the form.
    for (name in QueryString) {
      if (name !== this.options.name) {
        form.append('<input type="hidden" name="' + name + '" value="' + QueryString[name] + '"/>');
      }
    }
    this.input.attr({
      name: this.options.name,
      value: value,
      placeholder: this.options.placeholder
    });
  };

  /**
   * Search into the form text.
   */
  TableSearch.prototype.search = function (query) {
    query = query.trim().toLowerCase();
    this.table.find('tbody tr').each(function () {
      // https://stackoverflow.com/a/11348383/552405
      // @todo May be we would need to seriously optimize this.
      var tr = $(this), text = $(this).clone().find("option,input").remove().end().text();
      if (-1 === text.toLowerCase().indexOf(query)) {
        tr.hide();
      } else {
        tr.show();
      }
    });
  };

  /**
   * Restore all rows to visible.
   */
  TableSearch.prototype.reset = function () {
    this.table.find('tr').each(function () {
      $(this).show();
    });
  };

  /**
   * jQuery TableSearch plugin.
   *
   * @param Object options
   *   May contain the following properties:
   *     - get - boolean : set this to true to activate for submit instead
   *       of live table search, default is false.
   *     - name - string : set this to change the search input box name and
   *       GET parameter name, default is "search".
   *     - placeholder - string : put here a localized value for the search
   *       input box placeholder, default is plain english "Search" word.
   */
  $.fn.tablesearch = function (options) {
    if (this.is('table')) {
      new TableSearch(this, options);
    }
    return this;
  };
}(jQuery));
