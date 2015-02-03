var CommentView,
  React = require('react'),
  Relay = require('relay'),
  dispatcher = require('dispatcher');

CommentView = React.createClass({
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
      <div className="comment">
        <div className="mytext"></div>
        <div className="reply">
          <textarea type="text" onChange={this.handleReplyType}>
          </textarea>
          <input type="text" placeholder="Anonymous"
            onChange={this.handleAuthorType}>
          </input>
          <div className="button" onClick={this.handleSubmit}>
            <h2>Submit</h2>
          </div>
        </div>
        <div className="children">
          {this.props.comment.sub_comments.map(function(comment) {
            <CommentView comment={comment} />
          })}
        </div>
        <div class="get_more" onClick={this.getMore}>
          <h4>Get more comments...</h4>
        </div>
      </div>
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
