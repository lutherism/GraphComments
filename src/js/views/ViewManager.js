var ViewManager = React.createClass({displayName: "ViewManager",
  componentDidMount: function () {
    GraphQuery(CommentView.queries.comment({limit: 15}),
      function (err, tree) {
        dispatcher.dispatchDataAction({
          type: 'tree',
          concern: 'recieve',
          data: tree
        });
      }
    );
  },
  getInitialState: function() {
    return stateFromStores();
  },
  render: function() {
    var ret = React.createElement("h2", null, "404");
    switch (this.state.path.route) {
      case 'comment':
        React.createElement(CommentView, {comment: this.state.comment})
    }
    return ret;
  },
  _onChange: function() {
    this.setState(stateFromStores());
  }
});

module.exports = ViewManager;
