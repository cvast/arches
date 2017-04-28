define([
	'underscore',
	'knockout',
	'views/search/base-filter',
	'arches',
], function(_, ko, BaseFilter, arches) {
	return BaseFilter.extend({
		initialize: function(options) {
            var self = this;
            this.searchableGraphs = [];
            _.each(options.cards, function (card) {
                card.nodes = _.filter(options.nodes, function (node) {
                    return node.nodegroup_id === card.nodegroup_id;
                });
            });
            _.each(options.graphs, function (graph) {
                if (graph.isresource && graph.isactive) {
                    graph.cards = _.filter(options.cards, function (card) {
                        return card.graph_id === graph.graphid;
                    });
                    self.searchableGraphs.push(graph);
                }
            });
			this.filter = {
				advanced: ko.observableArray()
			};

			BaseFilter.prototype.initialize.call(this, options);
		},

		appendFilters: function(filterParams) {
			var filtersApplied = this.filter.advanced().length > 0;
			if (filtersApplied) {
				filterParams.advanced = ko.toJSON(this.filter.advanced);
			}
			return filtersApplied;
		},

        restoreState: function(query) {
            var doQuery = false;
            if ('advanced' in query) {
                query.advanced = JSON.parse(query.advanced);
                this.filter.advanced(query.advanced);
                doQuery = true;
            }
            return doQuery;
        },

        clear: function() {
            this.filter.advanced([]);
            return;
        }
	});
});
