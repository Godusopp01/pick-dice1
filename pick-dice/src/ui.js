// src/ui.js
import { $, $$, delay } from './utils.js';

export class UI {
  constructor() {
    this.dom = {
      p0: $('[data-player="0"]'),
      p1: $('[data-player="1"]'),
      p0Total: $('#p0-total'),
      p1Total: $('#p1-total'),
      p0Current: $('#p0-current'),
      p1Current: $('#p1-current'),
      p0Name: $('#p0-name'),
      p1Name: $('#p1-name'),
      dice: $('#dice'),
      status: $('#status'),
      btnNew: $('#btn-new'),
      btnRoll: $('#btn-roll'),
      btnHold: $('#btn-hold'),
      dlg: $('#setting'),
      form: $('#settings-form'),
      inP1: $('#in-p1'),
      inP2: $('#in-p2'),
      inTarget: $('#in-target'),
      inAI: $('#in-ai'),
      btnOpenSettings: $('#btn-open-setting'),
    };
  }

  bind({ onNew, onRoll, onHold, onOpenSettings, onSaveSettings }) {
    if (this.dom.btnNew) this.dom.btnNew.addEventListener('click', onNew);
    if (this.dom.btnRoll) this.dom.btnRoll.addEventListener('click', onRoll);
    if (this.dom.btnHold) this.dom.btnHold.addEventListener('click', onHold);
    if (this.dom.btnOpenSettings) this.dom.btnOpenSettings.addEventListener('click', onOpenSettings);

    if (this.dom.form) {
      this.dom.form.addEventListener('submit', function (e) {
        e.preventDefault();
        onSaveSettings();
      });
      const cancelBtn = this.dom.form.querySelector('[value="cancel"]');
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.dom.dlg && this.dom.dlg.close());
    }
  }

  applySettings({ players, target, mode, aiLevel }) {
    if (this.dom.p0Name) this.dom.p0Name.textContent = players[0];
    if (this.dom.p1Name) this.dom.p1Name.textContent = players[1];
    if (this.dom.inP1) this.dom.inP1.value = players[0];
    if (this.dom.inP2) this.dom.inP2.value = players[1];
    if (this.dom.inTarget) this.dom.inTarget.value = String(target);
    if (this.dom.inAI) this.dom.inAI.value = aiLevel;

    const aiRow = this.dom.form ? this.dom.form.querySelector('.ai-only') : null;
    const modeValue = mode;
    if (aiRow) aiRow.classList.toggle('show', modeValue === 'cpu');

    if (this.dom.form && this.dom.form.elements && this.dom.form.elements['mode']) {
      const radios = Array.prototype.slice.call(this.dom.form.elements['mode']);
      radios.forEach(r => { r.checked = (r.value === modeValue); });
    }
  }

  setActive(activeIndex) {
    [this.dom.p0, this.dom.p1].forEach((el, i) => {
      if (el) el.classList.toggle('active', i === activeIndex);
    });
  }

  setScores({ totals, current }) {
    if (this.dom.p0Total) this.dom.p0Total.textContent = totals[0];
    if (this.dom.p1Total) this.dom.p1Total.textContent = totals[1];
    if (this.dom.p0Current) this.dom.p0Current.textContent = (current && current.owner === 0) ? current.value : 0;
    if (this.dom.p1Current) this.dom.p1Current.textContent = (current && current.owner === 1) ? current.value : 0;
  }

  async animateDice(value) {
    const d = this.dom.dice;
    if (!d) return;
    d.classList.add('rolling');
    await delay(650);
    d.classList.remove('rolling');
    d.classList.remove('show-1', 'show-2', 'show-3', 'show-4', 'show-5', 'show-6');
    d.classList.add('show-' + value);
    d.setAttribute('aria-label', 'ลูกเต๋าแสดงหน้า ' + value);
  }

  setStatus(text, tone = 'neutral') {
    if (!this.dom.status) return;
    this.dom.status.textContent = text;
    this.dom.status.style.color =
      tone === 'good' ? 'var(--ok)' :
      (tone === 'bad' ? 'var(--danger)' : 'var(--muted)');
  }

  setButtons({ disabled }) {
    if (this.dom.btnRoll) this.dom.btnRoll.disabled = disabled;
    if (this.dom.btnHold) this.dom.btnHold.disabled = disabled;
  }

  openSettings() {
    if (!this.dom.dlg) return;
    if (this.dom.dlg.showModal) this.dom.dlg.showModal();
    else this.dom.dlg.setAttribute('open', '');
  }

  closeSettings() {
    if (!this.dom.dlg) return;
    if (this.dom.dlg.close) this.dom.dlg.close();
    else this.dom.dlg.removeAttribute('open');
  }
}