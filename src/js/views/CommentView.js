var CommentView,
  React = require('react'),
  Relay = require('relay'),
  dispatcher = require('dispatcher');

CommentView = React.createClass({displayName: "CommentView",
  mixins: [Relay],
  statics: {
    queryParams: {
      sub_comments: {
        limit: 0
      }
    },
    queries: {
      comment: function(params) {
        return {
          author: true,
          text: true,
          created_at: true,
          sub_comments: {
            get: params.sub_comments,
            node: {
              author: true,
              text: true,
              created_at: true
            }
          }
        };
      }
    }
  },
  getInitialState: function() {
    return {
      reply: "",
      replyBy: "Anonymous"
    };
  },
  render: function() {
    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement("div", {className: "mytext"}), 
        React.createElement("div", {className: "reply"}, 
          React.createElement("textarea", {type: "text", onChange: this.handleReplyType}
          ), 
          React.createElement("input", {type: "text", placeholder: "Anonymous", 
            onChange: this.handleAuthorType}
          ), 
          React.createElement("div", {className: "button", onClick: this.handleSubmit}, 
            React.createElement("h2", null, "Submit")
          )
        ), 
        React.createElement("div", {className: "children"}, 
          this.props.comment.sub_comments.map(function(comment) {
            React.createElement(CommentView, {comment: comment})
          })
        ), 
        React.createElement("div", {class: "get_more", onClick: this.getMore}, 
          React.createElement("h4", null, "Get more comments...")
        )
      )
    );
  },
  handleAuthorType: function(e) {
    this.setState({
      replyBy: e.target.value
    });
  },
  handleReplyType: function(e) {
    this.setState({
      reply: e.target.value
    });
  },
  getMore: function(e) {
    this.setQueryParams({
      sub_comments: {
        limit: this.getQueryParams('sub_comments').limit + 15
      }
    });
  },
  handleSubmit: function(e) {
    dispatcher.dispatchViewAction({
      type: 'comment',
      concern: 'create',
      data: {
        parent: this.props.comment.id,
        text: this.state.reply,
        author: this.state.replyBy,
        created_at: (new Date).toTime()
      }
    });
  }
});

module.exports = CommentView;
