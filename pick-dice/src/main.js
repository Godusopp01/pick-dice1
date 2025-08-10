import { Game } from './game.js';
import { UI } from './ui.js';
import { loadSettings, saveSettings } from './storage.js';
import { decide } from './ai.js';

const ui = new UI();

// ค่าเริ่มต้น
let settings = loadSettings() || {
  players: ['Player 1', 'Player 2'],
  target: 100,
  mode: 'pvp',
  aiLevel: 'medium'
};

let game = new Game(settings);
init();

function init() {
  ui.bind({
    onNew: handleNew,
    onRoll: handleRoll,
    onHold: handleHold,
    onOpenSettings: function () {
      ui.applySettings(settings);
      ui.openSettings();
    },
    onSaveSettings: handleSaveSettings
  });

  ui.applySettings(settings);
  renderAll('Start Game! Player 1 Turn');
  ui.setActive(game.active);
  ui.setButtons({ disabled: false });
}

function handleNew() {
  game = new Game(settings);
  renderAll('Start Game! Player 1 Turn');
  ui.setButtons({ disabled: false });
}

async function handleRoll() {
  ui.setButtons({ disabled: true });
  const result = game.roll();
  const value = result.value;
  const busted = result.busted;

  await ui.animateDice(value);

  if (!busted) {
    const cur = getCurrentFor(game.active) + value;
    setCurrent(game.active, cur);
    ui.setStatus('You Got ' + value + '! Roll or Hold ?');
  } else {
    clearCurrents();
    ui.setStatus('Got 1! Lose Your Score Player 2 Turn ' + playerName(game.active) + ' 😵', 'bad');
  }

  ui.setActive(game.active);
  ui.setButtons({ disabled: false });

  if (game.isAITurn()) {
    await aiTurn();
  }
}

async function handleHold() {
  const preActive = game.active;
  const didWin = game.hold();
  setTotal(preActive, game.totals[preActive]);
  clearCurrents();

  if (didWin.won) {
    ui.setStatus(playerName(preActive) + ' Win ' + game.totals[preActive] + ' 🎉', 'good');
    ui.setButtons({ disabled: true });
    return;
  }

  ui.setActive(game.active);
  ui.setStatus('Collect Your Score '  + playerName(game.active) + ' Turn');

  if (game.isAITurn()) {
    await aiTurn();
  }
}

function renderAll(statusText) {
  setTotal(0, game.totals[0]);
  setTotal(1, game.totals[1]);
  clearCurrents();
  ui.setActive(game.active);
  ui.setStatus(statusText);
}

function setTotal(i, v) {
  const el = document.getElementById(i === 0 ? 'p0-total' : 'p1-total');
  if (el) el.textContent = v;
}

function setCurrent(i, v) {
  const el = document.getElementById(i === 0 ? 'p0-current' : 'p1-current');
  if (el) el.textContent = v;
}

function getCurrentFor(i) {
  const el = document.getElementById(i === 0 ? 'p0-current' : 'p1-current');
  return el ? Number(el.textContent) || 0 : 0;
}

function clearCurrents() {
  setCurrent(0, 0);
  setCurrent(1, 0);
}

function playerName(i) {
  return i === 0 ? settings.players[0] : settings.players[1];
}

function handleSaveSettings() {
  const form = document.getElementById('setting-form');
  const mode = Array.from(form.elements['mode']).find(r => r.checked).value;

  settings = {
    players: [
      document.getElementById('in-p1').value.trim() || 'ผู้เล่น 1',
      document.getElementById('in-p2').value.trim() || (mode === 'cpu' ? 'คอมพิวเตอร์' : 'ผู้เล่น 2'),
    ],
    target: Number(document.getElementById('in-target').value) || 100,
    mode: mode,
    aiLevel: document.getElementById('in-ai').value
  };

  saveSettings(settings);
  document.getElementById('setting').close();

  game = new Game(settings);

  ui.applySettings(settings);
  renderAll('อัปเดตการตั้งค่าแล้ว! เริ่มเกมใหม่');
  ui.setButtons({ disabled: false });

  if (game.isAITurn()) {
    aiTurn();
  }
}


async function aiTurn() {
  ui.setStatus('🤖 ' + playerName(1) + ' กำลังคิด...');
  ui.setButtons({ disabled: true });

  while (game.isAITurn() && game.inProgress) {
    await sleep(600);
    const decision = decide({
      level: settings.aiLevel,
      currentTurnScore: getCurrentFor(1),
      myTotal: game.totals[1],
      oppTotal: game.totals[0],
      target: game.target
    });

    if (decision === 'roll') {
      const result = game.roll();
      const value = result.value;
      const busted = result.busted;

      await ui.animateDice(value);
      if (busted) {
        clearCurrents();
        ui.setStatus('🤖 ได้ 1! เปลี่ยนเป็นตาของคุณ', 'bad');
        break;
      } else {
        setCurrent(1, getCurrentFor(1) + value);
        ui.setStatus('🤖 ได้ ' + value + ' (สะสมตานี้ ' + getCurrentFor(1) + ')');
      }
    } else {
      const didWin = game.hold();
      setTotal(1, game.totals[1]);
      clearCurrents();

      if (didWin.won) {
        ui.setStatus('🤖 ' + playerName(1) + ' ชนะด้วยคะแนน ' + game.totals[1] + ' 🎉', 'bad');
        break;
      } else {
        ui.setStatus('ถึงตาของคุณแล้ว!');
        break;
      }
    }
  }

  ui.setActive(game.active);
  if (game.inProgress) ui.setButtons({ disabled: false });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
