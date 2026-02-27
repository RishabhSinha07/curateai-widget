import type { CurateAIWidgetConfig } from './types';

export function buildStyles(config: CurateAIWidgetConfig): string {
  const { primaryColor, accentColor, backgroundColor, assistantBubbleColor, textColor, textSecondaryColor, fontFamily, borderRadius, headerGradient, bubbleSize } = config;

  return `
    :host {
      all: initial;
      font-family: ${fontFamily};
      color: ${textColor};
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
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    /* ---- Container ---- */
    .cai-container {
      position: fixed;
      z-index: ${config.zIndex};
      font-family: ${fontFamily};
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
      background: ${headerGradient};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      animation: bounceIn 0.4s ease-out;
      position: relative;
    }
    .cai-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 24px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1);
    }
    .cai-bubble:active { transform: scale(0.95); }
    .cai-bubble svg { width: 28px; height: 28px; fill: none; stroke: #fff; stroke-width: 2; }
    .cai-bubble .cai-close-icon { display: none; }
    .cai-bubble.cai-open .cai-chat-icon { display: none; }
    .cai-bubble.cai-open .cai-close-icon { display: block; }

    /* ---- Chat Window ---- */
    .cai-window {
      position: absolute;
      bottom: ${bubbleSize + 16}px;
      width: ${config.width}px;
      height: ${config.height}px;
      max-height: calc(100vh - ${config.offsetY * 2 + bubbleSize + 16}px);
      border-radius: ${borderRadius}px;
      background: ${backgroundColor};
      box-shadow: 0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.25s ease-out;
    }
    .cai-window.cai-closing {
      animation: slideDown 0.2s ease-in forwards;
    }
    .cai-container.cai-bottom-right .cai-window { right: 0; }
    .cai-container.cai-bottom-left .cai-window { left: 0; }

    /* ---- Header ---- */
    .cai-header {
      background: ${headerGradient};
      color: #fff;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .cai-header-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .cai-header-icon svg { width: 20px; height: 20px; fill: none; stroke: #fff; stroke-width: 2; }
    .cai-header-text { flex: 1; min-width: 0; }
    .cai-header-title {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.01em;
    }
    .cai-header-subtitle {
      font-size: 12px;
      opacity: 0.85;
      margin-top: 2px;
    }
    .cai-header-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    .cai-header-close:hover { background: rgba(255,255,255,0.25); }
    .cai-header-close svg { width: 16px; height: 16px; stroke: #fff; fill: none; stroke-width: 2.5; }

    /* ---- Message List ---- */
    .cai-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
    }
    .cai-messages::-webkit-scrollbar { width: 5px; }
    .cai-messages::-webkit-scrollbar-track { background: transparent; }
    .cai-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }

    /* ---- Message Bubbles ---- */
    .cai-msg {
      display: flex;
      flex-direction: column;
      gap: 8px;
      animation: fadeIn 0.25s ease-out;
    }
    .cai-msg-user { align-items: flex-end; }
    .cai-msg-assistant { align-items: flex-start; }

    .cai-bubble-wrap {
      max-width: 85%;
      padding: 12px 16px;
      font-size: 14px;
      line-height: 1.6;
      word-break: break-word;
    }
    .cai-msg-user .cai-bubble-wrap {
      background: ${config.userBubbleColor};
      color: #fff;
      border-radius: ${borderRadius}px ${borderRadius}px 4px ${borderRadius}px;
    }
    .cai-msg-assistant .cai-bubble-wrap {
      background: ${assistantBubbleColor};
      color: ${textColor};
      border-radius: ${borderRadius}px ${borderRadius}px ${borderRadius}px 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      border-left: 3px solid ${primaryColor}33;
    }

    /* ---- Markdown Styles ---- */
    .cai-md p { margin-bottom: 10px; }
    .cai-md p:last-child { margin-bottom: 0; }
    .cai-md strong { font-weight: 600; }
    .cai-md em { font-style: italic; }
    .cai-md a { color: ${primaryColor}; text-decoration: underline; }
    .cai-md a:hover { opacity: 0.8; }
    .cai-md code {
      background: rgba(0,0,0,0.06);
      padding: 1px 5px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9em;
    }
    .cai-md ul, .cai-md ol { padding-left: 20px; margin-bottom: 10px; }
    .cai-md li { margin-bottom: 4px; }
    .cai-md h1, .cai-md h2, .cai-md h3 {
      color: ${primaryColor};
      font-weight: 600;
      letter-spacing: 0.02em;
      margin-top: 12px;
      margin-bottom: 6px;
    }
    .cai-md h1 { font-size: 16px; }
    .cai-md h2 { font-size: 15px; }
    .cai-md h3 { font-size: 14px; }
    .cai-md h1:first-child, .cai-md h2:first-child, .cai-md h3:first-child { margin-top: 0; }

    /* Section heading (bold text ending with colon) */
    .cai-section-heading {
      display: block;
      font-weight: 600;
      font-size: 13px;
      color: ${primaryColor};
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
      color: ${primaryColor};
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 0.02em;
      transition: opacity 0.15s;
    }
    .cai-collapsible-btn:hover { opacity: 0.8; }
    .cai-collapsible-btn svg {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      transition: transform 0.2s;
      stroke: ${primaryColor};
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
    .cai-products-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
    .cai-products-fade {
      position: absolute;
      top: 0; right: 0; bottom: 0;
      width: 40px;
      pointer-events: none;
      background: linear-gradient(to left, ${backgroundColor}, transparent);
      z-index: 1;
    }

    .cai-product-card {
      flex-shrink: 0;
      scroll-snap-align: start;
      width: 180px;
      border-radius: ${Math.max(borderRadius - 4, 8)}px;
      background: ${assistantBubbleColor};
      box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
      animation: revealCard 0.35s ease-out backwards;
      text-decoration: none;
      color: ${textColor};
      cursor: pointer;
    }
    .cai-product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08);
    }
    .cai-product-img {
      width: 100%;
      height: 110px;
      object-fit: cover;
      display: block;
    }
    .cai-product-img-placeholder {
      width: 100%;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, ${primaryColor}15, ${accentColor}12);
    }
    .cai-product-img-placeholder svg {
      width: 28px; height: 28px;
      stroke: ${textSecondaryColor};
      fill: none; stroke-width: 1;
      opacity: 0.4;
    }
    .cai-product-body {
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }
    .cai-product-brand {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: ${accentColor};
    }
    .cai-product-name {
      font-size: 13px;
      font-weight: 600;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .cai-product-desc {
      font-size: 11px;
      line-height: 1.4;
      color: ${textSecondaryColor};
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
      padding-top: 8px;
      margin-top: auto;
      border-top: 1px solid rgba(0,0,0,0.06);
    }
    .cai-product-price {
      font-size: 15px;
      font-weight: 700;
    }
    .cai-product-cta {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      background: ${config.userBubbleColor};
      color: #fff;
      white-space: nowrap;
    }
    .cai-product-cta svg { width: 10px; height: 10px; stroke: #fff; fill: none; stroke-width: 2.5; }

    /* ---- Suggested Replies ---- */
    .cai-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      animation: fadeIn 0.3s ease-out;
    }
    .cai-reply-btn {
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      border: 1.5px solid ${primaryColor}40;
      background: ${primaryColor}10;
      color: ${primaryColor};
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .cai-reply-btn:first-child {
      border-color: ${primaryColor}60;
      background: ${primaryColor}18;
      font-weight: 600;
    }
    .cai-reply-btn:hover {
      background: ${primaryColor}20;
      transform: scale(1.03);
    }
    .cai-reply-btn:active { transform: scale(0.97); }

    /* ---- Typing Indicator ---- */
    .cai-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
      background: ${assistantBubbleColor};
      border-radius: ${borderRadius}px ${borderRadius}px ${borderRadius}px 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      width: fit-content;
      border-left: 3px solid ${primaryColor}33;
    }
    .cai-typing-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: ${primaryColor};
      opacity: 0.5;
      animation: bounce 1.2s ease-in-out infinite;
    }
    .cai-typing-dot:nth-child(2) { animation-delay: 0.15s; }
    .cai-typing-dot:nth-child(3) { animation-delay: 0.3s; }

    /* ---- Input Area ---- */
    .cai-input-area {
      padding: 12px 16px;
      border-top: 1px solid rgba(0,0,0,0.06);
      background: ${backgroundColor};
      flex-shrink: 0;
    }
    .cai-input-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      background: ${assistantBubbleColor};
      border-radius: ${Math.max(borderRadius - 4, 8)}px;
      padding: 4px 4px 4px 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      border: 1.5px solid transparent;
      transition: border-color 0.15s;
    }
    .cai-input-wrap:focus-within {
      border-color: ${primaryColor}50;
    }
    .cai-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-family: ${fontFamily};
      font-size: 14px;
      color: ${textColor};
      line-height: 1.5;
      padding: 6px 0;
      min-width: 0;
    }
    .cai-input::placeholder { color: ${textSecondaryColor}; opacity: 0.6; }
    .cai-send-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: ${headerGradient};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s, opacity 0.15s;
      flex-shrink: 0;
    }
    .cai-send-btn:hover { transform: scale(1.08); }
    .cai-send-btn:active { transform: scale(0.95); }
    .cai-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    .cai-send-btn svg { width: 18px; height: 18px; stroke: #fff; fill: none; stroke-width: 2; }

    /* ---- Welcome Screen ---- */
    .cai-welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px 24px;
      gap: 16px;
      flex: 1;
    }
    .cai-welcome-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: ${primaryColor}15;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cai-welcome-icon svg { width: 32px; height: 32px; stroke: ${primaryColor}; fill: none; stroke-width: 1.5; }
    .cai-welcome-title {
      font-size: 18px;
      font-weight: 700;
      color: ${textColor};
    }
    .cai-welcome-msg {
      font-size: 14px;
      color: ${textSecondaryColor};
      line-height: 1.6;
      max-width: 280px;
    }

    /* ---- Error Banner ---- */
    .cai-error {
      margin: 0 16px;
      padding: 10px 14px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #b91c1c;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: fadeIn 0.2s ease-out;
    }
    .cai-error svg { width: 16px; height: 16px; stroke: #b91c1c; fill: none; stroke-width: 2; flex-shrink: 0; }

    /* ---- Powered By ---- */
    .cai-powered {
      padding: 8px 16px;
      text-align: center;
      flex-shrink: 0;
    }
    .cai-powered a {
      font-size: 11px;
      color: ${textSecondaryColor};
      opacity: 0.6;
      text-decoration: none;
      transition: opacity 0.15s;
    }
    .cai-powered a:hover { opacity: 1; }

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
