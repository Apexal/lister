Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', function() {
  var now = getClosestSchoolDay(moment().add(1, 'days'), "next");

  Session.set('date', now.startOf('day').toDate());
  updateDate();
});

Router.route('/:date', function() {
  var dir = (this.params.query.dir ? this.params.query.dir : "next");
  var now = getClosestSchoolDay(this.params.date, dir);

  Session.set('date', now.startOf('day').toDate());
  updateDate();
});

var getClosestSchoolDay = function(date, dir) {
  var dir = (dir == "prev" ? -1 : 1);
  var now = moment(date);
  var text = now.format("YYYY-MM-DD");

  day = ScheduleDays.findOne({date: {$lte: now.toDate()}}, {sort: {date: -1}});

  if(dir == 1){
    day = ScheduleDays.findOne({date: {$gte: now.toDate()}}, {sort: {date: 1}});
  }

  if(day){
    now = moment(day.date);
  }

  return now;
}
