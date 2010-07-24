/*
---
description: Creates an instance of HtmlTable for any table with "HtmlTable" in its data-filters property.  There are additional options for sortability and selectability.
provides: [Behavior.HtmlTable]
requires: [/Behavior, More/HtmlTable.Sort, More/HtmlTable.Zebra, More/HtmlTable.Select]
script: Behavior.HtmlTable.js
...
*/
Behavior.addGlobalFilters({
	HtmlTable: function(element, events){
                var table = element;
		var selectable;
                var isSelectable = (table.hasClass('sortable') && !table.hasClass('noSelect')) || table.hasClass('selectable');
                var ht = new HtmlTable(table, {
                        sortable: table.hasClass('sortable'),
                        selectable: isSelectable,
                        allowMultiSelect: table.hasClass('allowMultiSelect'),
                        useKeyboard: false
                });
	}

});

