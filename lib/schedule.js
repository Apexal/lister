var fs = Npm.require("fs");

scheduleDays = {};

var data = Assets.getText("scheduleDays.txt").split("\n").filter(function(p) {return (!!p);});

if(data[0].startsWith("Start")){
  data.splice(0, 1);
}

data.forEach(function(line) {
  var parts = line.split("\t").filter(function(p) {return (!!p);});

  var date = moment(parts[0], "MM/DD/YY").format("YYYY-MM-DD");
  var sd = parts[2].charAt(0);

  scheduleDays[date] = sd;
});
