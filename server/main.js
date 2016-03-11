Meteor.startup(function () {
  // code to run on server at startup
});

Meteor.publish("assignments", function () {
  return Assignments.find({owner: this.userId});
});
