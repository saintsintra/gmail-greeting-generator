// Gmail Greeting Generator - Content Script v6
// Toolbar button + Ctrl+Shift+G hotkey

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

function showToast(msg, isError) {
  const existing = document.getElementById('gg-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'gg-toast';
  toast.style.cssText = `
    position:fixed;bottom:28px;right:28px;
    background:${isError ? '#2e1a1a' : '#1a1a2e'};color:#e8d5b7;
    font-family:Georgia,serif;font-size:13px;
    padding:13px 18px;border-radius:8px;
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
    z-index:2147483647;max-width:320px;
    border-left:3px solid ${isError ? '#e05555' : '#c9a96e'};
    line-height:1.5;pointer-events:none;
  `;
  toast.innerHTML = `<div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${isError?'#e05555':'#c9a96e'};margin-bottom:5px;">${isError?'⚠ Error':'Greeting inserted ✦'}</div><div style="opacity:.85">"${msg}"</div>`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.transition='opacity .4s'; toast.style.opacity='0'; setTimeout(()=>toast.remove(),400); }, isError?5000:2800);
}

function findComposeBody() {
  const selectors = [
    'div.LW-avf',
    'div[aria-label="Message Body"]',
    'div[g_editable="true"]',
    'div.Am.Al.editable',
  ];
  for (const sel of selectors) {
    for (const el of document.querySelectorAll(sel)) {
      if (el.isContentEditable && el.offsetParent !== null) return el;
    }
  }
  return null;
}

function insertGreeting(composeBody) {
  if (!composeBody) return;
  const greeting = getRandomGreeting();
  composeBody.focus();
  setTimeout(() => {
    // If we already injected a greeting, just replace its text
    const existing = composeBody.querySelector('div[data-gg="greeting"]');
    if (existing) {
      existing.textContent = greeting;
    } else {
      const greetingDiv = document.createElement('div');
      greetingDiv.setAttribute('data-gg', 'greeting');
      greetingDiv.textContent = greeting;
      const spacer = document.createElement('div');
      spacer.setAttribute('data-gg', 'spacer');
      spacer.innerHTML = '<br>';
      composeBody.insertBefore(spacer, composeBody.firstChild);
      composeBody.insertBefore(greetingDiv, composeBody.firstChild);
    }
    composeBody.dispatchEvent(new Event('input', { bubbles: true }));
  }, 30);
}

// ── Toolbar button injection ──
// Gmail's compose bottom toolbar: the row containing Send, formatting icons etc.
// We look for the row that contains the Send button's sibling toolbar icons.

function createButton() {
  const btn = document.createElement('div');
  btn.id = 'gg-hi-btn';
  btn.title = 'Insert Greeting (Ctrl+Shift+G)';

  const iconUrl = chrome.runtime.getURL('icon.png');
  btn.style.cssText = `
    display:inline-flex !important;
    align-items:center !important;
    justify-content:center !important;
    width:26px !important;
    height:26px !important;
    border-radius:50% !important;
    cursor:pointer !important;
    margin:0 3px !important;
    flex-shrink:0 !important;
    vertical-align:middle !important;
    opacity:0.85;
    transition:opacity 0.15s, transform 0.15s;
  `;
  btn.innerHTML = `<img src="${iconUrl}" style="width:24px;height:24px;border-radius:50%;display:block;pointer-events:none;" alt="Hi!">`;

  btn.addEventListener('mouseenter', () => { btn.style.opacity='1'; btn.style.transform='scale(1.1)'; });
  btn.addEventListener('mouseleave', () => { btn.style.opacity='0.85'; btn.style.transform='scale(1)'; });
  btn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    insertGreeting(findComposeBody());
  });
  return btn;
}

function injectIntoToolbar() {
  // Strategy: find all compose windows, look for their bottom toolbar
  // Gmail bottom toolbar sits in a <td> or <div> alongside the Send button

  // Method 1: find the formatting toolbar row (contains bold, italic etc buttons)
  // These have aria-label attributes like "Bold", "Italic" etc
  const formattingBtns = document.querySelectorAll(
    'div[aria-label="Bold"], div[aria-label="Italic"], div[aria-label="Underline"]'
  );

  formattingBtns.forEach(boldBtn => {
    // Walk up to find the toolbar container row
    let toolbar = boldBtn.parentElement;
    for (let i = 0; i < 5; i++) {
      if (!toolbar) break;
      // Found the row that holds all formatting buttons
      if (toolbar.children.length >= 3) break;
      toolbar = toolbar.parentElement;
    }
    if (!toolbar) return;

    // Check if we already injected
    if (toolbar.querySelector('#gg-hi-btn')) return;

    const btn = createButton();
    // Insert right after the last child of the toolbar
    toolbar.appendChild(btn);
    console.log('[GG] Button injected into formatting toolbar');
  });

  // Method 2: find the bottom action bar (contains send + formatting toggle)
  // Look for the container that has the "More formatting options" button
  const moreFormatting = document.querySelectorAll(
    'div[aria-label="More formatting options"], div[data-tooltip="More formatting options"]'
  );

  moreFormatting.forEach(moreBtn => {
    let toolbar = moreBtn.parentElement;
    if (!toolbar) return;
    if (toolbar.querySelector('#gg-hi-btn')) return;
    const btn = createButton();
    toolbar.insertBefore(btn, moreBtn);
    console.log('[GG] Button injected near More formatting options');
  });
}

// Watch for compose windows appearing
const observer = new MutationObserver(() => injectIntoToolbar());
observer.observe(document.documentElement, { childList: true, subtree: true });
injectIntoToolbar();

// ── Ctrl+Shift+G hotkey ──
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'g' || e.key === 'G')) {
    e.preventDefault();
    e.stopPropagation();
    insertGreeting(findComposeBody());
  }
}, true);

console.log('[Greeting Generator] v6 — toolbar button + Ctrl+Shift+G');
