var mainGame = function(game) {
}

var game;

var wizard;
var camp;

var flyingEnemies;
var walkingEnemies;
var allEnemies;
var enemyTypes = [flyingEnemies, walkingEnemies, allEnemies]
var allSpikes;



var monsterFrameRate = 16;

var followDistance = 300 //px

var monsterVelocity = 100;

var cursors;
var characterVelocity = 200;
var characterJumpHeight = 500;
var characterFrameRate = 16;
var grid;

var greenCoin;
var blueCoin;
var yellowCoin;
var coinFrameRate = 10;
var cachedScore = 0;
var score = 0;
var health = 10;
var scoreString = '';
var scoreText;
var livesString = '';
var livesText;

var characterAlive = true;
var monsterAlive = true;

var worldGravity = 1000;
var facing = 'right';

// var monsterFacing = 'right';
// var skellyFacing = 'right';
// var mummyFacing = 'right';

var testMap;
var layer;
var layerBack;
var WebFontConfig;


mainGame.prototype = {
  create: function() {

    game = this.game;

    game.physics.startSystem(Phaser.Physics.ARCADE)


    backMap = game.add.tilemap('testBack', 32, 32);
    testMap = game.add.tilemap('testFor', 32, 32);

    backMap.addTilesetImage('mainTiles');
    testMap.addTilesetImage('mainTiles');

    testMap.setCollisionByExclusion([164], true, this.layer);


    layerBack = backMap.createLayer(0)
    layer = testMap.createLayer(0)

    layerBack.scrollFactorX = 0.5;
    layerBack.scrollFactorY = 0.5;

    // console.log(testMap.layer)
    // layer.debug = true;

    var bar = game.add.graphics();
    bar.beginFill(0x000000, .7);
    bar.drawRect(0, 530, 1000, 70);
    bar.fixedToCamera = true;
    // scoreText.cameraOffset.setTo(30, 550)

    WebFontConfig = {
        active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
        google: {
          families: ['Revalia']
        }
    };

    score = 0;

    scoreString = 'Gems : ';
    scoreText = game.add.text(30, 545, scoreString + score);
    scoreText.font = 'Revalia';
    scoreText.fontSize = 30;
    scoreText.fixedToCamera = true;
    scoreText.cameraOffset.setTo(30, 545)

    healthString = "Health : "
    healthText = game.add.text(300, 545, healthString + health);
    healthText.font = 'Revalia';
    healthText.fontSize = 30;
    healthText.fixedToCamera = true;
    healthText.cameraOffset.setTo(300, 545)

    livesString = 'Lives : ';
    livesText = game.add.text(850, 545, livesString + score);
    livesText.font = 'Revalia';
    livesText.fontSize = 30;
    livesText.fixedToCamera = true;
    livesText.cameraOffset.setTo(850, 545)

    grd = scoreText.context.createLinearGradient(0, 0, 0, scoreText.canvas.height);
    grd.addColorStop(0, 'rgb(255, 255, 255)');
    grd.addColorStop(1, '#50a6ff');
    scoreText.fill = grd;
    livesText.fill = grd;
    healthText.fill = grd;

    layer.resizeWorld();
    layerBack.resizeWorld()

    game.physics.arcade.gravity.y = worldGravity;






    wizard = game.add.sprite(50, 50, "wizard")
    game.physics.arcade.enable(wizard);

    wizard.body.collideWorldBounds = true;

    wizard.body.setSize(48, 66, 56, 45);
    wizard.isAlive = true;
    wizard.facing = "right"
    wizard.lightningJump = false;
    wizard.health = 10;
    wizard.injured = false;
    wizard.hasWon = false;

    wizard.scale.x = .8;
    wizard.scale.y = .8;
    wizard.animations.add('walkRight', [70, 71, 72, 73])
    wizard.animations.add('walkLeft', [66, 67, 68, 69])
    wizard.animations.add('elecJumpRight', [38, 39, 40, 41, 42, 43, 44, 45, 46, 47])
    wizard.animations.add('elecJumpLeft', [28, 29, 30, 31, 32, 33, 34, 35, 36, 37])
    wizard.animations.add('iceGroundRight', [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 15, 14])
    wizard.animations.add('iceGroundLeft', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 0])
    wizard.animations.add('groundSmashLeft', [3, 4, 12, 13, 1, 1, 1, 0, 0, 0])
    wizard.animations.add('groundSmashRight', [17, 18, 26, 27, 15, 15, 15, 14, 14, 14])
    wizard.animations.add('jumpRight', [78, 79, 80, 81])
    wizard.animations.add('jumpLeft', [74, 75, 76, 77])
    wizard.animations.add('dblJumpRight', [81, 79, 80])
    wizard.animations.add('dblJumpLeft', [77, 75, 76])

    wizard.animations.add('jumpRight', [78, 79, 80, 81])
    wizard.animations.add('hitLeft', [86, 87, 89, 87, 86])
    wizard.animations.add('hitRight', [82, 83, 85, 83, 82])

    game.camera.follow(wizard)

    camp = game.add.sprite(960, 300, "camp");
    camp.animations.add('burning', [0,1,2,3,4]);
    camp.animations.play("burning", 16, true);
    game.physics.arcade.enable(camp);
    camp.body.collideWorldBounds = true;
    camp.body.immovable = true;
    camp.body.setSize(32, 32, 9, 35)
    camp.body.x = 960;

    ///

    // var numberOfGroundSpikes = 1;
    var groundSpikePositions =[[640, 768]]
    var numberOfLeftSpikes = 0;
    var leftSpikePositions =[[]];
    var numberOfRightSpikes = 0;
    var rightSpikePositions =[[]];
    var numberOfTopSpikes = 0;
    var topSpikePositions = [[]];
    allSpikes = []


    for (var i=0; i<groundSpikePositions.length; i++) {
      var x = groundSpikePositions[i][0];
      var y = groundSpikePositions[i][1];
      spikes = game.add.sprite(x, y, "spikes")
      game.physics.arcade.enable(spikes);
      spikes.body.allowGravity = false;
      spikes.body.immovable = true;
      spikes.body.setSize(32, 16, 0, 16)
      spikes.frame = 0;
      spikes.key = "groundSpikes" + i.toString();
      allSpikes.push(spikes)
    }


    flyingEnemies = [];
    walkingEnemies = [];
    allEnemies = [];

    var numberOfMonsters = 1;
    var numberOfSkellys = 1;
    var numberOfMummys = 1;
    var numberOfBats = 2;

    var monsterStartPositions = [[250,320]];
    var skellyStartPositions = [[200,320]];
    var mummyStartPositions = [[300,320]]

    var monsterMovementTypes = [["wallTurn"]]
    var skellyMovementTypes = [["wallTurn"]]
    var mummyMovementTypes = [["distanceTurn", 200]]

    var batStartPositions = [[200,600],[300,600]]




    for (var i=0; i<numberOfMonsters; i++) {
      var x = monsterStartPositions[i][0];
      var y = monsterStartPositions[i][1];
      monster = game.add.sprite(x, y, "monster");
      monster.animations.add('walkLeft', [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]);
      monster.animations.add('walkRight', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
      monster.damage = 5
      monster.velocity = monsterVelocity;
      monster.frameRate = monsterFrameRate;
      monster.isAlive = true;
      monster.facing = "right"
      monster.key = "monster" + i.toString();
      monster.movementType = monsterMovementTypes[i]
      monster.startingX = x;
      allEnemies.push(monster);
      walkingEnemies.push(monster);

      game.physics.arcade.enable(monster);
      monster.body.collideWorldBounds = true;
      monster.body.setSize(37,40,2,0)
    }

    for (var i=0; i<numberOfSkellys; i++) {
      var x = skellyStartPositions[i][0];
      var y = skellyStartPositions[i][1];
      skelly = game.add.sprite(x, y, "skelly");
      skelly.scale.x = .8;
      skelly.scale.y = .8;
      skelly.animations.add('walkLeft', [12,13,14,15]);
      skelly.animations.add('walkRight', [24,25,26,27]);
      skelly.damage = 3;
      skelly.isAlive = true
      skelly.facing = "right"
      skelly.velocity = monsterVelocity;
      skelly.frameRate = 8;
      skelly.key = "skelly" + i.toString();
      skelly.movementType = skellyMovementTypes[i]
      skelly.startingX = x;
      allEnemies.push(skelly);
      walkingEnemies.push(skelly);

      game.physics.arcade.enable(skelly);
      skelly.body.collideWorldBounds = true;
      skelly.body.setSize(40,50,15,9)
    }

    for (var i=0; i<numberOfMummys; i++) {
      var x = mummyStartPositions[i][0];
      var y = mummyStartPositions[i][1];
      mummy = game.add.sprite(x, y, "mummy");
      mummy.scale.x = .9;
      mummy.scale.y = .9;
      mummy.animations.add('walkLeft', [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35]);
      mummy.animations.add('walkRight', [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34]);
      mummy.damage = 2;
      mummy.isAlive = true;
      mummy.facing = "right"
      mummy.velocity = monsterVelocity;
      mummy.frameRate = 12;
      mummy.key = "mummy" + i.toString();
      mummy.movementType = mummyMovementTypes[i]
      mummy.startingX = x;
      allEnemies.push(mummy);
      walkingEnemies.push(mummy);

      game.physics.arcade.enable(mummy);
      mummy.body.collideWorldBounds = true;
      mummy.body.setSize(30,45,7,0)

    }

    for (var i=0; i<numberOfBats; i++) {
      var x = batStartPositions[i][0];
      var y = batStartPositions[i][1];
      bat = game.add.sprite(x, y, "bat");
      bat.animations.add("flyLeft", [12, 13, 14, 15]);
      bat.animations.add('flyRight', [4, 5, 6, 7]);
      // bat.animations.play('flyLeft', 16, true)
      bat.damage = 1;
      bat.isAlive = true;
      bat.facing = "right"
      bat.velocity = monsterVelocity;
      bat.frameRate = 12;
      bat.key = "bat" + i.toString();
      allEnemies.push(bat);
      flyingEnemies.push(bat);

      game.physics.arcade.enable(bat);
      bat.body.collideWorldBounds = true;
      bat.body.allowGravity = false;
      bat.body.setSize(32,32, 0, 0)
    }

    greenCoin = game.add.sprite(350, 320, "greenCoin");
    yellowCoin = game.add.sprite(320, 320, "yellowCoin");
    blueCoin = game.add.sprite(380, 320, "blueCoin");

    greenCoin.val = 5;
    blueCoin.val = 10;
    yellowCoin.val = 15;
    greenCoin.scale.x = .7;
    greenCoin.scale.y = .7;
    yellowCoin.scale.x = .7;
    yellowCoin.scale.y = .7;
    blueCoin.scale.x = .7;
    blueCoin.scale.y = .7;

    greenCoin.animations.add('sparkle', [1,2,3,4,5,6,7,8]);
    blueCoin.animations.add('sparkle', [1,2,3,4,5,6,7,8]);
    yellowCoin.animations.add('sparkle', [1,2,3,4,5,6,7,8]);

    allEnemies.forEach(function(enemy){

    })

    game.physics.arcade.enable(greenCoin);
    game.physics.arcade.enable(blueCoin);
    game.physics.arcade.enable(yellowCoin);



    blueCoin.body.setSize(20,30,7,0)
    yellowCoin.body.setSize(20,30,7,0)
    greenCoin.body.setSize(20,30,7,0)


    cursors = game.input.keyboard.createCursorKeys();
    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);



    spacebar.onDown.add(this.jump)
    cursors.down.onDown.add(this.iceGround);
    shift.onDown.add(this.hit);

    posish = game.input.keyboard.addKey(Phaser.Keyboard.P);
    posish.onDown.add(position)


    // console.log(wizard.body.checkCollision);

  },

  update: function() {
    if (wizard.health < 0) {
      wizard.health = 0;
    }

    healthText.text = healthString + wizard.health;

    game.physics.arcade.collide(wizard, layer, null, function(){return wizard.isAlive});

    walkingEnemies.forEach(function(enemy){
      game.physics.arcade.collide(enemy, layer, null, function(){return enemy.isAlive});
    })

    game.physics.arcade.collide(camp, layer)
    game.physics.arcade.collide(wizard, camp, this.winLevel, function(){return !wizard.hasWon})

    allEnemies.forEach(function(enemy){
      game.physics.arcade.collide(wizard, enemy, monsterCollide, function(){return (wizard.isAlive && enemy.isAlive)}, this);
    })

    allSpikes.forEach(function(spk){
      game.physics.arcade.collide(wizard, spk, deathTrapCollide, function(){return (wizard.isAlive)}, this);
    })


    game.physics.arcade.collide(greenCoin, layer);
    game.physics.arcade.collide(blueCoin, layer);
    game.physics.arcade.collide(yellowCoin, layer);

    greenCoin.animations.play("sparkle", coinFrameRate, true);
    blueCoin.animations.play("sparkle", coinFrameRate-1, true);
    yellowCoin.animations.play("sparkle", coinFrameRate+1, true);


    game.physics.arcade.collide(wizard, greenCoin, this.takeCoin);
    game.physics.arcade.collide(wizard, blueCoin, this.takeCoin);
    game.physics.arcade.collide(wizard, yellowCoin, this.takeCoin);


    greenCoin.animations.play("sparkle", characterFrameRate, true);

    walkingEnemies.forEach(function(enemy){
      if (enemy.movementType[0] === "wallTurn") {
        // console.log("wallTurn")
        if (enemy.body.onWall()) {
          if (enemy.facing === "right") {
            enemy.facing = "left";
          } else {
            enemy.facing = "right"
          }
        }

        if (enemy.facing === 'right') {
          enemy.animations.play("walkRight", enemy.frameRate, true);
          enemy.body.velocity.x = enemy.velocity;
        } else if (enemy.facing === 'left') {
          enemy.animations.play("walkLeft", enemy.frameRate, true);
          enemy.body.velocity.x = -enemy.velocity;
        }

      } else if (enemy.movementType[0] === "distanceTurn") {
        // console.log("distanceTurn")
        var leftBound = enemy.startingX - enemy.movementType[1];
        var rightBound = enemy.startingX + enemy.movementType[1];
        if (enemy.body.x > rightBound || enemy.body.x < leftBound) {
          if (enemy.facing === "right") {
            enemy.facing = "left";
          } else {
            enemy.facing = "right"
          }
        }
        if (enemy.body.onWall()) {
          if (enemy.facing === "right") {
            enemy.facing = "left";
          } else {
            enemy.facing = "right"
          }
        }

        if (enemy.facing === 'right') {
          enemy.animations.play("walkRight", enemy.frameRate, true);
          enemy.body.velocity.x = enemy.velocity;
        } else if (enemy.facing === 'left') {
          enemy.animations.play("walkLeft", enemy.frameRate, true);
          enemy.body.velocity.x = -enemy.velocity;
        }
      }


    })


    flyingEnemies.forEach(function(enemy){
      if (enemy.facing !== "dead") {
        var xDis = Math.abs(enemy.body.x - wizard.body.x)
        var yDis = Math.abs(enemy.body.y - wizard.body.y)

        if (xDis < followDistance  && yDis < followDistance) {
          // console.log(xDis, yDis)
          if (enemy.body.x > wizard.body.x) {
            enemy.animations.play("flyLeft", enemy.frameRate, true);//.delay = 45;
            enemy.body.velocity.x = -enemy.velocity;
          } else if (bat.body.x < wizard.body.x){
            enemy.animations.play("flyRight", enemy.frameRate, true);//.delay = 45;
            enemy.body.velocity.x = enemy.velocity;
          } else {
            enemy.body.velocity.x = 0;
          }

          if (enemy.body.y > wizard.body.y + 1) {
            enemy.body.velocity.y = -enemy.velocity;
          } else if (enemy.body.y < wizard.body.y - 1) {
            enemy.body.velocity.y = enemy.velocity;
          } else {
            enemy.body.velocity.y = 0;
          }
        } else {
          enemy.body.velocity.y = 0;
          enemy.body.velocity.x = 0;
        }
      } else {
        enemy.frame = 1
      }
    })



    if (wizard.body.onFloor() && wizard.facing !== "hitRight" && wizard.facing !== "hitLeft" && wizard.facing !== "dead") {
      if (wizard.facing === "electricDownwardRight") {
        wizard.facing = "iceGroundRight"
        wizard.body.velocity.x = 0;
        wizard.animations.play("groundSmashRight", characterFrameRate +20 , false);
        wizard.animations.currentAnim.onComplete.add(function () {
          wizard.facing = "right";
        }, this);
      } else if (wizard.facing === "electricDownwardLeft") {
        wizard.facing = "iceGroundLeft"
        wizard.body.velocity.x = 0;
        wizard.animations.play("groundSmashLeft", characterFrameRate + 20, false);
        wizard.animations.currentAnim.onComplete.add(function () {
          wizard.facing = "left";
        }, this);
      } else if (wizard.facing === "dblJumpRight") {
        wizard.body.velocity.x = 0;
        wizard.facing = "right";
      } else if (wizard.facing === "dblJumpLeft") {
        wizard.body.velocity.x = 0;
        wizard.facing = "right";
      }

      if (cursors.right.isDown) {
        wizard.facing = 'right'
        wizard.body.velocity.x = characterVelocity;
        wizard.animations.play("walkRight", characterFrameRate, true)
      } else if (cursors.left.isDown) {
        wizard.facing = 'left'
        wizard.body.velocity.x = -characterVelocity;
        wizard.animations.play("walkLeft", characterFrameRate, true)
      } else {
        if (wizard.facing !== "iceGroundLeft" && wizard.facing !== "iceGroundRight") {
          wizard.animations.stop();
          wizard.body.velocity.x = 0;
          if (wizard.facing === 'right') {
            wizard.frame = 81;
          } else {
            wizard.frame = 77;
          }
        }
      }
    } else if (wizard.facing !== "dead") {
      if (wizard.facing !== "electricRight" && wizard.facing !== "electricLeft" && wizard.facing !== "electricDownwardRight" && wizard.facing !== "electricDownwardLeft") {
        if (wizard.facing === "right") {
          wizard.frame = 80;
        } else if (wizard.facing === "left") {
          wizard.frame = 76;
        }
        if (cursors.right.isDown) {
          if (wizard.facing === 'right' || wizard.facing === "left") {
            wizard.facing = 'right'
          }
          wizard.body.velocity.x = characterVelocity;
        } else if (cursors.left.isDown) {
          if (wizard.facing === 'right' || wizard.facing === "left") {
            wizard.facing = 'left'
          }
          wizard.body.velocity.x = -characterVelocity;
        } else {
          if (wizard.body.onFloor()) {
            wizard.body.velocity.x = 0;
          }
        }
      } else {
        if (cursors.right.isDown) {
          wizard.body.velocity.x = characterVelocity;
        } else if (cursors.left.isDown) {
          wizard.body.velocity.x = -characterVelocity;
        }
      }
    } else {
      wizard.frame = 1;
    }
    var bottomCollisionCheck = ((wizard.facing === "electricDownwardLeft" || wizard.facing === "electricDownwardRight") && wizard.lightningJump && !wizard.body.onFloor())
    if (bottomCollisionCheck) {
      allEnemies.forEach(function(enemy){
        var hitTest0 = enemy.body.hitTest(wizard.body.x, wizard.body.y+64)
        var hitTest1 = enemy.body.hitTest(wizard.body.x+25, wizard.body.y+64)
        var hitTest2 = enemy.body.hitTest(wizard.body.x+15, wizard.body.y+64)
        var hitTest3 = enemy.body.hitTest(wizard.body.x+35, wizard.body.y+64)

        if (hitTest0 || hitTest1 || hitTest2 || hitTest3){
          console.log("enemy hit")
          enemy.facing = "dead"
          enemy.isAlive = false;
          enemy.body.allowGravity = true;
          console.log(enemy.isAlive)
          enemy.body.velocity.y = -500
          enemy.body.gravity.y = 2000
          enemy.body.velocity.x = 0
          enemy.body.collideWorldBounds = false;
          enemy.checkWorldBounds = true;
          enemy.outOfBoundsKill = true;
          enemy.frame = 1;

        }
      })



      // }

      ///// downward Collision Debug //

      // var dot = game.add.graphics(0, 0)
      // dot.beginFill(0xFF0000, 1)
      // dot.drawRect(wizard.body.x+25, wizard.body.y+64, 2, 2)
      // dot.drawRect(wizard.body.x+35, wizard.body.y+64, 2, 2)
      // dot.drawRect(wizard.body.x+15, wizard.body.y+64, 2, 2)
      // dot.drawRect(wizard.body.x, wizard.body.y+64, 2, 2)
      // dot.endFill()

      /////
    }

    var electricCollisionRight = (wizard.facing === "electricRight")
    if (electricCollisionRight) {

      allEnemies.forEach(function(enemy){
        var hitTest0 = enemy.body.hitTest(wizard.body.x+38, wizard.body.y+80)
        var hitTest1 = enemy.body.hitTest(wizard.body.x+38, wizard.body.y+50)
        var hitTest2 = enemy.body.hitTest(wizard.body.x+38, wizard.body.y+20)
        var hitTest3 = enemy.body.hitTest(wizard.body.x+38, wizard.body.y-10)

        if (hitTest0 || hitTest1 || hitTest2 || hitTest3) {
          console.log("enemy hit")
          enemy.facing = "dead"
          enemy.isAlive = false;
          enemy.body.allowGravity = true
          console.log(enemy.isAlive)
          enemy.body.velocity.y = -500
          enemy.body.gravity.y = 2000
          enemy.body.velocity.x = 0
          enemy.body.collideWorldBounds = false;
          enemy.checkWorldBounds = true;
          enemy.outOfBoundsKill = true;
          enemy.frame = 1;

        }
      });

      ///// electric Collision Debug //

      // var dot = game.add.graphics(0, 0)
      // dot.beginFill(0xFF0000, 1)
      // dot.drawRect(wizard.body.x+38, wizard.body.y+80, 2, 2)
      // dot.drawRect(wizard.body.x+38, wizard.body.y+50, 2, 2)
      // dot.drawRect(wizard.body.x+38, wizard.body.y+20, 2, 2)
      // dot.drawRect(wizard.body.x+38, wizard.body.y-10, 2, 2)
      // dot.endFill()

    }

    var electricCollisionLeft = (wizard.facing === "electricLeft")
    if (electricCollisionLeft) {

      allEnemies.forEach(function(enemy){
        var hitTest0 = enemy.body.hitTest(wizard.body.x-2, wizard.body.y+80)
        var hitTest1 = enemy.body.hitTest(wizard.body.x-2, wizard.body.y+50)
        var hitTest2 = enemy.body.hitTest(wizard.body.x-2, wizard.body.y+20)
        var hitTest3 = enemy.body.hitTest(wizard.body.x-2, wizard.body.y-10)

        if (hitTest0 || hitTest1 || hitTest2 || hitTest3) {
          console.log("enemy hit")
          enemy.facing = "dead"
          enemy.isAlive = false;
          enemy.body.allowGravity = true;
          console.log(enemy.isAlive)
          enemy.body.velocity.y = -500
          enemy.body.gravity.y = 2000
          enemy.body.velocity.x = 0
          enemy.body.collideWorldBounds = false;
          enemy.checkWorldBounds = true;
          enemy.outOfBoundsKill = true;
          enemy.frame = 1;

        }
      });

      ///// electric Collision Debug //

      // var dot = game.add.graphics(0, 0)
      // dot.beginFill(0xFF0000, 1)
      // dot.drawRect(wizard.body.x-2, wizard.body.y+80, 2, 2)
      // dot.drawRect(wizard.body.x-2, wizard.body.y+50, 2, 2)
      // dot.drawRect(wizard.body.x-2, wizard.body.y+20, 2, 2)
      // dot.drawRect(wizard.body.x-2, wizard.body.y-10, 2, 2)
      // dot.endFill()

    }




    var iceGroundCollision = (wizard.facing === "iceGroundLeft" || wizard.facing === "iceGroundRight")
    if (iceGroundCollision) {

      allEnemies.forEach(function(enemy){
        var hitTest0 = enemy.body.hitTest(wizard.body.x-35, wizard.body.y+40)
        var hitTest1 = enemy.body.hitTest(wizard.body.x+44, wizard.body.y+40)
        var hitTest2 = enemy.body.hitTest(wizard.body.x-15, wizard.body.y+40)
        var hitTest3 = enemy.body.hitTest(wizard.body.x+64, wizard.body.y+40)

        if (hitTest0 || hitTest1 || hitTest2 || hitTest3) {
          console.log("enemy hit")
          enemy.facing = "dead"
          enemy.isAlive = false;
          enemy.body.allowGravity = true;
          console.log(enemy.isAlive)
          enemy.body.velocity.y = -500
          enemy.body.gravity.y = 2000
          enemy.body.velocity.x = 0
          enemy.body.collideWorldBounds = false;
          enemy.checkWorldBounds = true;
          enemy.outOfBoundsKill = true;
          enemy.frame = 1;
        }
      });

      ///// iceGround Collision Debug //

      // var dot = game.add.graphics(0, 0)
      // dot.beginFill(0xFF0000, 1)
      // dot.drawRect(wizard.body.x+44, wizard.body.y+40, 2, 2)
      // dot.drawRect(wizard.body.x+64, wizard.body.y+40, 2, 2)
      // dot.drawRect(wizard.body.x-15, wizard.body.y+40, 2, 2)
      // dot.drawRect(wizard.body.x-35, wizard.body.y+40, 2, 2)
      // dot.endFill()

    }

  },

  winLevel: function(_wizard, _camp) {
    _wizard.hasWon = true;
    _camp.tint = 0x00F0FF
    setTimeout(function(){
      game.state.start("mainMenu")
    }, 1000)
    console.log("you win!")
  },

  takeCoin: function(player, coin) {
      score += coin.val;
      coin.kill();
      scoreText.text = scoreString + score;
  },

  jump: function() {
    console.log(wizard.body.velocity.y)
    if (wizard.body.onFloor()) {
      if (wizard.facing === 'left') {
        wizard.animations.play("jumpLeft", characterFrameRate, false)

      } else if (wizard.facing === 'right') {
        wizard.animations.play("jumpRight", characterFrameRate, false)
      }
      wizard.body.velocity.y = -characterJumpHeight;
    } else {
      if (wizard.lightningJump) {
        if (wizard.facing === 'left') {
          wizard.facing = "electricLeft"
          wizard.animations.play("elecJumpLeft", characterFrameRate, false)
          wizard.body.velocity.y = -(100+characterJumpHeight);
          wizard.animations.currentAnim.onComplete.add(function () {
            wizard.facing = "electricDownwardLeft";
          }, this);
        } else if (wizard.facing === 'right') {
          wizard.facing = "electricRight"
          wizard.animations.play("elecJumpRight", characterFrameRate, false)
          wizard.body.velocity.y = -(100 + characterJumpHeight);
          wizard.animations.currentAnim.onComplete.add(function () {
            wizard.facing = "electricDownwardRight";
          }, this);
        }

      } else {
        if (wizard.facing === 'left') {
          wizard.facing = "dblJumpLeft"
          wizard.animations.play("dblJumpLeft", characterFrameRate, false)
          wizard.body.velocity.y = -characterJumpHeight;

        } else if (wizard.facing === 'right') {
          wizard.facing = "dblJumpRight"
          wizard.animations.play("dblJumpRight", characterFrameRate, false)
          wizard.body.velocity.y = -characterJumpHeight;
        }

        wizard.lightningJump = true;
      }
    }
    // if (wizard.body.velocity.y  >= 0) {
    //   wizard.body.velocity.y = 1000;
    // }
  },

  iceGround: function() {
    if (wizard.body.onFloor()) {
      if (wizard.facing === 'left') {
        wizard.facing = "iceGroundLeft"
        wizard.body.velocity.x = 0;
        wizard.animations.play("iceGroundLeft", characterFrameRate, false)
        wizard.animations.currentAnim.onComplete.add(function () {
          wizard.facing = "left";
        }, this);

      } else if (wizard.facing === 'right') {
        wizard.facing = "iceGroundRight"
        wizard.body.velocity.x = 0;
        wizard.animations.play("iceGroundRight", characterFrameRate, false)
        wizard.animations.currentAnim.onComplete.add(function () {
          wizard.facing = "right";
        }, this);

      }
    }

  },

  hit: function() {
    if (wizard.facing === "right") {
      wizard.facing = "hitRight"
      // debug for hits //
      // console.log(wizard.body.x)
      // var dot = game.add.graphics(0, 0)
      // dot.beginFill(0xFF0000, 1)
      // dot.drawRect(wizard.body.x+64, wizard.body.y+33, 5, 5)
      // dot.endFill()
      ///

      allEnemies.forEach(function(enemy) {

        // monster.facing = "dead";
        if (enemy.body.hitTest(wizard.body.x+64, wizard.body.y+33)){
          console.log("enemy hit")
          enemy.facing = "dead"
          enemy.isAlive = false;
          enemy.body.allowGravity = true;
          console.log(enemy.isAlive)
          enemy.body.velocity.y = -500
          enemy.body.gravity.y = 2000
          enemy.body.velocity.x = 0
          enemy.body.collideWorldBounds = false;
          enemy.checkWorldBounds = true;
          enemy.outOfBoundsKill = true;
          enemy.frame = 1;

        }
      })
      wizard.animations.play("hitRight", characterFrameRate, false)

      wizard.animations.currentAnim.onComplete.add(function () {
        wizard.facing = "right";
      }, this);
    } else if (wizard.facing === "left") {
      wizard.facing = "hitLeft"

      //// hit debug ///

      // var dot = game.add.graphics(0, 0)
      // dot.beginFill(0xFF0000, 1)
      // dot.drawRect(wizard.body.x-26, wizard.body.y+33, 5, 5)
      // dot.endFill()

      /////

      console.log(mummy.body.hitTest(wizard.body.x-26, wizard.body.y+33))
      wizard.animations.play("hitLeft", characterFrameRate, false)

      wizard.animations.currentAnim.onComplete.add(function () {

        wizard.facing = "left";
      }, this);
    }

  },

  render: function() {
    // game.debug.body(wizard)
    // game.debug.layer(layer);
    // game.debug.body(skelly)
    // game.debug.body(monster)
    // game.debug.body(mummy)
    // game.debug.body(bat)
    // game.debug.body(spikes)
    // game.debug.body(camp)

    // game.debug.body(yellowCoin)
    // game.debug.body(blueCoin)
    // game.debug.body(greenCoin)

  }
}

function monsterCollide(_wizard, _monster) {
    if (wizard.health <= 0) {
      _wizard.facing = "dead";
      _wizard.frame = 1;

      _wizard.isAlive = false;
      _wizard.body.velocity.y = -500
      _wizard.body.gravity.y = 2000
      _wizard.body.velocity.x = 0
      _wizard.body.collideWorldBounds = false;
      _wizard.checkWorldBounds = true;
      _wizard.outOfBoundsKill = true;
    } else if (!_wizard.injured) {
      _wizard.injured = true;
      _wizard.health -= _monster.damage;
      setTimeout(function(){
        _wizard.injured = false
      }, 300)
    }


}


function deathTrapCollide(_wizard, _spikes) {
  _wizard.facing = "dead";
  _wizard.frame = 1;
  _wizard.health = 0;
  _wizard.isAlive = false;
  _wizard.body.velocity.y = -500
  _wizard.body.gravity.y = 2000
  _wizard.body.velocity.x = 0
  _wizard.body.collideWorldBounds = false;
  _wizard.checkWorldBounds = true;
  _wizard.outOfBoundsKill = true;
}

function position() {
  console.log(wizard.body.x, wizard.body.y)
}
