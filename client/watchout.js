// start slingin' some d3 here.
var gameOpts = {
  width: 800,
  height: 800,
  enemies: 30,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
};


var enemiesCol = _.map(_.range(0, gameOpts.enemies), function(item, index) {
  return {
    'id': 'enemy-' + index,
    'cx': Math.random() * gameOpts.width,
    'cy': Math.random() * gameOpts.height,
    'r': 0,
    'color': getRandomColor()
  };

});

var svg = d3.select('body')
  .append('svg')
  .attr('width', gameOpts.width)
  .attr('height', gameOpts.height);

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
  });

enemies.exit()
  .remove();

function animate() {
  enemies.transition()
    .duration(500)
    .attr('r', getRandomInt(12, 20))
    .transition()
    .duration(2000)
    .tween('custom', function(endData) {

      var enemy = d3.select(this);

      var startPos = {
        x: parseFloat(enemy.attr('cx')),
        y: parseFloat(enemy.attr('cy'))
      };

      var endPos = {
        x: Math.random() * 800,
        y: Math.random() * 800
      };

      return function(t) {
        checkCollisions(enemy)

        var enemyNextPos = {
          x: startPos.x + (endPos.x - startPos.x) * t,
          y: startPos.y + (endPos.y - startPos.y) * t
        };

        enemy.attr('cx', enemyNextPos.x)
          .attr('cy', enemyNextPos.y);

      };
    });
}

setInterval(animate, 2000);

var updateScore = function() {
    d3.select('.currentInput')
      .text(gameStats.score.toString())

    d3.select('.highscoreInput')
      .text(gameStats.bestScore.toString());

    d3.select('.collisionsInput')
      .text(gameStats.collisions.toString());

  }

var checkCollisions = function(enemy) {

    //var enemy = d3.select(this);
    var player = svg.select('#player');

    var playerX = parseFloat(player.attr('cx'));
    var playerY = parseFloat(player.attr('cy'));
    var playerR = parseFloat(player.attr('r'));
    var enemyX = parseFloat(enemy.attr('cx'));
    var enemyY = parseFloat(enemy.attr('cy'));
    var enemyR = parseFloat(enemy.attr('r'));

    var vertical = playerY - enemyY;
    var horizontal = playerX - enemyX;

    var distance = Math.sqrt(Math.pow(vertical, 2) + Math.pow(horizontal, 2));

    if (distance < (enemyR + playerR)) {
      gameStats.collisions++;
      console.log('collision')
      if (gameStats.score > gameStats.bestScore) {
        gameStats.bestScore = gameStats.score;
      }
      gameStats.score = 0;
    } else {
      gameStats.score++;
    }
    updateScore();

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