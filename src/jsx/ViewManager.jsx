var ViewManager = React.createClass({
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
    var ret = <h2>404</h2>;
    switch (this.state.path.route) {
      case 'comment':
        <CommentView comment={this.state.comment} />
    }
    return ret;
  },
  _onChange: function() {
    this.setState(stateFromStores());
  }
});

module.exports = ViewManager;
