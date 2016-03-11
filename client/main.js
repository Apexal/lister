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

    var subject = subjects.indexOf(event.target.subject.value);
    var description = event.target.description.value;
    var date = moment(Session.get('date')).toDate();

    Assignments.insert({
      owner: Meteor.userId(),
      date: date,
      subject: subject,
      description: description,
      completed: false,
      addedAt: new Date(),
    });

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
     Assignments.update(this._id, {
       $set: {completed: !this.completed}
     });
  },
  "click .remove-assignment": function(event, template) {
    if(confirm("Remove this assignment?"))
      Assignments.remove(this._id);
  }
});
