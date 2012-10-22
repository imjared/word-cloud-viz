var list = [];
var question = [];

obtainJson = function () {

  var feed = 'http://cloud/templates/json_format.php';

  $.ajax({
    url: feed,
    async: false,
    dataType: 'json',
    success: function (json) {
      jsonFeed = json;
    }
  });

  makeArrays(jsonFeed);

};

makeArrays = function (feed) {
  _.each(feed, function(feed, index, thing) {
    var elem = _.reject(feed, function(item, index, thing, another) {
      // console.log(item);
      return item.id;
    });

    list.push(elem);
 
  });

}

var answers = [];

getAnswers = function (arrayKey) {

  var item = list[arrayKey];
  
  for (var i = 0; i < item.length; i++) {
    if (i == 0) {
      question.push(item[i]);
    }
    if (i > 0 && i < 11) {
      answers.push(item[i]);
    }
  };
  
  // console.log("question is: " + question[0]);

};

renderCloud = function (question, answers) {
  d3.layout.cloud().size([300, 300])
    .words(answers.map(function(d) {
      return {text: d, size: 10 + Math.random() * 90};
    }))
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();

function draw(words) {
  d3.select("body").append("svg")
      .attr("width", 300)
      .attr("height", 300)
    .append("g")
      .attr("transform", "translate(150,150)")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
  }
}

jQuery(document).ready(function() {

  obtainJson();

});
