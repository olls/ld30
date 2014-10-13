var BLOCK = 30; 
var SPEED = .05*BLOCK;
var COLORS = {1: 0xA3ACCE, 2: 0x7805D9}; 
var P_SIZE = {top: BLOCK * .2, bottom: BLOCK * .4, height: BLOCK * .8};

var levels = [
  [
    [
      [1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 0, 1],
      [1, 0, 0, 2, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1]
    ], [
      [1, 1, 1, 1],
      [0, 0, 0, 1],
      [1, 1, 1, 1],
      [1, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 2]
    ]
  ], [
    [
      [1,0,2,1,1,1,1],
      [1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1],
      [1,0,1,0,1,0,1],
      [1,1,1,0,1,1,1]
    ], [
      [1,1,1,1,1,1,1],
      [0,0,0,0,0,0,1],
      [2,0,1,1,1,0,1],
      [1,0,1,0,1,0,1],
      [1,1,1,0,1,1,1]
    ]
  ], [
    [
      [1,0,1,0,1],
      [1,1,1,1,1],
      [0,0,0,0,1],
      [1,1,1,1,1],
      [2,0,1,0,1]
    ], [
      [1,0,1,1,1],
      [1,1,1,0,1],
      [0,0,0,0,1],
      [1,1,1,0,1],
      [2,0,1,1,1]
    ]
  ], [
    [
      [1,0,0,0,0],
      [1,1,1,1,0],
      [1,0,0,0,0],
      [1,0,2,1,1],
      [1,0,0,0,1],
      [1,1,1,1,1]
    ], [
      [1,0,0,0,1],
      [1,1,1,1,2],
      [1,0,0,0,0],
      [1,0,1,1,1],
      [1,0,0,0,1],
      [1,1,1,1,1]
    ]
  ], [
    [
      [1,1,0,2,1,1],
      [1,0,0,0,0,1],
      [1,1,1,1,0,1],
      [0,0,0,1,0,1],
      [1,1,1,1,0,1],
      [0,1,0,1,1,1]
    ], [
      [1,0,1,1,1,0],
      [1,1,1,0,1,1],
      [0,0,0,1,0,1],
      [1,1,1,1,1,1],
      [2,0,1,0,1,0]
    ]
  ], [
    [
      [1,1,1,1,1,1],
      [0,0,0,0,0,1],
      [1,1,1,1,0,1],
      [1,0,0,2,0,1],
      [1,0,0,0,0,1],
      [1,1,1,1,1,1]
    ], [
      [2,1,1,1,1,1],
      [0,0,0,0,0,1],
      [1,1,1,1,0,1],
      [1,0,1,1,0,1],
      [1,0,0,0,0,1],
      [1,1,1,1,1,1]
    ]
  ], [
    [
      [1,1,1,0,0,1],
      [1,1,1,1,0,1],
      [1,0,1,1,1,1],
      [1,1,2,0,1,1],
      [1,1,1,1,1,1],
      [1,1,1,0,1,1]
    ], [
      [1,1,1,1,0,0],
      [1,1,1,1,0,1],
      [1,0,1,1,1,1],
      [1,1,1,0,1,1],
      [1,1,1,1,1,1],
      [2,1,1,0,1,1]
    ]
  ]
];

var stop_level = false;


function main() {
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight - document.getElementById('controls').scrollHeight);
  document.getElementById('game').appendChild(renderer.domElement);
  
  var keyboard = new THREEx.KeyboardState();
  var camera = create_camera();
  var levels_list = document.getElementById('levels');

  for (var n = 0; n < levels.length; n++) {
    var a = document.createElement('a');
    
    a.onclick = (function (n) {
      return function (e) {
        stop_level = true;
        window.setTimeout(function () {
          for (var i = levels.length - 1; i >= 0; i--) {
            document.getElementById('level-'+i).classList.remove('progress');
          }
          play_level(n, scene, renderer, keyboard, camera);
        },100)
        e.preventDefault();
        return false;
      };
    })(n);
    
    a.innerHTML = n+1;
    a.setAttribute('href', '#'+n);
    a.setAttribute('id', 'level-'+n);
    levels_list.appendChild(a);
  }
  
  play_level(0, scene, renderer, keyboard, camera);
}


function play_level(n, scene, renderer, keyboard, camera) {
  keyboard.destroy();
  var keyboard = new THREEx.KeyboardState();
  
  document.getElementById('level-'+n).classList.add('progress');
  
  var objs = scene.children;
  for (var i = objs.length - 1; i >= 0; i--) {
    scene.remove(objs[i]);
  }
  
  loop(create_level(n, scene), scene, renderer, keyboard, camera);
}


