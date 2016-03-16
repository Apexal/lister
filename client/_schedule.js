scheduleDays = {};

Meteor.call('scheduleDays', function(error, result){
  scheduleDays = result;
});

isSchoolDay = function(date) {
  if(!scheduleDays[date]){
    return false;
  }

  return true;
}
