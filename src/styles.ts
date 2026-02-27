import type { CurateAIWidgetConfig } from './types';

export function buildStyles(config: CurateAIWidgetConfig): string {
  const { primaryColor, backgroundColor, assistantBubbleColor, textColor, textSecondaryColor, fontFamily, borderRadius, bubbleSize } = config;

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
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes tealGlow {
      0%, 100% { box-shadow: 0 0 8px rgba(16,185,129,0.4); }
      50% { box-shadow: 0 0 16px rgba(16,185,129,0.6); }
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
      background: linear-gradient(135deg, #10b981, #059669);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(16,185,129,0.3), 0 2px 8px rgba(0,0,0,0.3);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      animation: bounceIn 0.4s ease-out;
      position: relative;
    }
    .cai-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(16,185,129,0.4), 0 2px 12px rgba(0,0,0,0.3);
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
      background-image: radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 60%);
      box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08);
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
      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      color: #fff;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .cai-header-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${primaryColor};
      flex-shrink: 0;
      animation: tealGlow 2s ease-in-out infinite;
    }
    .cai-header-icon {
      display: none;
    }
    .cai-header-text { flex: 1; min-width: 0; }
    .cai-header-title {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #fff;
    }
    .cai-header-subtitle {
      font-size: 12px;
      color: ${textSecondaryColor};
      margin-top: 2px;
    }
    .cai-header-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    .cai-header-close:hover { background: rgba(255,255,255,0.15); }
    .cai-header-close svg { width: 16px; height: 16px; stroke: #fff; fill: none; stroke-width: 2.5; }

    /* ---- Message List ---- */
    .cai-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      scroll-behavior: smooth;
    }
    .cai-messages::-webkit-scrollbar { width: 5px; }
    .cai-messages::-webkit-scrollbar-track { background: transparent; }
    .cai-messages::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.2); border-radius: 10px; }
    .cai-messages::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.35); }

    /* ---- Message Bubbles ---- */
    .cai-msg {
      display: flex;
      flex-direction: column;
      gap: 8px;
      animation: fadeIn 0.25s ease-out;
    }
    .cai-msg-user { align-items: flex-end; }
    .cai-msg-assistant { align-items: flex-start; }

    .cai-msg-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: ${textSecondaryColor};
      margin-bottom: -4px;
      padding: 0 4px;
    }

    .cai-bubble-wrap {
      max-width: 85%;
      padding: 12px 16px;
      font-size: 14px;
      line-height: 1.6;
      word-break: break-word;
    }
    .cai-msg-user .cai-bubble-wrap {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff;
      border-radius: 18px 18px 4px 18px;
    }
    .cai-msg-assistant .cai-bubble-wrap {
      background: ${assistantBubbleColor};
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: ${textColor};
      border-radius: 18px 18px 18px 4px;
      border: 1px solid rgba(255,255,255,0.08);
      border-left: 3px solid rgba(16,185,129,0.4);
    }

    /* ---- Markdown Styles ---- */
    .cai-md p { margin-bottom: 10px; }
    .cai-md p:last-child { margin-bottom: 0; }
    .cai-md strong { font-weight: 600; color: #f1f5f9; }
    .cai-md em { font-style: italic; }
    .cai-md a { color: ${primaryColor}; text-decoration: underline; }
    .cai-md a:hover { opacity: 0.8; }
    .cai-md code {
      background: rgba(255,255,255,0.08);
      padding: 1px 5px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9em;
      color: ${primaryColor};
    }
    .cai-md ul, .cai-md ol { padding-left: 20px; margin-bottom: 10px; }
    .cai-md li { margin-bottom: 4px; }
    .cai-md h1, .cai-md h2, .cai-md h3 {
      color: ${primaryColor};
      font-weight: 700;
      letter-spacing: -0.01em;
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
    .cai-products-scroll::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.2); border-radius: 10px; }
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
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.08);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
      animation: revealCard 0.35s ease-out backwards;
      text-decoration: none;
      color: ${textColor};
      cursor: pointer;
    }
    .cai-product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(16,185,129,0.15), 0 2px 8px rgba(0,0,0,0.3);
      border-color: rgba(16,185,129,0.2);
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
      background: rgba(16,185,129,0.08);
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
      color: ${primaryColor};
    }
    .cai-product-name {
      font-size: 13px;
      font-weight: 600;
      line-height: 1.3;
      color: #f1f5f9;
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
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .cai-product-price {
      font-size: 15px;
      font-weight: 700;
      color: #f1f5f9;
    }
    .cai-product-cta {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      background: linear-gradient(135deg, #10b981, #059669);
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
      border: 1px solid rgba(16,185,129,0.2);
      background: rgba(16,185,129,0.06);
      color: ${primaryColor};
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .cai-reply-btn:first-child {
      border-color: rgba(16,185,129,0.35);
      background: rgba(16,185,129,0.1);
      font-weight: 600;
    }
    .cai-reply-btn:hover {
      background: rgba(16,185,129,0.15);
      border-color: rgba(16,185,129,0.4);
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
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-radius: 18px 18px 18px 4px;
      border: 1px solid rgba(255,255,255,0.08);
      border-left: 3px solid rgba(16,185,129,0.4);
      width: fit-content;
    }
    .cai-typing-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: ${primaryColor};
      opacity: 0.6;
      animation: bounce 1.2s ease-in-out infinite;
    }
    .cai-typing-dot:nth-child(2) { animation-delay: 0.15s; }
    .cai-typing-dot:nth-child(3) { animation-delay: 0.3s; }

    /* ---- Input Area ---- */
    .cai-input-area {
      padding: 12px 16px;
      border-top: 1px solid rgba(255,255,255,0.06);
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      flex-shrink: 0;
    }
    .cai-input-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.06);
      border-radius: ${Math.max(borderRadius - 4, 8)}px;
      padding: 4px 4px 4px 14px;
      border: 1px solid rgba(255,255,255,0.08);
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .cai-input-wrap:focus-within {
      border-color: rgba(16,185,129,0.4);
      box-shadow: 0 0 0 2px rgba(16,185,129,0.1);
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
      background: linear-gradient(135deg, #10b981, #059669);
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
    .cai-send-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }
    .cai-send-btn svg { width: 18px; height: 18px; stroke: #fff; fill: none; stroke-width: 2; }

    /* ---- Welcome Screen ---- */
    .cai-welcome {
      display: flex;
      flex-direction: column;
      padding: 32px 20px;
      gap: 8px;
      flex: 1;
      overflow-y: auto;
    }
    .cai-welcome-title {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #fff;
      line-height: 1.1;
    }
    .cai-welcome-msg {
      font-size: 15px;
      color: ${textSecondaryColor};
      line-height: 1.5;
      margin-bottom: 16px;
    }
    .cai-welcome-icon { display: none; }

    .cai-topic-cards {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .cai-topic-card {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 16px;
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
      width: 100%;
      font-family: ${fontFamily};
      color: ${textColor};
    }
    .cai-topic-card:hover {
      background: rgba(255,255,255,0.08);
      border-color: rgba(16,185,129,0.3);
      transform: translateY(-1px);
    }
    .cai-topic-card:active { transform: scale(0.98); }
    .cai-topic-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: rgba(16,185,129,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .cai-topic-icon svg {
      width: 20px;
      height: 20px;
      stroke: ${primaryColor};
      fill: none;
      stroke-width: 1.5;
    }
    .cai-topic-text { flex: 1; min-width: 0; }
    .cai-topic-title {
      font-size: 14px;
      font-weight: 600;
      color: #f1f5f9;
      margin-bottom: 2px;
    }
    .cai-topic-desc {
      font-size: 12px;
      color: ${textSecondaryColor};
      line-height: 1.4;
    }

    /* ---- Error Banner ---- */
    .cai-error {
      margin: 0 16px;
      padding: 10px 14px;
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.2);
      border-radius: 8px;
      color: #fca5a5;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: fadeIn 0.2s ease-out;
    }
    .cai-error svg { width: 16px; height: 16px; stroke: #fca5a5; fill: none; stroke-width: 2; flex-shrink: 0; }

    /* ---- Powered By ---- */
    .cai-powered {
      padding: 8px 16px;
      text-align: center;
      flex-shrink: 0;
    }
    .cai-powered a {
      font-size: 11px;
      color: ${textSecondaryColor};
      opacity: 0.4;
      text-decoration: none;
      transition: opacity 0.15s;
    }
    .cai-powered a:hover { opacity: 0.8; }

    /* ---- Login Screen ---- */
    .cai-login {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 32px 24px 24px;
      overflow-y: auto;
    }
    .cai-login-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .cai-login-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(16,185,129,0.12);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .cai-login-icon svg {
      width: 28px;
      height: 28px;
      stroke: ${primaryColor};
      fill: none;
      stroke-width: 1.5;
    }
    .cai-login-title {
      font-size: 20px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 6px;
      letter-spacing: -0.02em;
    }
    .cai-login-subtitle {
      font-size: 13px;
      color: ${textSecondaryColor};
      line-height: 1.5;
    }
    .cai-login-tabs {
      display: flex;
      gap: 4px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 3px;
      margin-bottom: 20px;
    }
    .cai-login-tab {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 8px;
      background: transparent;
      font-family: ${fontFamily};
      font-size: 13px;
      font-weight: 600;
      color: ${textSecondaryColor};
      cursor: pointer;
      transition: all 0.15s;
    }
    .cai-login-tab.cai-active {
      background: rgba(16,185,129,0.15);
      color: ${primaryColor};
      box-shadow: none;
    }
    .cai-login-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cai-login-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      font-family: ${fontFamily};
      font-size: 14px;
      color: ${textColor};
      background: rgba(255,255,255,0.05);
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .cai-login-input:focus {
      border-color: rgba(16,185,129,0.5);
      box-shadow: 0 0 0 2px rgba(16,185,129,0.1);
    }
    .cai-login-input::placeholder {
      color: ${textSecondaryColor};
      opacity: 0.6;
    }
    .cai-login-btn {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff;
      font-family: ${fontFamily};
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.15s;
      margin-top: 4px;
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
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.2);
      border-radius: 8px;
      color: #fca5a5;
      font-size: 13px;
      margin-bottom: 16px;
      line-height: 1.4;
    }

    /* ---- Header Sign Out ---- */
    .cai-header-signout {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    .cai-header-signout:hover { background: rgba(255,255,255,0.15); }
    .cai-header-signout svg { width: 16px; height: 16px; stroke: #fff; fill: none; stroke-width: 2; }

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
