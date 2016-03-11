Assignments = new Mongo.Collection("assignments");

Meteor.methods({
  addAssignment: function(date, subject, description) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Assignments.insert({
      owner: Meteor.userId(),
      date: date,
      subject: subject,
      description: description,
      completed: false
    });
  },
  deleteAssignment: function(assignmentId) {
    var a = Assignments.findOne(assignmentId);
    if (a.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Assignments.remove(assignmentId);
  },
  setCompleted: function(assignmentId, newStatus) {
    var a = Assignments.findOne(assignmentId);
    if (a.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Assignments.update(assignmentId, {
      $set: {
        completed: newStatus
      }
    });
  }
});