function won(level, scene, renderer, keyboard, camera) {
  document.getElementById('level-'+level[0].level_n).classList.add('complete');
  
  if (level[0].level_n < levels.length - 1) {
    alert('You Won!');
    play_level(level[0].level_n+1, scene, renderer, keyboard, camera);
  } else {
    alert('You completed the game!');
  }
}


function create_camera() {
  var camera = new THREE.OrthographicCamera(
    window.innerWidth / -2, window.innerWidth / 2,
    window.innerHeight / 2, window.innerHeight / -2,
    -500, 1000
  );
  
  camera.rotation.order = 'YXZ';
  camera.rotation.y = - Math.PI / 4;
  camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );
  
  return camera;
}


function create_player(scene, start) {
  var geometry = new THREE.CylinderGeometry(P_SIZE.top, P_SIZE.bottom, P_SIZE.height, 3);
  var material = new THREE.MeshNormalMaterial();
  var player = new THREE.Mesh(geometry, material);
  
  player.position.x = start.x;
  player.position.z = start.z;
  player.position.y = start.y;
  scene.add(player);
  
  return player;
}


function create_world(scene, level_world) {
  var world = level_world.data;
  var start = level_world.start;
  var geometry = new THREE.BoxGeometry(BLOCK, 0, BLOCK);
  
  for (var x = world.length - 1; x >= 0; x--) {
    for (var z = world[x].length - 1; z >= 0; z--) {
      if (world[x][z]) {
        
        var material = new THREE.MeshBasicMaterial({color: COLORS[world[x][z]]});
        material.opacity = 0.5;
        material.transparent = true;
        
        var panel = new THREE.Mesh(geometry, material);
        panel.position.x = start.x + (x * BLOCK);
        panel.position.z = start.z + (z * BLOCK);
        panel.position.y = start.y + (-.5 * BLOCK);
        scene.add(panel);
      }
    };
  };

}


function create_level(n, scene) {
  var worlds = levels[n];
  var level = [];
  var width = 0;

  for (var i = worlds.length - 1; i >= 0; i--) {
    var start = {
      x: width * BLOCK,
      z: 0,
      y: 0
    };
    width += 1 + worlds[i].length;
    
    var level_world = {
      level_n: n,
      start: start,
      player: create_player(scene, start),
      data: worlds[i]
    };
    
    level.push(level_world);
    create_world(scene, level_world);
  }

  return level;
}


function players_at_end(level) {
  var end = 0;

  for (var i = level.length - 1; i >= 0; i--) {
    var world = level[i];
    if (2 != world.data[Math.round((-world.start.x+world.player.position.x)/BLOCK)]
                       [Math.round((-world.start.z+world.player.position.z)/BLOCK)]) {
      return false;
    }
  }

  return true;
}


function move(level, axis, dist) {
  for (var i = level.length - 1; i >= 0; i--) {
    var world = level[i];
    
    var pos = [
      Math.round((world.player.position.x+(dist*(axis=='x'))-world.start.x)/BLOCK),
      Math.round((world.player.position.z+(dist*(axis=='z'))-world.start.z)/BLOCK)
    ];

    if (0 <= pos[0] && pos[0] < world.data.length &&
        0 <= pos[1] && pos[1] < world.data[0].length &&
        world.data[pos[0]][pos[1]]) {
      world.player.position[axis] += dist;
    }

  }
}


function center_cam(camera, level) {
  var x_total = 0;
  var z_total = 0;

  for (var i = level.length - 1; i >= 0; i--) {
    x_total += level[i].player.position.x;
    z_total += level[i].player.position.z;
  }

  camera.position.x = x_total / level.length;
  camera.position.z = z_total / level.length;
}


function loop(level, scene, renderer, keyboard, camera) {
  if (stop_level) {
    stop_level = false;
  } else if (players_at_end(level)) {
    won(level, scene, renderer, keyboard, camera);
  } else {
    requestAnimationFrame(function () {loop(level, scene, renderer, keyboard, camera);});
  }
  
  if (keyboard.pressed('left')) {
    move(level, 'x', -SPEED);
  }
  if (keyboard.pressed('right')) {
    move(level, 'x', SPEED);
  }
  if (keyboard.pressed('up')) {
    move(level, 'z', -SPEED);
  }
  if (keyboard.pressed('down')) {
    move(level, 'z', SPEED);
  }

  center_cam(camera, level);
  renderer.render(scene, camera);
}


main();
