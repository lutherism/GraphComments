var Relay,
  GraphQuery = require('graphQuery'),
  _ = require('lodash'),
  store = require('store');

Relay = {
  getQueryParams: function() {
   return this.queryParams
  },
  setQueryParams: function(newQueryParams) {
    _.map(newQueryParams, function(param, key) {
      this.queryParams[key] = param;
    });
    var queries = _.map(this.queries, function(query) {
      return query(this.queryParams);
    });
    GraphQuery(queries, function(err, tree) {
      if (err) console.error(err);
      dispatcher.dispatchDataAction({
        type: 'tree',
        concern: 'recieve',
        data: tree
      });
    });
  }
}
