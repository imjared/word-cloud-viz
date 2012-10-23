var list = [];
var question = [];
var answers = [];

obtainJson = function () {

  var feed = 'http://cloud/word-cloud-viz/templates/feed.json';

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

  renderQuestions(list);

}

renderQuestions = function (list) {
  var questionList = [];

  list.forEach( function (item, index) {
    $('#questions-cont').append('<a href="#" data-index="' + index + '">' + item[0] + '</a>')
  });

  $('#questions-cont a').on('click', function(e) {
    e.preventDefault();
    $('a').each(function(){
      $(this).removeClass('active');
    });
    var $this = $(this);
    $this.addClass('active');
    var arrayKey = $this.attr('data-index');
    getAnswers(arrayKey);
  });

};

getAnswers = function (arrayKey) {

  question = [];
  answers = [];

  var item = list[arrayKey];
  
  for (var i = 0; i < item.length; i++) {
    if (i == 0) {
      question.push(item[i]);
    }
    if (i > 0 && i < 11) {
      answers.push(item[i]);
    }
  };

  renderCloud(question[0], answers);

};

renderCloud = function (question, answers) {

  var dimension = 300;

  if ($('body svg').length > 0 ) {
    $('svg').fadeOut(300);
    $('svg').not(':last').remove();
  }

  d3.layout.cloud().size([dimension, dimension])
    .words(answers.map(function(d) {
      return {text: d, size: 10 + Math.random() * 50};
    }))
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();

function draw(words) {
  

  d3.select("#svg-cont").append("svg")
      .attr("width", dimension)
      .attr("height", dimension)
    .append("g")
      .attr("transform", "translate(150,150)")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("color", "blue")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
  }

  cycleColors();
}

function cycleColors () {
    $('svg text').each(function(){
      $(this).css('color', 'red');
    });
}

jQuery(document).ready(function() {

  obtainJson();

});
