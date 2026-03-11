const GREETINGS = [
  // Classics
  "Hope your week is off to a great start!",
  "Happy {day} — hope the day is treating you well!",
  "Hope this finds you well!",
  "Hope you're having a productive week!",
  "Hope you're doing well — it's been a busy one for all of us!",
  "Happy {day}! Hope things are going smoothly on your end.",
  "Hope the week is treating you kindly!",
  "Wishing you a wonderful {day}!",
  "Hope you're having a great one!",
  "Jumping in with some good energy for your {day}!",
  "Hope your {day} is off to a wonderful start!",
  "Hope all is well on your end!",
  "Excited to connect — hope your {day} is going well!",
  "Hope you're settling into the week nicely!",
  "Sending good vibes your way this {day}!",

  // Punny / playful
  "Hope your inbox is kinder to you than mine is to me!",
  "Sliding into your inbox like it's a {day} thing.",
  "Consider this email a little ray of {day} sunshine.",
  "Hope your coffee is strong and your {day} is long — in the best way.",
  "Coming at you live from a very full inbox on this fine {day}!",
  "Hope your {day} is going better than my WiFi right now.",
  "Popping into your inbox like it's the good kind of surprise!",
  "Hope you're having a {day} that matches your out-of-office energy.",
  "If emails could knock, consider this a polite tap on the door.",
  "No subject line could do justice to how much I hope your {day} is great.",
  "Think of this as a virtual warm handshake for your {day}.",
  "Hope the {day} is treating you like the VIP you are.",
  "Just a friendly hello from someone who respects your time — and your inbox.",
  "Consider this the email equivalent of a smile and a wave.",
  "Hope your {day} is as organized as this email is not.",

  // Smart / warm-witty
  "Life's too short for a bad {day} — hope yours is excellent.",
  "Here's to a {day} where everything goes exactly according to plan (or close enough).",
  "Hope the {day} is cooperating with your schedule.",
  "The week is young, and so are our ambitions — hope yours are thriving!",
  "Hope your {day} has been all signal and no noise.",
  "Wishing you the kind of {day} you actually want to talk about later.",
  "Hope your {day} is going at exactly the pace you need it to.",
  "Few things are better than a great start to a {day} — hope you're having one.",
  "Hope the {day} has been generous with you.",
  "May your {day} be productive, your meetings be short, and your lunch be good.",
  "Here's hoping your {day} is running on time — unlike most of mine.",
  "Hope your {day} is everything your calendar promised it would be.",
  "Wishing you a {day} with more wins than surprises.",
  "Hope the {day} is behaving itself on your end.",
  "Big things happen on {day}s like this — hope you're ready for them.",

  // Fashion / creative industry flavored
  "Hope the week is as sharp as your eye for detail!",
  "Hope your {day} is as on-trend as everything else you do.",
  "Sending good energy your way — and hoping your {day} is equally well-styled.",
  "Hope your {day} is full of the right kind of chaos.",
  "Here's to a {day} that's as polished as your work.",
  "Hope the creative juices are flowing freely this {day}!",
  "Hoping your {day} has great bones and even better execution.",
  "Hope your {day} is as curated as it gets.",
];

function getRandomGreeting() {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const today = days[new Date().getDay()];
  const template = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  return template.replace(/{day}/g, today);
}

let current = '';

function generateAndCopy() {
  const el = document.getElementById('greetingText');
  const btn = document.getElementById('generateBtn');

  el.style.opacity = '0';
  el.style.transform = 'translateY(4px)';

  setTimeout(() => {
    current = getRandomGreeting();
    el.textContent = current;
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';

    navigator.clipboard.writeText(current).then(() => {
      btn.textContent = '✓ Copied';
      btn.classList.add('success');
      setTimeout(() => {
        btn.textContent = 'Generate';
        btn.classList.remove('success');
      }, 1800);
    });
  }, 140);
}

document.addEventListener('DOMContentLoaded', () => {
  current = getRandomGreeting();
  document.getElementById('greetingText').textContent = current;
  document.getElementById('generateBtn').addEventListener('click', generateAndCopy);
});
