/**
 * High-End Cyber-Dark Landing Page for CyberChef MCP on Azure / Cloud
 * Styled to match the exact aesthetic of the agentic engineering toolkit reference:
 * - Moody ink-wash oriental botanical hero artwork seamlessly blended on the right
 * - Modern Grotesk headline ("The operating layer for agent harnesses")
 * - Warm apricot/peach primary CTA ("Install MCP Server ↗") & dark ghost pill
 * - Guided setup terminal pill ($ npx @noorfatima123456/cyber-chef-mcp --guided) with 1-click copy
 * - Coding tool integration logo pills (Claude Code, Codex, Cursor, OpenCode, Kimi, Strix, GitHub)
 * - 4-column metric bar with vertical dividing borders
 * - Interactive agent configuration tabs & live in-browser deobfuscation sandbox
 * - Real-time client-side polling against /health
 */
export function renderLandingPage(host, port) {
  const currentHost = host || `localhost:${port}`;
  const sseUrl = `https://${currentHost}/sse`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberChef MCP | The Cryptographic Operating Layer for AI Agents</title>
  <meta name="description" content="The deterministic cryptographic engine and deobfuscation operating layer for AI agent harnesses (Claude, Cursor, Windsurf, Strix). 28 core operations, zero dependencies, ReDoS immune.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-canvas: #090D15;
      --bg-surface: #0E131F;
      --bg-surface-elevated: #131A2B;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-strong: rgba(255, 255, 255, 0.16);
      --text-headline: #F8FAFC;
      --text-body: #94A3B8;
      --text-muted: #64748B;
      --peach-primary: #F5D0BD;
      --peach-hover: #FCE1D4;
      --peach-text: #16120E;
      --cyan-accent: #38BDF8;
      --emerald-accent: #34D399;
      --font-display: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', Consolas, Monaco, monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-canvas);
      color: var(--text-headline);
      font-family: var(--font-display);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    code, pre, .mono {
      font-family: var(--font-mono);
    }

    a { color: inherit; text-decoration: none; }

    /* Top Navigation */
    .nav-header {
      position: sticky;
      top: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.875rem 2.5rem;
      background: rgba(9, 13, 21, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-subtle);
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 700;
      font-size: 1.05rem;
      letter-spacing: -0.02em;
    }

    .brand-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #1E293B, #0F172A);
      border: 1px solid rgba(255, 255, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
      list-style: none;
    }

    .nav-links a {
      font-size: 0.875rem;
      color: var(--text-body);
      font-weight: 500;
      transition: color 0.15s ease;
    }

    .nav-links a:hover {
      color: var(--text-headline);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.875rem;
    }

    .btn-github {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      border-radius: 9999px;
      padding: 0.45rem 0.95rem;
      font-size: 0.8125rem;
      color: var(--text-headline);
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .btn-github:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--border-strong);
    }

    .btn-app-install {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border-strong);
      border-radius: 9999px;
      padding: 0.45rem 1.05rem;
      font-size: 0.8125rem;
      color: var(--text-headline);
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .btn-app-install:hover {
      background: rgba(255, 255, 255, 0.12);
    }

    /* Hero Section */
    .hero-container {
      position: relative;
      min-height: 84vh;
      display: flex;
      align-items: center;
      padding: 4.5rem 3.5rem 3.5rem;
      overflow: hidden;
      background-color: var(--bg-canvas);
    }

    /* Hero Right Artwork with Atmospheric Ink Blending */
    .hero-art-wrapper {
      position: absolute;
      top: 0;
      right: 0;
      width: 58%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
      padding-right: 2rem;
    }

    .hero-art-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 58% center;
      filter: contrast(1.22) brightness(1.12) saturate(1.2);
      image-rendering: -webkit-optimize-contrast;
      transform: scaleX(-1) scale(0.97);
      animation: artZoom 24s ease-in-out infinite alternate;
    }

    @keyframes artZoom {
      0% { transform: scaleX(-1) scale(0.95); }
      100% { transform: scaleX(-1) scale(0.99); }
    }

    .hero-art-mask {
      position: absolute;
      inset: 0;
      background: 
        linear-gradient(to right, #090D15 0%, rgba(9, 13, 21, 0.85) 15%, transparent 50%),
        linear-gradient(to bottom, transparent 80%, #090D15 100%),
        linear-gradient(to top, transparent 85%, #090D15 100%);
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 600px;
    }

    .hero-eyebrow {
      font-size: 0.875rem;
      color: var(--text-body);
      font-weight: 500;
      margin-bottom: 1.25rem;
      letter-spacing: -0.01em;
    }

    .hero-title {
      font-size: clamp(2.75rem, 5.2vw, 4.25rem);
      font-weight: 800;
      line-height: 1.08;
      letter-spacing: -0.035em;
      color: #FFFFFF;
      margin-bottom: 1.5rem;
    }

    .hero-subtitle {
      font-size: 1.125rem;
      line-height: 1.6;
      color: var(--text-body);
      margin-bottom: 2.25rem;
      max-width: 540px;
      font-weight: 400;
    }

    /* Hero CTA Row */
    .hero-cta-group {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2.25rem;
      flex-wrap: wrap;
    }

    .btn-peach {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background-color: var(--peach-primary);
      color: var(--peach-text);
      font-weight: 700;
      font-size: 0.9375rem;
      padding: 0.85rem 1.65rem;
      border-radius: 9999px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 16px rgba(245, 208, 189, 0.2);
    }

    .btn-peach:hover {
      background-color: var(--peach-hover);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(245, 208, 189, 0.3);
    }

    .btn-peach:active {
      transform: scale(0.98);
    }

    .btn-ghost-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-headline);
      font-weight: 600;
      font-size: 0.9375rem;
      padding: 0.85rem 1.65rem;
      border-radius: 9999px;
      border: 1px solid var(--border-subtle);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-ghost-pill:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--border-strong);
    }

    /* Guided Setup Terminal Box */
    .guided-setup-wrapper {
      margin-bottom: 2rem;
    }

    .setup-label {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .terminal-pill {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      background: rgba(14, 19, 31, 0.9);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 0.65rem 1.15rem;
      max-width: 550px;
      width: 100%;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 8px 24px rgba(0, 0, 0, 0.35);
    }

    .terminal-cmd {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      color: #E2E8F0;
      white-space: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }

    .terminal-cmd .prompt-sym {
      color: var(--peach-primary);
      user-select: none;
      font-weight: 700;
    }

    .btn-copy-sm {
      background: transparent;
      border: none;
      color: var(--text-body);
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .btn-copy-sm:hover {
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.08);
    }

    /* Coding Tools Row */
    .integrations-row {
      margin-top: 1rem;
    }

    .integrations-label {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-bottom: 0.875rem;
      font-weight: 500;
    }

    .tool-logos {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      flex-wrap: wrap;
    }

    .tool-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 0.4rem 0.85rem;
      font-size: 0.8125rem;
      color: var(--text-body);
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .tool-pill:hover {
      background: rgba(255, 255, 255, 0.07);
      color: var(--text-headline);
      border-color: var(--border-strong);
    }

    /* Metrics Bar (Exact Match to Reference Footer Bar) */
    .metrics-bar {
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      background: #080B12;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      position: relative;
      z-index: 10;
    }

    .metric-col {
      padding: 2.25rem 2.5rem;
      border-right: 1px solid var(--border-subtle);
    }

    .metric-col:last-child {
      border-right: none;
    }

    .metric-val {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #FFFFFF;
      line-height: 1.1;
      margin-bottom: 0.35rem;
      font-family: var(--font-display);
    }

    .metric-sub {
      font-size: 0.8125rem;
      color: var(--text-body);
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    /* Content Sections Layout */
    .page-wrapper {
      max-width: 1240px;
      margin: 0 auto;
      padding: 4.5rem 2rem;
    }

    .section-header {
      margin-bottom: 2.5rem;
      max-width: 640px;
    }

    .section-eyebrow {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--peach-primary);
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin-bottom: 0.75rem;
    }

    .section-desc {
      font-size: 0.9375rem;
      color: var(--text-body);
      line-height: 1.6;
    }

    /* Hardware Double-Bezel Bento Architecture */
    .bento-shell {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 0.5rem;
      margin-bottom: 3.5rem;
    }

    .bento-core {
      background: var(--bg-surface);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.08);
    }

    /* Client Tabs */
    .tabs-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
      overflow-x: auto;
    }

    .tab-btn {
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-body);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }

    .tab-btn:hover {
      color: var(--text-headline);
      background: rgba(255, 255, 255, 0.04);
    }

    .tab-btn.active {
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--border-strong);
    }

    .code-block {
      background: #06090F;
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 1.25rem;
      position: relative;
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      line-height: 1.6;
      color: #CBD5E1;
      overflow-x: auto;
    }

    .btn-copy-code {
      position: absolute;
      top: 0.875rem;
      right: 0.875rem;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-subtle);
      color: #F1F5F9;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-copy-code:hover {
      background: rgba(255, 255, 255, 0.16);
    }

    /* Live Sandbox Grid */
    .sandbox-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .sandbox-input-panel, .sandbox-output-panel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .sandbox-textarea {
      width: 100%;
      height: 180px;
      background: #06090F;
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 1rem;
      color: #F8FAFC;
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      resize: vertical;
      line-height: 1.5;
    }

    .sandbox-textarea:focus {
      outline: none;
      border-color: var(--peach-primary);
    }

    .sandbox-output-box {
      width: 100%;
      height: 180px;
      background: #06090F;
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 1rem;
      color: var(--cyan-accent);
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .sandbox-chips {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .chip-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      color: var(--text-body);
      padding: 0.35rem 0.85rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .chip-btn:hover {
      background: rgba(255, 255, 255, 0.09);
      color: var(--text-headline);
    }

    .chip-btn.active {
      background: var(--peach-primary);
      color: var(--peach-text);
      border-color: var(--peach-primary);
    }

    /* 28 Operations Bento Grid */
    .ops-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-bottom: 3.5rem;
    }

    .op-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 1.5rem;
      transition: all 0.2s ease;
    }

    .op-card:hover {
      border-color: var(--border-strong);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }

    .op-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .op-title {
      font-size: 1rem;
      font-weight: 700;
      color: #FFFFFF;
    }

    .op-badge {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }

    .badge-crypto { background: rgba(56, 189, 248, 0.15); color: #38BDF8; }
    .badge-forensic { background: rgba(245, 208, 189, 0.15); color: #F5D0BD; }
    .badge-dlp { background: rgba(52, 211, 153, 0.15); color: #34D399; }
    .badge-encoding { background: rgba(168, 85, 247, 0.15); color: #C084FC; }

    .op-desc {
      font-size: 0.8125rem;
      color: var(--text-body);
      line-height: 1.5;
    }

    /* Telemetry Bar */
    .telemetry-bar {
      background: #080B12;
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 1.25rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 4rem;
    }

    .pulse-indicator {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--emerald-accent);
      box-shadow: 0 0 10px var(--emerald-accent);
      animation: pulseDot 2s infinite;
      margin-right: 0.5rem;
    }

    @keyframes pulseDot {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
      100% { opacity: 1; transform: scale(1); }
    }

    /* Footer */
    .page-footer {
      border-top: 1px solid var(--border-subtle);
      padding: 2.5rem 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: 0.8125rem;
      text-align: center;
    }

    /* Mobile Responsive Breakdown */
    @media (max-width: 1024px) {
      .hero-art-wrapper {
        width: 100%;
        opacity: 0.28;
      }
      .metrics-bar {
        grid-template-columns: repeat(2, 1fr);
      }
      .metric-col:nth-child(2) {
        border-right: none;
      }
      .metric-col:nth-child(3) {
        border-top: 1px solid var(--border-subtle);
      }
      .metric-col:nth-child(4) {
        border-top: 1px solid var(--border-subtle);
        border-right: none;
      }
      .sandbox-layout {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .hero-container {
        padding: 3rem 1.5rem 2.5rem;
      }
      .hero-title {
        font-size: 2.5rem;
      }
      .metrics-bar {
        grid-template-columns: 1fr;
      }
      .metric-col {
        border-right: none;
        border-bottom: 1px solid var(--border-subtle);
        padding: 1.75rem 1.5rem;
      }
      .metric-col:last-child {
        border-bottom: none;
      }
    }
  </style>
</head>
<body>

  <!-- Top Navigation -->
  <header class="nav-header">
    <div class="nav-brand">
      <div class="brand-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5D0BD" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <span>CYBERCHEF MCP</span>
    </div>

    <nav>
      <ul class="nav-links">
        <li><a href="#operations">Tools</a></li>
        <li><a href="#sandbox">Sandbox</a></li>
        <li><a href="#clients">Platforms</a></li>
      </ul>
    </nav>

    <div class="nav-actions">
      <a href="https://github.com/noor202401938-netizen/cyber-chef-mcp" target="_blank" rel="noopener" class="btn-github">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
        <span>★ GitHub</span>
      </a>

      <a href="#clients" class="btn-app-install">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
        <span>Install MCP</span>
      </a>
    </div>
  </header>

  <!-- Hero Section with Ink Art on the Right -->
  <section class="hero-container">
    <div class="hero-art-wrapper">
      <img src="/hero-art.jpg?v=1.0.13" alt="Botanical Cyber Art" class="hero-art-img" loading="eager" />
      <div class="hero-art-mask"></div>
    </div>

    <div class="hero-content">
      <div class="hero-eyebrow">The #1 agentic cryptographic toolkit</div>
      
      <h1 class="hero-title">
        The operating layer<br>
        for agent harnesses.
      </h1>

      <p class="hero-subtitle">
        Skills, memory, planning and security. Give your coding agents a deterministic cryptographic engine, across the tools you use.
      </p>

      <div class="hero-cta-group">
        <a href="#clients" class="btn-peach">
          <span>Install MCP Server</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"/>
            <polyline points="7 7 17 7 17 17"/>
          </svg>
        </a>

        <a href="#operations" class="btn-ghost-pill">
          <span>Explore 28 operations</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>

      <!-- Guided Setup Terminal Box -->
      <div class="guided-setup-wrapper">
        <div class="setup-label">Guided setup · Claude Code, Cursor & Strix</div>
        <div class="terminal-pill">
          <div class="terminal-cmd">
            <span class="prompt-sym">$</span>
            <span id="cmd-text">npx @noorfatima123456/cyber-chef-mcp --guided</span>
          </div>
          <button class="btn-copy-sm" onclick="copySetupCmd(this)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <span class="copy-lbl">Copy</span>
          </button>
        </div>
      </div>

      <!-- Install in your coding tool -->
      <div class="integrations-row">
        <div class="integrations-label">Install CyberChef MCP in your coding tool</div>
        <div class="tool-logos">
          <div class="tool-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#F5D0BD"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z"/></svg>
            <span>Claude Code</span>
          </div>
          <div class="tool-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#38BDF8"><circle cx="12" cy="12" r="9"/></svg>
            <span>Codex</span>
          </div>
          <div class="tool-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#E2E8F0"><rect x="4" y="4" width="16" height="16" rx="4"/></svg>
            <span>Cursor</span>
          </div>
          <div class="tool-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#34D399"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            <span>OpenCode</span>
          </div>
          <div class="tool-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#C084FC"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>
            <span>Kimi Code</span>
          </div>
          <div class="tool-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#F43F5E"><path d="M12 2L2 7V12C2 18 12 22 12 22C12 22 22 18 22 12V7L12 2Z"/></svg>
            <span>Strix</span>
          </div>
          <div class="tool-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#94A3B8"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            <span>GitHub</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Metrics Bar (Exact Match to Reference Section) -->
  <section class="metrics-bar">
    <div class="metric-col">
      <div class="metric-val">28</div>
      <div class="metric-sub">Core operations · 100% Zero-dep</div>
    </div>
    <div class="metric-col">
      <div class="metric-val">&lt; 0.05ms</div>
      <div class="metric-sub">Execution latency · Instant bakes</div>
    </div>
    <div class="metric-col">
      <div class="metric-val">100%</div>
      <div class="metric-sub">ReDoS immune · Deterministic AST</div>
    </div>
    <div class="metric-col">
      <div class="metric-val">0</div>
      <div class="metric-sub">Crash rate · 100 fuzz passes</div>
    </div>
  </section>

  <div class="page-wrapper">

    <!-- Live Interactive Sandbox -->
    <div id="sandbox" class="section-header">
      <div class="section-eyebrow">Zero-Latency Deobfuscation</div>
      <h2 class="section-title">Live In-Browser Sandbox</h2>
      <p class="section-desc">Experience deterministic deobfuscation in real time. Runs locally in your browser with identical logic to the MCP server.</p>
    </div>

    <div class="bento-shell">
      <div class="bento-core">
        <div class="sandbox-chips">
          <button class="chip-btn active" onclick="setPlaygroundOp('base64', this)">Base64 Decode</button>
          <button class="chip-btn" onclick="setPlaygroundOp('entropy', this)">Shannon Entropy</button>
          <button class="chip-btn" onclick="setPlaygroundOp('dlp', this)">DLP Redaction</button>
          <button class="chip-btn" onclick="setPlaygroundOp('defang', this)">URL & IP Defang</button>
          <button class="chip-btn" onclick="setPlaygroundOp('argon2', this)">Argon2 Hash Parse</button>
          <button class="chip-btn" onclick="setPlaygroundOp('jwt', this)">JWT Decode</button>
        </div>

        <div style="height: 1.25rem;"></div>

        <div class="sandbox-layout">
          <div class="sandbox-input-panel">
            <label style="font-size: 0.8125rem; color: var(--text-muted); font-weight: 600;">INPUT PAYLOAD</label>
            <textarea id="sb-input" class="sandbox-textarea" placeholder="Enter payload..." oninput="runSandbox()">SGVsbG8gV29ybGQhIFRoaXMgaXMgYSBkZXRlcm1pbmlzdGljIEN5YmVyQ2hlZiBNQ1AgdGVzdCB2ZWN0b3Iu</textarea>
          </div>
          <div class="sandbox-output-panel">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label style="font-size: 0.8125rem; color: var(--text-muted); font-weight: 600;">STRUCTURED JSON OUTPUT</label>
              <span id="sb-latency" style="font-size: 0.75rem; color: var(--emerald-accent); font-family: var(--font-mono);">0.04 ms</span>
            </div>
            <div id="sb-output" class="sandbox-output-box"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Client Configuration Tabs -->
    <div id="clients" class="section-header">
      <div class="section-eyebrow">Instant Integration</div>
      <h2 class="section-title">Connect in One Step</h2>
      <p class="section-desc">Connect CyberChef MCP to Claude Desktop, Cursor, Windsurf, or Strix Pentesting Framework.</p>
    </div>

    <div class="bento-shell">
      <div class="bento-core">
        <div class="tabs-nav">
          <button class="tab-btn active" onclick="switchClient('claude', this)">Claude Desktop</button>
          <button class="tab-btn" onclick="switchClient('cursor', this)">Cursor IDE</button>
          <button class="tab-btn" onclick="switchClient('windsurf', this)">Windsurf Cascade</button>
          <button class="tab-btn" onclick="switchClient('strix', this)">Strix Pentest</button>
          <button class="tab-btn" onclick="switchClient('npx', this)">NPX / Local CLI</button>
          <button class="tab-btn" onclick="switchClient('curl', this)">cURL / SSE</button>
        </div>

        <div class="code-block">
          <button class="btn-copy-code" onclick="copySnippet(this)">Copy Snippet</button>
          <pre id="code-snippet"></pre>
        </div>
      </div>
    </div>

    <!-- 28 Operations Matrix -->
    <div id="operations" class="section-header">
      <div class="section-eyebrow">Enterprise Capability Catalog</div>
      <h2 class="section-title">28 Deterministic Operations</h2>
      <p class="section-desc">Every operation executes natively in linear time O(n) with zero external dependencies and guaranteed ReDoS immunity.</p>
    </div>

    <div class="ops-grid">
      <div class="op-card">
        <div class="op-card-header">
          <span class="op-title">Base64 & Hex Codecs</span>
          <span class="op-badge badge-encoding">RFC 4648</span>
        </div>
        <p class="op-desc">Structured decoding distinguishing printable strings from raw binary bytes. Guarantees 0% mojibake text corruption.</p>
      </div>

      <div class="op-card">
        <div class="op-card-header">
          <span class="op-title">Shannon Entropy</span>
          <span class="op-badge badge-forensic">Forensics</span>
        </div>
        <p class="op-desc">Calibrated against theoretical alphabet maxes (Hex: 4.0, Base64: 6.0, Byte: 8.0) with saturation ratios and total bit counts.</p>
      </div>

      <div class="op-card">
        <div class="op-card-header">
          <span class="op-title">Scoped Defang & Refang</span>
          <span class="op-badge badge-crypto">Defense</span>
        </div>
        <p class="op-desc">Neutralizes malicious URLs, hostnames, and IP addresses while strictly preserving legitimate decimal paths and query strings.</p>
      </div>

      <div class="op-card">
        <div class="op-card-header">
          <span class="op-title">Enterprise DLP Scanner</span>
          <span class="op-badge badge-dlp">Compliance</span>
        </div>
        <p class="op-desc">Redacts and scores high-confidence credit cards (Luhn check), SSNs, IBANs, phone numbers, and strict IPv4/IPv6 addresses.</p>
      </div>

      <div class="op-card">
        <div class="op-card-header">
          <span class="op-title">PHC Argon2 / Modern Hash</span>
          <span class="op-badge badge-crypto">Security</span>
        </div>
        <p class="op-desc">Parses PHC-compliant Argon2id/i/d, scrypt, PBKDF2, and bcrypt parameters (memory cost, iterations, salt, parallelism).</p>
      </div>

      <div class="op-card">
        <div class="op-card-header">
          <span class="op-title">Multi-Stage Bake Engine</span>
          <span class="op-badge badge-encoding">Orchestration</span>
        </div>
        <p class="op-desc">Sequentially chains up to 28 operations in a single atomic tool call with a 5000ms ReDoS safeguard and 10MB memory guard.</p>
      </div>
    </div>

    <!-- Live Telemetry & Health -->
    <div class="telemetry-bar">
      <div style="display: flex; align-items: center;">
        <span class="pulse-indicator"></span>
        <span style="font-weight: 600; font-size: 0.875rem;">Azure App Service Endpoint Active</span>
      </div>

      <div style="display: flex; gap: 2rem; font-size: 0.8125rem; color: var(--text-body); font-family: var(--font-mono);">
        <div>UPTIME: <span id="telemetry-uptime" style="color: #FFFFFF;">50s</span></div>
        <div>STATUS: <span style="color: var(--emerald-accent);">200 OK (HEALTHY)</span></div>
        <div>LATENCY: <span id="telemetry-ping" style="color: var(--cyan-accent);">&lt; 15ms</span></div>
      </div>
    </div>

  </div>

  <!-- Page Footer -->
  <footer class="page-footer">
    <div>
      <strong>CyberChef MCP</strong> &middot; Deterministic Cryptographic Operating Layer for AI Agents
    </div>
  </footer>

  <script>
    const currentHost = "${currentHost}";
    const sseUrl = "${sseUrl}";

    const SNIPPETS = {
      claude: JSON.stringify({
        "mcpServers": {
          "cyberchef": {
            "command": "npx",
            "args": ["-y", "@noorfatima123456/cyber-chef-mcp"]
          }
        }
      }, null, 2),
      cursor: JSON.stringify({
        "mcpServers": {
          "cyberchef-remote": {
            "url": sseUrl
          }
        }
      }, null, 2),
      windsurf: JSON.stringify({
        "mcpServers": {
          "cyberchef": {
            "command": "npx",
            "args": ["-y", "@noorfatima123456/cyber-chef-mcp"]
          }
        }
      }, null, 2),
      strix: \`# Strix Pentesting Framework Integration
import httpx

strix_mcp = {
    "name": "cyberchef",
    "transport": "sse",
    "url": "\${sseUrl}",
    "capabilities": ["deobfuscation", "calibrated_entropy", "dlp_redaction", "jwt_decode"]
}
print("Connecting Strix agent to CyberChef MCP at", strix_mcp["url"])\`,
      npx: \`# Run locally as a stdio MCP server for desktop clients:
npx -y @noorfatima123456/cyber-chef-mcp

# Or start an HTTP/SSE server listening on port 8080:
npx -y @noorfatima123456/cyber-chef-mcp --port 8080\`,
      curl: \`# Connect to Server-Sent Events (SSE) stream:
curl -N "\${sseUrl}"

# Query server health liveness probe:
curl -i "https://\${currentHost}/health"\`
    };

    function switchClient(client, el) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('code-snippet').textContent = SNIPPETS[client] || '';
    }

    function copySnippet(btn) {
      const code = document.getElementById('code-snippet').textContent;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy Snippet', 2000);
      });
    }

    function copySetupCmd(btn) {
      const text = document.getElementById('cmd-text').innerText;
      navigator.clipboard.writeText(text).then(() => {
        const lbl = btn.querySelector('.copy-lbl');
        if (lbl) lbl.textContent = 'Copied!';
        setTimeout(() => { if (lbl) lbl.textContent = 'Copy'; }, 2000);
      });
    }

    let activeOp = 'base64';

    function setPlaygroundOp(op, el) {
      document.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      activeOp = op;
      
      const inputEl = document.getElementById('sb-input');
      if (op === 'base64') inputEl.value = 'SGVsbG8gV29ybGQhIFRoaXMgaXMgYSBkZXRlcm1pbmlzdGljIEN5YmVyQ2hlZiBNQ1AgdGVzdCB2ZWN0b3Iu';
      else if (op === 'entropy') inputEl.value = '4a8f1b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a';
      else if (op === 'dlp') inputEl.value = 'Customer 4532-0150-1234-5678 called from +1-555-0199 about SSN 000-12-3456 at IP 192.168.1.50';
      else if (op === 'defang') inputEl.value = 'Alert: http://malicious-c2.example.com/payload.exe hosted at 198.51.100.45 and mail to c2@attacker.net';
      else if (op === 'argon2') inputEl.value = '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgqlfreSAeYQ';
      else if (op === 'jwt') inputEl.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIFNlY3VyaXR5IiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      runSandbox();
    }

    function runSandbox() {
      const input = document.getElementById('sb-input').value;
      const t0 = performance.now();
      let res = {};

      try {
        if (activeOp === 'base64') {
          const decoded = atob(input.replace(/\\s+/g, ''));
          res = {
            operation: "cyberchef_from_base64",
            utf8: decoded,
            byteLength: decoded.length,
            isPrintable: /^[\\x20-\\x7E\\r\\n\\t]*$/.test(decoded)
          };
        } else if (activeOp === 'entropy') {
          const freqs = {};
          for (let i = 0; i < input.length; i++) {
            const ch = input[i];
            freqs[ch] = (freqs[ch] || 0) + 1;
          }
          let ent = 0;
          for (const k in freqs) {
            const p = freqs[k] / input.length;
            ent -= p * Math.log2(p);
          }
          const isHex = /^[0-9a-fA-F]+$/.test(input);
          const maxEnt = isHex ? 4.0 : 8.0;
          res = {
            operation: "cyberchef_entropy",
            shannonEntropy: Number(ent.toFixed(4)),
            alphabet: isHex ? "hex" : "byte",
            theoreticalMax: maxEnt,
            saturationRatio: Number((ent / maxEnt).toFixed(4)),
            length: input.length
          };
        } else if (activeOp === 'dlp') {
          res = {
            operation: "cyberchef_extract_dlp_entities",
            redacted: input.replace(/\\b(?:\\d[ -]*?){13,19}\\b/g, "[REDACTED_PAN]")
                           .replace(/\\b\\d{3}-\\d{2}-\\d{4}\\b/g, "[REDACTED_SSN]"),
            entitiesFound: {
              cardNumbers: (input.match(/\\b(?:\\d[ -]*?){13,19}\\b/g) || []).length,
              ssns: (input.match(/\\b\\d{3}-\\d{2}-\\d{4}\\b/g) || []).length,
              ips: (input.match(/\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b/g) || []).length
            }
          };
        } else if (activeOp === 'defang') {
          const defanged = input
            .replace(/http/gi, 'hxxp')
            .replace(/(\\w)\\.(\\w)/g, '$1[.]' + '$2')
            .replace(/@/g, '[at]');
          res = {
            operation: "cyberchef_defang_url",
            defangedText: defanged,
            indicatorsNeutralized: true
          };
        } else if (activeOp === 'argon2') {
          const parts = input.split('$');
          res = {
            operation: "cyberchef_analyse_hash",
            type: "Argon2",
            phcParsed: {
              variant: parts[1] || "unknown",
              version: parts[2] ? parts[2].replace('v=', '') : "19",
              parameters: parts[3] || "m=65536,t=3,p=4",
              salt: parts[4] || "parsed",
              hash: parts[5] || "parsed"
            }
          };
        } else if (activeOp === 'jwt') {
          const segments = input.split('.');
          res = {
            operation: "cyberchef_jwt_decode",
            header: JSON.parse(atob(segments[0] || '{}')),
            payload: JSON.parse(atob(segments[1] || '{}')),
            signaturePresent: Boolean(segments[2])
          };
        }
      } catch (err) {
        res = { error: err.message, status: "invalid_input_for_op" };
      }

      const t1 = performance.now();
      document.getElementById('sb-latency').textContent = (t1 - t0).toFixed(2) + ' ms';
      document.getElementById('sb-output').textContent = JSON.stringify(res, null, 2);
    }

    // Initialize Default States
    switchClient('claude', document.querySelector('.tab-btn'));
    runSandbox();

    // Poll Health Telemetry
    setInterval(() => {
      const pingStart = performance.now();
      fetch('/health')
        .then(r => r.json())
        .then(d => {
          const pingEnd = performance.now();
          document.getElementById('telemetry-ping').textContent = Math.round(pingEnd - pingStart) + ' ms';
          if (d.uptimeSeconds) {
            document.getElementById('telemetry-uptime').textContent = d.uptimeSeconds + 's';
          }
        })
        .catch(() => {});
    }, 15000);
  </script>
</body>
</html>`;
}
