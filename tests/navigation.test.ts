import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import LearningWorld from '../components/LearningWorld';
import ParentZone from '../components/ParentZone';
import Footer from '../components/Footer';

const render = (component: React.ComponentType) => renderToStaticMarkup(React.createElement(component));

test('navigation and hero expose working section destinations and a named menu control', () => {
  const navigation = render(Navigation);
  for (const section of ['home', 'learning', 'stories', 'games', 'about', 'parent']) {
    assert(navigation.includes(`href="#${section}"`), `missing ${section} link`);
  }
  assert(navigation.includes('Open navigation menu'));
  const hero = render(HeroSection);
  assert(hero.includes('id="home"'));
  assert(hero.includes('href="#learning"'));
  assert(hero.includes('href="#stories"'));
});

test('learning links target existing routes and Reading is explicitly unavailable', () => {
  const html = render(LearningWorld);
  for (const route of ['math-adventures', 'science-lab', 'creative-studio']) assert(html.includes(`href="/${route}"`));
  assert(html.includes('Coming Soon'));
  assert(!html.includes('href="#"'));
  assert(!/<a\b[^>]*>[\s\S]*?<button\b/.test(html));
});

test('footer parents links have real destinations and collect no email', () => {
  const footer = render(Footer);
  const parent = render(ParentZone);
  for (const section of ['safety-privacy', 'progress', 'faq', 'support']) {
    assert(footer.includes(`href="#${section}"`));
    assert(parent.includes(`id="${section}"`));
  }
  assert(!footer.includes('href="#"'));
  assert(!footer.includes('<input'));
  assert(footer.includes('Coming Soon'));
  assert(!parent.includes('never shared'));
});
