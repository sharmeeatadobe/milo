/* eslint-disable no-unused-expressions */
/* global describe before after it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const scripts = {};

document.body.innerHTML = await readFile({ path: '../mocks/body.html' });
document.head.innerHTML = await readFile({ path: '../mocks/head.html' });

describe('Decorating', () => {
  before(async () => {
    const mod = await import('../../scripts/scripts.js');
    Object.keys(mod).forEach((func) => {
      scripts[func] = mod[func];
    });
  });

  it('Decorates blocks', async () => {
    const blocks = document.querySelectorAll('[class]');
    expect(blocks.length).to.equal(5);
    expect(blocks[0].classList.length).to.equal(3);
  });

  it('Decorates pictures', async () => {
    const pics = document.querySelectorAll('picture');
    expect(pics[0].parentElement.nodeName).to.equal('P');
    expect(pics[1].parentElement.nodeName).to.equal('P');
  });

  it('Decorates relative links', async () => {
    const links = document.querySelectorAll('a');
    expect(links[0].href).to.equal('http://localhost:2000/test');
    expect(links[1].href).to.equal('http://localhost:2000/test');
  });

  it('Decorates SVGs', async () => {
    const svgs = document.querySelectorAll('[src$="svg"]');
    expect(svgs.length).to.equal(2);
    expect(svgs[0].src).to.equal('http://localhost:2000/img/favicon.svg');
    expect(svgs[1].parentElement.href).to.equal('https://www.adobe.com/');
  });

  it('Decorates auto blocks', async () => {
    const autoBlock = document.querySelector('a[class]');
    expect(autoBlock.className).to.equal('youtube');
  });
});

describe('Loading', () => {
  before(() => {
    sinon.spy(console, 'log');
  });

  after(() => {
    console.log.restore();
  });

  it('Doesnt load a block twice', async () => {
    const hero = await scripts.loadBlock(document.querySelector('.hero'));
    expect(hero.dataset.status).to.equal('loaded');
  });

  it('Doesnt load a bad block', async () => {
    await scripts.loadBlock(document.querySelector('#not-block'));
    expect(console.log.called).to.be.true;
  });
});
