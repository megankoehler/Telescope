// Publish a list of posts

Meteor.publish('postsList', function(terms) {
    var parameters = getPostsParameters(terms),
  if(Users.can.viewById(this.userId)){
        posts = Posts.find(parameters.find, parameters.options);

    return posts;
  }
  return [];
});

// Publish all the users that have posted the currently displayed list of posts
// plus the commenters for each post

Meteor.publish('postsListUsers', function(terms) {
    var parameters = getPostsParameters(terms),
  if(Users.can.viewById(this.userId)){
        posts = Posts.find(parameters.find, parameters.options),
        postsIds = _.pluck(posts.fetch(), '_id'),
        userIds = _.pluck(posts.fetch(), 'userId');

    // for each post, add first four commenter's userIds to userIds array
    posts.forEach(function (post) {
      userIds = userIds.concat(_.first(post.commenters,4));
    });

    userIds = _.unique(userIds);

    return Meteor.users.find({_id: {$in: userIds}}, {fields: Users.pubsub.avatarOptions, multi: true});
  }
  return [];
});
