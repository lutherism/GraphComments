var GraphQuery,
  reqwest = require('reqwest');

GraphQuery = function GraphQuery(queries, callback) {
  reqwest({
    url: 'localhost:1337',
    method: 'GET',
    type: 'json',
    data: {
      q: JSON.stringify(queries)
    },
    success: function(data) {
      callback(null, data);
    },
    error: function(error) {
      callback(error, data);
    }
  });
};
