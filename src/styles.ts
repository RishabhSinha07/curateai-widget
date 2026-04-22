import type { CurateAIWidgetConfig } from './types';

export function buildStyles(config: CurateAIWidgetConfig): string {
  const { primaryColor, backgroundColor, assistantBubbleColor, textColor, textSecondaryColor, fontFamily, borderRadius, bubbleSize } = config;

  // Warm luxury design tokens
  const ivory = '#F7F2EA';
  const cream = '#FBF7F0';
  const cream2 = '#F1E9DC';
  const paper = '#FFFDF9';
  const plum = '#3B1F2B';
  const plumDeep = '#2A1620';
  const plumSoft = '#5E3A4A';
  const bronze = '#A57548';
  const bronzeDark = '#8A5E37';
  const rose = '#C9A89A';
  const roseLight = '#E8D5C9';
  const line = 'rgba(59, 31, 43, 0.10)';
  const lineStrong = 'rgba(59, 31, 43, 0.18)';
  const mute = 'rgba(59, 31, 43, 0.55)';
  const muteSoft = 'rgba(59, 31, 43, 0.35)';
  const errorColor = '#9C3A3A';

  const serif = '"Cormorant Garamond", "EB Garamond", Georgia, serif';
  const sans = fontFamily;

  return `
    :host {
      all: initial;
      font-family: ${sans};
      color: ${plum};
      line-height: 1.5;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* ---- Animations ---- */
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes slideDown {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to   { opacity: 0; transform: translateY(16px) scale(0.96); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes bounceIn {
      0%   { transform: scale(0); }
      50%  { transform: scale(1.15); }
      100% { transform: scale(1); }
    }
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-6px); }
    }
    @keyframes revealCard {
      from { opacity: 0; transform: translateY(12px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes bronzeGlow {
      0%, 100% { box-shadow: 0 0 8px rgba(165,117,72,0.3); }
      50% { box-shadow: 0 0 16px rgba(165,117,72,0.5); }
    }

    /* ---- Container ---- */
    .cai-container {
      position: fixed;
      z-index: ${config.zIndex};
      font-family: ${sans};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .cai-container.cai-bottom-right {
      bottom: ${config.offsetY}px;
      right: ${config.offsetX}px;
    }
    .cai-container.cai-bottom-left {
      bottom: ${config.offsetY}px;
      left: ${config.offsetX}px;
    }

    /* ---- Bubble FAB ---- */
    .cai-bubble {
      width: ${bubbleSize}px;
      height: ${bubbleSize}px;
      border-radius: 50%;
      border: 1px solid ${bronzeDark};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 12px 30px -8px rgba(165,117,72,0.6);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      animation: bounceIn 0.4s ease-out;
      position: fixed;
      z-index: 2;
      padding: 0;
      background: radial-gradient(circle at 30% 28%, ${rose}, ${bronze} 55%, ${bronzeDark});
    }
    .cai-container.cai-bottom-right .cai-bubble {
      bottom: ${config.offsetY}px;
      right: ${config.offsetX}px;
    }
    .cai-container.cai-bottom-left .cai-bubble {
      bottom: ${config.offsetY}px;
      left: ${config.offsetX}px;
    }
    .cai-bubble::before {
      content: '';
      position: absolute;
      top: 8%;
      left: 14%;
      width: 38%;
      height: 30%;
      border-radius: 50%;
      background: radial-gradient(ellipse, rgba(255,255,255,0.55), transparent 65%);
      pointer-events: none;
    }
    .cai-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 14px 36px -8px rgba(165,117,72,0.7);
    }
    .cai-bubble:active { transform: scale(0.95); }
    .cai-bubble .cai-chat-icon,
    .cai-bubble .cai-close-icon {
      width: 28px;
      height: 28px;
      fill: none;
      position: absolute;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .cai-bubble-online {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background: #6B8E5A;
      border: 2px solid ${paper};
      z-index: 2;
    }
    .cai-bubble-tooltip {
      position: absolute;
      bottom: calc(100% + 12px);
      right: -8px;
      background: ${paper};
      color: ${plum};
      font-family: ${serif};
      font-style: italic;
      font-weight: 500;
      font-size: 13px;
      padding: 10px 16px;
      border-radius: 14px;
      white-space: nowrap;
      box-shadow: 0 8px 20px rgba(59,31,43,0.12);
      border: 1px solid ${line};
      animation: fadeIn 0.3s ease-out;
      pointer-events: none;
    }
    .cai-bubble-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      right: 24px;
      border: 6px solid transparent;
      border-top-color: ${paper};
    }
    .cai-bubble .cai-chat-icon {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }
    .cai-bubble .cai-close-icon {
      opacity: 0;
      transform: rotate(-90deg) scale(0.5);
    }
    .cai-bubble.cai-open .cai-chat-icon {
      opacity: 0;
      transform: rotate(90deg) scale(0.5);
    }
    .cai-bubble.cai-open .cai-close-icon {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    /* ---- Chat Window ---- */
    .cai-window {
      position: absolute;
      bottom: ${bubbleSize + 16}px;
      width: ${config.width}px;
      height: ${config.height}px;
      max-height: calc(100vh - ${config.offsetY * 2 + bubbleSize + 16}px);
      border-radius: ${borderRadius}px;
      background-color: ${ivory};
      box-shadow:
        0 1px 0 rgba(255,255,255,0.8) inset,
        0 24px 60px -20px rgba(59,31,43,0.35),
        0 8px 24px -8px rgba(59,31,43,0.18);
      border: 1px solid ${line};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.25s ease-out;
      position: relative;
    }
    .cai-window::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.23 0 0 0 0 0.12 0 0 0 0 0.17 0 0 0 0.035 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
      mix-blend-mode: multiply;
      opacity: 0.7;
      border-radius: ${borderRadius}px;
    }
    .cai-window.cai-closing {
      animation: slideDown 0.2s ease-in forwards;
    }
    .cai-container.cai-bottom-right .cai-window { right: 0; }
    .cai-container.cai-bottom-left .cai-window { left: 0; }

    /* ---- Header ---- */
    .cai-header {
      background: linear-gradient(180deg, ${paper} 0%, ${ivory} 100%);
      border-bottom: 1px solid ${line};
      color: ${plum};
      padding: 18px 20px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }
    .cai-header-dot {
      display: none;
    }
    .cai-header-icon {
      width: 38px;
      height: 38px;
      border-radius: 19px;
      background: radial-gradient(circle at 30% 28%, ${rose}, ${bronze} 55%, ${bronzeDark});
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 10px rgba(165,117,72,0.4), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(59,31,43,0.15);
      position: relative;
      overflow: hidden;
    }
    .cai-header-icon::before {
      content: '';
      position: absolute;
      top: 8%;
      left: 14%;
      width: 38%;
      height: 30%;
      border-radius: 50%;
      background: radial-gradient(ellipse, rgba(255,255,255,0.55), transparent 65%);
      pointer-events: none;
    }
    .cai-header-icon svg {
      width: 18px;
      height: 18px;
      position: relative;
    }
    .cai-header-text { flex: 1; min-width: 0; }
    .cai-header-title {
      font-family: ${serif};
      font-size: 21px;
      font-weight: 500;
      letter-spacing: -0.2px;
      line-height: 1.1;
      color: ${plum};
    }
    .cai-header-subtitle {
      font-size: 11.5px;
      color: ${mute};
      letter-spacing: 0.4px;
      text-transform: uppercase;
      font-weight: 500;
      margin-top: 2px;
    }
    .cai-header-close {
      width: 32px;
      height: 32px;
      border-radius: 16px;
      background: transparent;
      border: 1px solid ${line};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      flex-shrink: 0;
      color: ${plumSoft};
    }
    .cai-header-close:hover { background: rgba(59,31,43,0.05); }
    .cai-header-close svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 1.6; }

    /* ---- Message List ---- */
    .cai-messages {
      flex: 1;
      overflow-y: auto;
      padding: 18px 18px 8px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      scroll-behavior: smooth;
      position: relative;
      z-index: 1;
    }
    .cai-messages::-webkit-scrollbar { width: 5px; }
    .cai-messages::-webkit-scrollbar-track { background: transparent; }
    .cai-messages::-webkit-scrollbar-thumb { background: rgba(165,117,72,0.2); border-radius: 10px; }
    .cai-messages::-webkit-scrollbar-thumb:hover { background: rgba(165,117,72,0.35); }

    /* ---- Message Bubbles ---- */
    .cai-msg {
      display: flex;
      flex-direction: column;
      gap: 4px;
      animation: fadeIn 0.25s ease-out;
    }
    .cai-msg-user { align-items: flex-end; }
    .cai-msg-assistant { align-items: flex-start; }

    .cai-msg-label {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 0 4px;
    }
    .cai-msg-user .cai-msg-label {
      color: ${muteSoft};
    }
    .cai-msg-assistant .cai-msg-label {
      color: ${bronze};
      letter-spacing: 1.2px;
      font-family: ${serif};
      font-style: italic;
    }

    .cai-bubble-wrap {
      max-width: 85%;
      padding: 12px 16px;
      font-size: 13.5px;
      line-height: 1.55;
      word-break: break-word;
    }
    .cai-msg-user .cai-bubble-wrap {
      background: linear-gradient(135deg, ${plum}, ${plumDeep});
      color: ${cream};
      border-radius: 18px 18px 4px 18px;
      box-shadow: 0 2px 8px rgba(59,31,43,0.15);
    }
    .cai-msg-assistant .cai-bubble-wrap {
      background: ${paper};
      color: ${plum};
      border-radius: 18px 18px 18px 4px;
      border: 1px solid ${line};
    }

    /* ---- Markdown Styles ---- */
    .cai-md p { margin-bottom: 10px; }
    .cai-md p:last-child { margin-bottom: 0; }
    .cai-md strong { font-weight: 600; color: ${plum}; }
    .cai-md em { font-style: italic; }
    .cai-md a { color: ${bronze}; text-decoration: underline; }
    .cai-md a:hover { opacity: 0.8; }
    .cai-md code {
      background: rgba(59,31,43,0.06);
      padding: 1px 5px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9em;
      color: ${bronzeDark};
    }
    .cai-md ul, .cai-md ol { padding-left: 20px; margin-bottom: 10px; }
    .cai-md li { margin-bottom: 4px; }
    .cai-md h1, .cai-md h2, .cai-md h3 {
      color: ${plum};
      font-family: ${serif};
      font-weight: 500;
      letter-spacing: -0.2px;
      margin-top: 12px;
      margin-bottom: 6px;
    }
    .cai-md h1 { font-size: 16px; }
    .cai-md h2 { font-size: 15px; }
    .cai-md h3 { font-size: 14px; }
    .cai-md h1:first-child, .cai-md h2:first-child, .cai-md h3:first-child { margin-top: 0; }

    /* Section heading */
    .cai-section-heading {
      display: block;
      font-family: ${serif};
      font-weight: 500;
      font-size: 13px;
      color: ${bronze};
      letter-spacing: 0.02em;
      margin-top: 12px;
      margin-bottom: 6px;
    }
    .cai-bubble-wrap > .cai-md > .cai-section-heading:first-child { margin-top: 0; }

    /* ---- Collapsible Sections ---- */
    .cai-collapsible-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      text-align: left;
      padding: 6px 0;
      background: none;
      border: none;
      cursor: pointer;
      color: ${bronze};
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 0.02em;
      transition: opacity 0.15s;
      font-family: inherit;
    }
    .cai-collapsible-btn:hover { opacity: 0.8; }
    .cai-collapsible-btn svg {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      transition: transform 0.2s;
      stroke: ${bronze};
      fill: none;
      stroke-width: 2;
    }
    .cai-collapsible-body {
      overflow: hidden;
      transition: max-height 0.3s ease, opacity 0.2s ease;
    }
    .cai-collapsible-body.cai-open {
      max-height: 2000px;
      opacity: 1;
    }
    .cai-collapsible-body.cai-closed {
      max-height: 0;
      opacity: 0;
    }
    .cai-collapsible-content {
      padding-left: 20px;
      padding-top: 4px;
    }

    /* ---- Products ---- */
    .cai-products {
      width: 100%;
      position: relative;
    }
    .cai-products-scroll {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding: 4px 2px 12px;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }
    .cai-products-scroll::-webkit-scrollbar { height: 4px; }
    .cai-products-scroll::-webkit-scrollbar-track { background: transparent; }
    .cai-products-scroll::-webkit-scrollbar-thumb { background: rgba(165,117,72,0.2); border-radius: 10px; }
    .cai-products-fade {
      position: absolute;
      top: 0; right: 0; bottom: 0;
      width: 40px;
      pointer-events: none;
      background: linear-gradient(to left, ${ivory}, transparent);
      z-index: 1;
    }

    .cai-product-card {
      flex-shrink: 0;
      scroll-snap-align: start;
      width: 150px;
      border-radius: 12px;
      background: ${paper};
      border: 1px solid ${line};
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
      animation: revealCard 0.35s ease-out backwards;
      text-decoration: none;
      color: ${plum};
      cursor: pointer;
    }
    .cai-product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(59,31,43,0.12);
      border-color: ${lineStrong};
    }
    .cai-product-img {
      width: 100%;
      height: 110px;
      object-fit: cover;
      display: block;
    }
    .cai-product-img-placeholder {
      width: 100%;
      height: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, ${roseLight}, ${cream2});
    }
    .cai-product-img-placeholder svg {
      width: 28px; height: 28px;
      stroke: ${plum};
      fill: none; stroke-width: 1;
      opacity: 0.4;
    }
    .cai-product-body {
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }
    .cai-product-brand {
      font-size: 9px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: ${mute};
    }
    .cai-product-name {
      font-family: ${serif};
      font-size: 14px;
      font-weight: 500;
      line-height: 1.15;
      color: ${plum};
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 32px;
      margin-top: 1px;
    }
    .cai-product-desc {
      font-size: 11px;
      line-height: 1.4;
      color: ${mute};
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .cai-product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding-top: 6px;
      margin-top: auto;
    }
    .cai-product-price {
      font-family: ${sans};
      font-size: 14px;
      font-weight: 600;
      color: ${plum};
      letter-spacing: -0.2px;
    }
    .cai-product-cta {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 20px;
      background: ${plum};
      color: ${cream};
      white-space: nowrap;
      letter-spacing: 0.4px;
    }
    .cai-product-cta svg { width: 10px; height: 10px; stroke: ${cream}; fill: none; stroke-width: 2; }

    /* ---- Suggested Replies ---- */
    .cai-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      animation: fadeIn 0.3s ease-out;
      margin-top: 8px;
    }
    .cai-reply-btn {
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 400;
      border: 1px solid ${lineStrong};
      background: ${paper};
      color: ${plum};
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      font-family: inherit;
    }
    .cai-reply-btn:first-child {
      border-color: ${plumSoft};
      font-weight: 500;
    }
    .cai-reply-btn:hover {
      background: ${cream2};
      border-color: ${plumSoft};
      transform: scale(1.03);
    }
    .cai-reply-btn:active { transform: scale(0.97); }

    /* ---- Typing Indicator ---- */
    .cai-typing {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 14px 18px;
      background: ${paper};
      border-radius: 18px 18px 18px 4px;
      border: 1px solid ${line};
      width: fit-content;
    }
    .cai-typing-dot {
      width: 7px;
      height: 7px;
      border-radius: 4px;
      background: ${bronze};
      animation: bounce 1.2s ease-in-out infinite;
    }
    .cai-typing-dot:nth-child(1) { opacity: 0.9; }
    .cai-typing-dot:nth-child(2) { opacity: 0.6; animation-delay: 0.15s; }
    .cai-typing-dot:nth-child(3) { opacity: 0.35; animation-delay: 0.3s; }

    /* ---- Input Area ---- */
    .cai-input-area {
      padding: 14px 16px 16px;
      border-top: 1px solid ${line};
      background: ${paper};
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }
    .cai-input-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      background: ${cream};
      border-radius: 999px;
      padding: 4px 4px 4px 18px;
      border: 1px solid ${line};
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .cai-input-wrap:focus-within {
      border-color: ${bronze};
      box-shadow: 0 0 0 2px rgba(165,117,72,0.1);
    }
    .cai-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-family: ${sans};
      font-size: 14px;
      color: ${plum};
      line-height: 36px;
      padding: 0;
      min-width: 0;
    }
    .cai-input::placeholder { color: ${muteSoft}; }
    .cai-send-btn {
      width: 36px;
      height: 36px;
      border-radius: 18px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s, opacity 0.15s;
      flex-shrink: 0;
    }
    .cai-send-btn:not(:disabled) {
      background: linear-gradient(135deg, ${bronze}, ${bronzeDark});
      color: ${paper};
      box-shadow: 0 2px 6px rgba(165,117,72,0.35);
    }
    .cai-send-btn:disabled {
      background: ${cream2};
      color: ${muteSoft};
      cursor: not-allowed;
    }
    .cai-send-btn:not(:disabled):hover { transform: scale(1.08); }
    .cai-send-btn:not(:disabled):active { transform: scale(0.95); }
    .cai-send-btn svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 1.8; }

    /* ---- Welcome Screen ---- */
    .cai-welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 28px 22px 18px;
      flex: 1;
      overflow-y: auto;
      position: relative;
      z-index: 1;
    }
    .cai-welcome-header {
      text-align: center;
      margin-bottom: 28px;
    }
    .cai-welcome-kicker {
      font-size: 11.5px;
      color: ${bronze};
      letter-spacing: 1.8px;
      text-transform: uppercase;
      font-weight: 500;
      margin-bottom: 14px;
    }
    .cai-welcome-title {
      font-family: ${serif};
      font-size: 34px;
      font-weight: 400;
      letter-spacing: -0.8px;
      line-height: 1.05;
      color: ${plum};
    }
    .cai-welcome-title em {
      font-style: italic;
      color: ${bronze};
    }
    .cai-welcome-msg {
      font-size: 13px;
      color: ${mute};
      line-height: 1.5;
      max-width: 280px;
      margin: 12px auto 0;
    }
    .cai-welcome-icon { display: none; }

    .cai-welcome-section-label {
      font-size: 10.5px;
      color: ${muteSoft};
      letter-spacing: 1.4px;
      text-transform: uppercase;
      font-weight: 500;
      margin: 18px 0 10px;
      padding-left: 2px;
    }
    .cai-topic-cards {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .cai-topic-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      background: ${paper};
      border: 1px solid ${line};
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
      width: 100%;
      font-family: ${sans};
      color: ${plum};
    }
    .cai-topic-card:hover {
      background: ${cream};
      border-color: ${lineStrong};
      transform: translateY(-1px);
    }
    .cai-topic-card:active { transform: scale(0.98); }
    .cai-topic-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, ${cream2}, ${roseLight});
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 1px solid ${line};
    }
    .cai-topic-icon svg {
      width: 18px;
      height: 18px;
      stroke: ${bronzeDark};
      fill: none;
      stroke-width: 1.4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .cai-topic-text { flex: 1; min-width: 0; }
    .cai-topic-title {
      font-family: ${serif};
      font-size: 17px;
      font-weight: 500;
      color: ${plum};
      line-height: 1.1;
    }
    .cai-topic-desc {
      font-size: 12px;
      color: ${mute};
      line-height: 1.4;
      margin-top: 2px;
    }
    .cai-topic-arrow {
      flex-shrink: 0;
    }
    .cai-topic-arrow svg {
      width: 14px;
      height: 14px;
      stroke: ${muteSoft};
      fill: none;
      stroke-width: 1.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* ---- Error Banner ---- */
    .cai-error {
      margin: 0 16px 10px;
      padding: 12px 14px;
      background: #FBEFEA;
      border: 1px solid rgba(156,58,58,0.2);
      border-radius: 12px;
      color: ${plum};
      font-size: 12.5px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      animation: fadeIn 0.2s ease-out;
      position: relative;
      z-index: 1;
    }
    .cai-error svg { width: 16px; height: 16px; stroke: ${errorColor}; fill: none; stroke-width: 1.5; flex-shrink: 0; margin-top: 1px; }
    .cai-error-title {
      font-weight: 600;
      color: ${errorColor};
      line-height: 1.3;
    }
    .cai-error-desc {
      font-size: 11.5px;
      color: ${plumSoft};
      line-height: 1.5;
      margin-top: 2px;
    }

    /* ---- Powered By ---- */
    .cai-powered {
      text-align: center;
      font-size: 10px;
      color: ${muteSoft};
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 500;
      margin-top: 10px;
      position: relative;
      z-index: 1;
    }
    .cai-powered .cai-powered-brand {
      color: ${bronze};
      text-decoration: none;
      transition: opacity 0.15s;
    }
    .cai-powered .cai-powered-brand:hover { opacity: 0.7; }

    /* ---- Login Screen ---- */
    .cai-login {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 28px 24px 24px;
      overflow-y: auto;
      position: relative;
      z-index: 1;
    }
    .cai-login-header {
      text-align: center;
      margin-bottom: 22px;
    }
    .cai-login-icon {
      width: 56px;
      height: 56px;
      border-radius: 28px;
      background: radial-gradient(circle at 30% 28%, ${rose}, ${bronze} 55%, ${bronzeDark});
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
      box-shadow: 0 2px 10px rgba(165,117,72,0.4), inset 0 1px 0 rgba(255,255,255,0.45);
      position: relative;
      overflow: hidden;
    }
    .cai-login-icon::before {
      content: '';
      position: absolute;
      top: 8%;
      left: 14%;
      width: 38%;
      height: 30%;
      border-radius: 50%;
      background: radial-gradient(ellipse, rgba(255,255,255,0.55), transparent 65%);
      pointer-events: none;
    }
    .cai-login-icon svg {
      width: 26px;
      height: 26px;
      position: relative;
    }
    .cai-login-title {
      font-family: ${serif};
      font-size: 26px;
      font-weight: 400;
      color: ${plum};
      letter-spacing: -0.4px;
      line-height: 1.1;
      margin-bottom: 6px;
    }
    .cai-login-subtitle {
      font-size: 12.5px;
      color: ${mute};
      line-height: 1.5;
      max-width: 260px;
      margin: 0 auto;
    }
    .cai-login-tabs {
      display: flex;
      gap: 0;
      background: ${cream2};
      border-radius: 999px;
      padding: 4px;
      margin-bottom: 16px;
    }
    .cai-login-tab {
      flex: 1;
      padding: 8px 0;
      border: none;
      border-radius: 999px;
      background: transparent;
      font-family: ${sans};
      font-size: 12.5px;
      font-weight: 500;
      color: ${mute};
      cursor: pointer;
      transition: all 0.15s;
      text-align: center;
    }
    .cai-login-tab.cai-active {
      background: ${paper};
      color: ${plum};
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(59,31,43,0.08);
    }
    .cai-login-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .cai-login-field {
      background: ${paper};
      border: 1px solid ${line};
      border-radius: 12px;
      padding: 10px 14px 8px;
    }
    .cai-login-field-label {
      font-size: 9.5px;
      color: ${mute};
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .cai-login-input {
      width: 100%;
      padding: 0;
      margin-top: 2px;
      border: none;
      border-radius: 0;
      font-family: ${sans};
      font-size: 14px;
      color: ${plum};
      background: transparent;
      outline: none;
    }
    .cai-login-input::placeholder {
      color: ${muteSoft};
    }
    .cai-login-btn {
      width: 100%;
      padding: 13px 0;
      border: none;
      border-radius: 999px;
      background: linear-gradient(135deg, ${plum}, ${plumDeep});
      color: ${cream};
      font-family: ${sans};
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.4px;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.15s;
      margin-top: 6px;
      box-shadow: 0 4px 14px -4px rgba(59,31,43,0.5);
    }
    .cai-login-btn:hover { opacity: 0.9; }
    .cai-login-btn:active { transform: scale(0.98); }
    .cai-login-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
    }
    .cai-login-error {
      padding: 10px 14px;
      background: #FBEFEA;
      border: 1px solid rgba(156,58,58,0.2);
      border-radius: 12px;
      color: ${errorColor};
      font-size: 13px;
      margin-bottom: 16px;
      line-height: 1.4;
    }

    /* ---- Header Sign Out ---- */
    .cai-header-signout {
      width: 32px;
      height: 32px;
      border-radius: 16px;
      background: transparent;
      border: 1px solid ${line};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      flex-shrink: 0;
      color: ${plumSoft};
    }
    .cai-header-signout:hover { background: rgba(59,31,43,0.05); }
    .cai-header-signout svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 1.6; }

    /* ---- Mobile Responsive ---- */
    @media (max-width: 448px) {
      .cai-window {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        width: 100% !important;
        height: 100% !important;
        max-height: 100vh !important;
        border-radius: 0;
      }
    }
  `;
}
