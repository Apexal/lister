Meteor.startup(function () {
  ScheduleDays.remove({});

  var data = Assets.getText("scheduleDays.txt").split("\n").filter(function(p) {
    return (!!p);
  });

  if (data[0].startsWith("Start")) {
    data.splice(0, 1);
  }

  data.forEach(function(line) {
    var parts = line.split("\t").filter(function(p) {
      return (!!p);
    });

    var date = moment(parts[0], "MM/DD/YY").format("YYYY-MM-DD");
    var sd = parts[2].charAt(0);

    ScheduleDays.insert({
      date: moment(date).toDate(),
      scheduleDay: sd
    });
  });
});

Meteor.publish("assignments", function () {
  return Assignments.find({owner: this.userId});
});

Meteor.publish("scheduleDays", function () {
  return ScheduleDays.find({});
});
