Meteor.subscribe("assignments");

if (!Session.get('date')) {
  Session.set('date', moment().startOf('day').toDate());
}
document.title = "Lister - "+moment(Session.get('date')).format("dddd, MM Do YY");

var updateDate = function() {
  var newDate = moment(Session.get('date')).format("ddd, MMM Do");
  document.title = "Lister - "+newDate;
  history.pushState({}, "Lister - "+newDate, moment(Session.get('date')).format("YYYY-MM-DD"));
}

Template.day.helpers({
  currentDate: function() {
    return moment(Session.get('date')).format("dddd, MMMM Do YYYY");
  },
  incompletedCount: function() {
    //Session.get('date')
    return Assignments.find({owner: Meteor.userId(), date: moment(Session.get('date')).toDate(), completed: false}).count();
  },
  completedCount: function() {
    //Session.get('date')
    return Assignments.find({owner: Meteor.userId(), date: moment(Session.get('date')).toDate(), completed: true}).count();
  },
  assignments: function() {
    //Session.get('date')
    return Assignments.find({owner: Meteor.userId(), date: moment(Session.get('date')).toDate()});
  }
});

Template.day.events({
  "click #prev-day": function(event, template){
     Session.set('date', moment(Session.get('date')).subtract(1, 'days').toDate());
     updateDate();
  },
  "click #next-day": function(event, template){
     Session.set('date', moment(Session.get('date')).add(1, 'days').toDate());
     updateDate();
  }
});

Template.addAssignment.helpers({
  subjects: function() {
    return subjects;
  }
});

Template.addAssignment.events({
  "submit .add-assignment": function(event, template){
    event.preventDefault();

    var date = moment(Session.get('date')).toDate();
    var subject = subjects.indexOf(event.target.subject.value);
    var description = event.target.description.value;

    Meteor.call("addAssignment", date, subject, description);

    event.target.description.value = "";
  }
});

Template.assignment.helpers({
  subjects: function(id) {
    return subjects[id];
  }
});

Template.assignment.events({
  "click .toggle-completed": function(event, template){
     Meteor.call("setCompleted", this._id, !this.completed);
  },
  "click .remove-assignment": function(event, template) {
    if(confirm("Remove this assignment?"))
      Meteor.call("deleteAssignment", this._id);
  }
});
