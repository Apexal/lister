Router.route('/', function() {
  var now = moment();

  if (now.weekday() == 0 || now.weekday() == 6) {
    while (now.weekday() == 0 || now.weekday() == 6) {
      now.add(1, "day");
    }
    Router.go("/" + now.format("YYYY-MM-DD"));
    return;
  } else {
    Session.set('date', now.startOf('day').toDate());
    this.render('main');
  }
});

Router.route('/:date', function() {
  var now = moment(this.params.date);

  if(now.isValid() == false){
    Router.go("/" + moment().format("YYYY-MM-DD"));
    return;
  }

  if (now.weekday() == 0 || now.weekday() == 6) {
    while (now.weekday() == 0 || now.weekday() == 6) {
      now.add(1, "day");
    }
    Router.go("/" + now.format("YYYY-MM-DD"));
    return;
  } else {
    Session.set('date', now.startOf('day').toDate());
    this.render('main');
  }
});
