export const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

export const delay = (ms) => new Promise(r => setTimeout(r, ms));

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];