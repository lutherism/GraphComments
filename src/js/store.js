var dispatcher = require('dispatcher'),
  Store = {
    _nodes: {},
    _localNodes: {},
    numCallbacks: 0,
    _callbacks: {
    },
    getNode: function(id) {
      return this._nodes[id] || this.getLocalNode(id);
    },
    getLocalNode: function(id) {
      return this._localNodes[id];
    }
    onEmit: function(callback) {
      this._callbacks[this.numCallbacks++] = callback;
      return this.numCallbacks-1;
    },
    off: function(emitID) {
      delete this._callbacks[emitID];
    },
    addNode: function(node) {
      this._nodes[node.id] = node;
    },
    addLocalNode: function(node) {
      this._localNodes[node.id] = node;
    },
    updateNode: function(id, node) {
      if (this.hasNode(id)) {
        this._nodes[id] = _.extend({},
          this._nodes[id], node);
      } else {
        this._localNodes[id] = _.extend({},
          this._localNodes[id], node);
      }
    },
    removeNode: function(node) {
      if (typeof node === 'string') {
        node = {id:node};
      }
      delete this._nodes[node.id];
    },
    removeLocalNode: function(node) {
      if (typeof node === 'string') {
        node = {id:node};
      }
      delete this._localNodes[node.id];
    }
    hasNode: function(id) {
      return !(this._nodes[id] === void(0));
    },
    emitChange: function() {
      _.map(this._callbacks, function(callback) {
        callback();
      });
    }
  },
  viewActionHandlers: {
    comment: function(action) {
      if (concern === 'create') {
        Store.addLocalNode(action.data);
        reqwest({
          url: 'localhost:1337',
          method: 'POST',
          data: action.data,
          success: function(data) {
            Store.addNode(data);
            Store.removeLocalNode(data);
            Store.emitChange();
          },
          error: function(error) {
            Store.updateNode(action.data.id, {
              error: error
            });
            Store.emitChange();
          }
        });
        Store.emitChange();
      }
    }
  },
  dataActionHandlers: {
    recieve: function(action) {
      _.map(action.data, function(node) {
        Store.addNode(node);
      });
      Store.emitChange();
    }
  }

Store.dispatchId = dispatcher.register(function(payload) {
  if (payload.source === dispatcher.constants.VIEW_SOURCE) {
    viewActionHandlers[payload.action.type](payload.action);
  } else if (payload.source === dispatcher.constants.DATA_SOURCE) {
    dataActionHandlers[payload.action.type](payload.action);
  }
})
