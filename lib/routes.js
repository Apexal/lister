Router.route('/', function() {
  var now = getClosestSchoolDay(moment().add(1, 'days'), "next");

  Session.set('date', now.startOf('day').toDate());
  updateDate();
  this.render('main');
});

Router.route('/:date', function() {
  var dir = (this.params.query.dir ? this.params.query.dir : "next");
  var now = getClosestSchoolDay(this.params.date, dir);

  Session.set('date', now.startOf('day').toDate());
  updateDate();
  this.render('main');
});

var getClosestSchoolDay = function(date, dir) {
  var dir = (dir == "prev" ? -1 : 1);
  var dates = Object.keys(scheduleDays).sort(function(a, b) {
    a = moment(a);
    b = moment(b);

    if(a.isBefore(b)){
      return -1;
    }else if (a.isAfter(b)){
      return 1;
    }else{
      return 0;
    }
  });
  var now = moment(date);
  var text = now.format("YYYY-MM-DD");

  if(now.isValid() == false){
    now = moment();
    text = now.format("YYYY-MM-DD");
  }

  while (isSchoolDay(text) == false) {
    now.add(dir, 'days');
    text = now.format("YYYY-MM-DD");
    console.log(text+" "+isSchoolDay(text));
  }
  return now;
}
