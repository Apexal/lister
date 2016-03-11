Router.route('/', function () {
  this.render('main');
});

Router.route('/:date', function () {
  Session.set('date', moment(this.params.date).toDate());
  this.render('main');
});
