// start slingin' some d3 here.
var gameOpts = {
  width: 800,
  height: 800,
  enemies: 30,
  padding: 20
};

var score = 0;
var bestScore = 0;

//need a player class
//player can be dragged by mouse
//player needs to detect enemy collisions
var enemiesCol = _.map(_.range(0, gameOpts.enemies), function(item, index) {
  return {
    'id': index,
    'cx': Math.random() * gameOpts.width,
    'cy': Math.random() * gameOpts.height,
    'r': getRandomInt(12, 25),
    'color': getRandomColor()
  };

});

var svg = d3.select('body')
  .append('svg')
  .attr('width', gameOpts.width)
  .attr('height', gameOpts.height);

//add enemies

var enemies = svg.selectAll('circle')
  .data(enemiesCol, function(d) {
    return d.id;
  });

enemies.enter().append('circle')
  .attr('id', function(d) {
    return d.id;
  })
  .attr('cx', function(d) {
    return d.cx;
  })
  .attr('cy', function(d) {
    return d.cy;
  })
  .attr('r', function(d) {
    return d.r;
  })
  .style('fill', function(d) {
    return d.color;
  })
  .transition().each('end', function() {
    animateEnemy(this);
  });

var animateEnemy = function(obj) {

  d3.select(obj).transition().duration(1000)
    .attr("cx", Math.random() * 800)
    .attr("cy", Math.random() * 800)
    .each("end", function() {
      animateEnemy(obj);
    });

  //if obj and player overlap 
  // then collision
  // console.dir(player);

  //distance var equal to sqrt((player x - enemy x)^2 + (player y - enemy y)^2)
  //if distance is less than the sum of the radii
  //alert collission
  //set score to 0
  // var distance = Math.sqrt(player.data.cx)
  var player = svg.select('#player');
  var enemy = d3.select(obj);

  var playerX = parseFloat(player.attr('cx'));
  var playerY = parseFloat(player.attr('cy'));
  var playerR = parseFloat(player.attr('r'));
  var enemyX = parseFloat(enemy.attr('cx'));
  var enemyY = parseFloat(enemy.attr('cy'));
  var enemyR = parseFloat(enemy.attr('r'));

  var vertical = playerY - enemyY;
  var horizontal = playerX - enemyX;

  var distance = Math.sqrt(Math.pow(vertical, 2) + Math.pow(horizontal, 2));
  console.log(distance < (enemyR+playerR));
  // if (distance < (enemyR+playerR)) {
  //   console.log('collision');
  // }
  // //debugger;
}

//add player

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  return (function(m, s, c) {
    return (c ? arguments.callee(m, s, c - 1) : '#') +
      s[m.floor(m.random() * s.length)]
  })(Math, '0123456789ABCDEF', 5)
}

var drag = d3.behavior.drag()
  .on('dragstart', function() {
    circle.style('fill', 'red');
  })
  .on('drag', function() {
    circle.attr('cx', d3.event.x)
      .attr('cy', d3.event.y);
  })
  .on('dragend', function() {
    circle.style('fill', 'black');
  });

var circle = svg.selectAll('.player')
  .data([{
    x: (gameOpts.width / 2),
    y: (gameOpts.height / 2),
    r: 25
  }])
  .enter()
  .append('svg:circle')
  .attr('id', 'player')
  .attr('class', '.playerCls')
  .attr('cx', function(d) {
    return d.x;
  })
  .attr('cy', function(d) {
    return d.y;
  })
  .attr('r', function(d) {
    return d.r;
  })
  .call(drag)
  .style('fill', 'black');