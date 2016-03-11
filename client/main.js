Meteor.subscribe("assignments");

if (!Session.get('date')) {
  Session.set('date', moment().startOf('day').toDate());
}

updateDate = function() {
  var newDate = moment(Session.get('date')).format("ddd, MMM Do");
  document.title = "Lister - " + newDate;
  history.pushState({}, "Lister - " + newDate, moment(Session.get('date')).format("YYYY-MM-DD"));
}

Template.day.helpers({
  currentDate: function() {
    return moment(Session.get('date')).format("dddd, MMMM Do YYYY");
  },
  incompletedCount: function() {
    return Assignments.find({
      owner: Meteor.userId(),
      date: moment(Session.get('date')).toDate(),
      completed: false
    }).count();
  },
  completedCount: function() {
    return Assignments.find({
      owner: Meteor.userId(),
      date: moment(Session.get('date')).toDate(),
      completed: true
    }).count();
  },
  totalCount: function() {
    return Assignments.find({
      owner: Meteor.userId(),
      date: moment(Session.get('date')).toDate()
    }).count();
  },
  subjectHasHW: function(subject) {
    return (Assignments.find({
      owner: Meteor.userId(),
      subject: subject,
      date: moment(Session.get('date')).toDate()
    }).count() > 0);
  },
  forSubject: function(subject) {
    return Assignments.find({
      owner: Meteor.userId(),
      subject: subject,
      date: moment(Session.get('date')).toDate()
    });
  },
  isNotWeekend: function() {
    return (moment().weekday() !== 0 && moment().weekday() !== 6);
  },
  subjects: function() {
    return subjects;
  },
  dateIs: function(is) {
    if (is == "today") {
      console.log(is);
      return moment(Session.get('date')).isSame(moment(), "day");
    } else if (is == "tomorrow") {
      var tom = moment().add(1, "days");
      while (tom.weekday() == 0 || tom.weekday() == 6) {
        tom.add(1, "day");
      }
      return moment(Session.get('date')).isSame(tom, "day");
    }
  }
});

Template.day.events({
  "click #prev-day": function(event, template) {
    var now = moment(Session.get('date')).subtract(1, "days");

    while (now.weekday() == 0 || now.weekday() == 6) {
      now.subtract(1, "day");
    }
    Session.set('date', now.toDate());
    updateDate();
  },
  "click #next-day": function(event, template) {
    var now = moment(Session.get('date')).add(1, "days");

    while (now.weekday() == 0 || now.weekday() == 6) {
      now.add(1, "day");
    }

    Session.set('date', now.toDate());
    updateDate();
  },
  "click #today": function() {
    Session.set('date', moment().startOf('day').toDate());
    updateDate();
  },
  "click #tom": function() {
    var now = moment().add(1, "days");

    while (now.weekday() == 0 || now.weekday() == 6) {
      now.add(1, "day");
    }
    Session.set('date', now.startOf('day').toDate());
    updateDate();
  }
});

Template.addAssignment.helpers({
  subjects: function() {
    return subjects;
  }
});

Template.addAssignment.events({
  "submit .add-assignment": function(event, template) {
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
  "click .toggle-completed": function(event, template) {
    Meteor.call("setCompleted", this._id, !this.completed);
  },
  "click .remove-assignment": function(event, template) {
    if (confirm("Remove this assignment?"))
      Meteor.call("deleteAssignment", this._id);
  }
});
