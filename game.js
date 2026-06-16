const world = document.getElementById('world');
const player = document.getElementById('player');
const craftWorkbench = document.getElementById('craftWorkbench');
const craftAxe = document.getElementById('craftAxe');
const craftPickaxe = document.getElementById('craftPickaxe');

// ====================
// 👤玩家資料
// ====================

const keys = {};
const inventory = document.getElementById('inventory');

let inventoryOpen = false;

const p = {
  x: 1600,
  y: 1600,
  speed: 5,
  wood: 0,
  stone: 0,

  // 🔨 工作台
  hasWorkbench: false,
  workbenchPlaced: false,

  // 🪓工具
  hasAxe: false,
  hasPickaxe: false,
};

// ====================
// 資源系統
// ====================

function createTree(x, y) {
  console.log('生成樹');

  const tree = document.createElement('div');

  tree.className = 'tree';
  tree.style.left = x + 'px';
  tree.style.top = y + 'px';

  let hp = 5;

  tree.innerHTML = `     <div class="tree-top"></div>     <div class="tree-trunk"></div>
  `;

  const hpText = document.createElement('div');

  hpText.className = 'tree-hp';
  hpText.innerText = hp;

  tree.appendChild(hpText);

  tree.appendChild(hpText);

  tree.addEventListener('click', () => {
    hp--;

    hpText.innerText = hp;

    if (hp <= 0) {
      if (p.hasAxe) {
        p.wood += 10;
      } else {
        p.wood += 5;
      }

      document.getElementById('wood').textContent = p.wood;

      updateInventory();
      tree.remove();
    }
  });

  world.appendChild(tree);
}

function createRock(x, y) {
  const rock = document.createElement('div');

  rock.className = 'rock';

  rock.style.left = x + 'px';
  rock.style.top = y + 'px';

  let hp = 8;

  rock.innerHTML = `
    <div class="rock-body"></div>
  `;

  const hpText = document.createElement('div');

  hpText.className = 'tree-hp';
  hpText.innerText = hp;

  rock.appendChild(hpText);

  rock.addEventListener('click', () => {
    hp--;

    hpText.innerText = hp;

    if (hp <= 0) {
      if (p.hasPickaxe) {
        p.stone += 6;
      } else {
        p.stone += 3;
      }

      document.getElementById('stone').textContent = p.stone;

      updateInventory();
      rock.remove();
    }
  });

  world.appendChild(rock);
}

function createWorkbench(x, y) {
  const table = document.createElement('div');

  table.className = 'workbench';

  table.style.left = x + 'px';
  table.style.top = y + 'px';

  table.innerHTML = '🔨';

  world.appendChild(table);
}

function updateInventory() {
  document.getElementById('bagWood').textContent = p.wood;

  document.getElementById('bagStone').textContent = p.stone;
}

function showMessage(text) {
  const msg = document.getElementById('message');

  msg.textContent = text;

  msg.style.opacity = 1;

  clearTimeout(msg.timer);

  msg.timer = setTimeout(() => {
    msg.style.opacity = 0;
  }, 2500);
}

// ====================
// 🔨 工作台
// ====================

craftWorkbench.addEventListener('click', () => {

  if (p.hasWorkbench) {
    showMessage('你已經有工作台了');
    return;
  }

  if (p.wood < 20) {
    showMessage('木材不足，需要20木材');
    return;
  }

  p.wood -= 20;

  document.getElementById('wood').textContent = p.wood;

  updateInventory();

  p.hasWorkbench = true;

  showMessage('🔨 工作台製作成功');

});


// ====================
// 🪓 木斧
// ====================

craftAxe.addEventListener('click', () => {

  if (!p.hasWorkbench) {
    showMessage('🔨 需要工作台');
    return;
  }

  if (p.hasAxe) {
    showMessage('🪓 已擁有木斧');
    return;
  }

  if (p.wood < 10) {
    showMessage('🪵 木材不足');
    return;
  }

  p.wood -= 10;

  document.getElementById('wood').textContent = p.wood;

  p.hasAxe = true;

  updateInventory();

  showMessage('🪓 獲得木斧');

});


// ====================
// ⛏️ 木鎬
// ====================

craftPickaxe.addEventListener('click', () => {

  if (!p.hasWorkbench) {
    showMessage('🔨 需要工作台');
    return;
  }

  if (p.hasPickaxe) {
    showMessage('⛏️ 已擁有木鎬');
    return;
  }

  if (p.wood < 5) {
    showMessage('🪵 需要5木材');
    return;
  }

  if (p.stone < 10) {
    showMessage('🪨 需要10石頭');
    return;
  }

  p.wood -= 5;
  p.stone -= 10;

  document.getElementById('wood').textContent = p.wood;
  document.getElementById('stone').textContent = p.stone;

  p.hasPickaxe = true;

  updateInventory();

  showMessage('⛏️ 獲得木鎬');

});


// ====================
// 鍵盤控制
// ====================

document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;

  // 背包
  if (e.key.toLowerCase() === 'b') {
    inventoryOpen = !inventoryOpen;

    inventory.style.display = inventoryOpen ? 'block' : 'none';
  }

  // 放置工作台
  if (e.key.toLowerCase() === 'p') {
    showMessage('P按到了');

    if (p.hasWorkbench && !p.workbenchPlaced) {
      createWorkbench(p.x, p.y);

      p.workbenchPlaced = true;

      showMessage('🔨 工作台已放置');
    }
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

// ====================
// 玩家移動
// ====================

function movePlayer() {
  let dx = 0;
  let dy = 0;

  if (keys['w']) dy--;
  if (keys['s']) dy++;
  if (keys['a']) dx--;
  if (keys['d']) dx++;

  p.x += dx * p.speed;
  p.y += dy * p.speed;

  player.style.left = p.x + 'px';
  player.style.top = p.y + 'px';
}

// ====================
// 鏡頭系統
// ====================

function updateCamera() {
  const camX = window.innerWidth / 2 - p.x;

  const camY = window.innerHeight / 2 - p.y;

  world.style.transform = `translate(${camX}px, ${camY}px)`;
}

// ====================
// 主循環
// ====================

function update() {
  movePlayer();

  updateCamera();

  requestAnimationFrame(update);
}

// ====================
// 地圖生成
// ====================

for (let i = 0; i < 60; i++) {
  createTree(Math.random() * 3000, Math.random() * 3000);
}

for (let i = 0; i < 60; i++) {
  createRock(Math.random() * 3000, Math.random() * 3000);
}

// ====================
// 遊戲啟動
// ====================
updateInventory();
update();
