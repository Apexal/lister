Meteor.subscribe("assignments");

if (!Session.get('date')) {
  Session.set('date', moment().startOf('day').toDate());
}

updateDate = function() {
  var newDate = moment(Session.get('date')).format("ddd, MMM Do");
  document.title = "Lister - " + newDate;
  history.pushState({}, "Lister - " + newDate, moment(Session.get('date')).format("YYYY-MM-DD"));
  //$('#calendar').fullCalendar('refetchEvents');
  $('#calendar').fullCalendar( 'gotoDate', moment(Session.get('date')));
}

Template.day.helpers({
  currentDate: function() {
    $('#calendar').fullCalendar('refetchEvents');
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
  noHW: function() {
    return (Assignments.find({
      owner: Meteor.userId(),
      date: moment(Session.get('date')).toDate()
    }).count() == 0);
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
    $('#calendar').fullCalendar('refetchEvents');
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
    $('#calendar').fullCalendar('refetchEvents');
  },
  "click .remove-assignment": function(event, template) {
    if (confirm("Remove this assignment?")){
      Meteor.call("deleteAssignment", this._id);
      $('#calendar').fullCalendar('refetchEvents');
    }
  }
});


Template.calendar.helpers({
  options: function() {
    return {
      id: "calendar",
      weekends: false,
      defaultView: 'month',
      dayClick: function(date, jsEvent, view) {
        // I don't know why it's one day behind
        Session.set('date', date.add(1, 'days').toDate());
        updateDate();
      },
      events: function(start, end, timezone, callback) {
        var events = [];
        var days = {};

        Assignments.find({
          owner: Meteor.userId(),
          date: {$gte: start.toDate(), $lte: end.toDate()}
        }).forEach(function(a) {
          if(!days[moment(a.date)])
            days[moment(a.date)] = {};

          if(!days[moment(a.date)][a.subject])
            days[moment(a.date)][a.subject] = [];

          days[moment(a.date)][a.subject].push(a);
        });

        for (var date in days) {
          for (var sub in days[date]) {
            events.push({
              start: date,
              allDay: true,
              title: days[date][sub].length+" "+subjects[sub]
            });
          }
        }

        callback(events);
      }
    };
  }
});
