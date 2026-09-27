---
title: CyberChef MCP Server
emoji: 🍳
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# 🍳 CyberChef MCP Server
> **Turn your AI Agents into Master Reverse Engineers & Cryptographers.**  

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![MCP Version](https://img.shields.io/badge/MCP-1.30+-green.svg)](https://modelcontextprotocol.io)
[![npm version](https://img.shields.io/npm/v/@noorfatima123456/cyber-chef-mcp.svg)](https://www.npmjs.com/package/@noorfatima123456/cyber-chef-mcp)
[![CI Tests](https://github.com/noor202401938-netizen/cyber-chef-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/noor202401938-netizen/cyber-chef-mcp/actions)
[![Azure Deployed](https://img.shields.io/badge/Azure-Live%20SSE-0078D4?logo=microsoftazure&logoColor=white)](https://cyber-chef-mcp-ehcdg4a5ebehgvc2.eastasia-01.azurewebsites.net)
[![Smithery](https://smithery.ai/badge/@noor-202401938/cyber-chef-mcp)](https://smithery.ai/server/@noor-202401938/cyber-chef-mcp)
[![Glama Score](https://glama.ai/mcp/servers/noor202401938-netizen/cyber-chef-mcp/badges/score.svg)](https://glama.ai/mcp/servers/noor202401938-netizen/cyber-chef-mcp)

The **CyberChef Model Context Protocol (MCP)** server exposes the power of [CyberChef (The Cyber Swiss Army Knife)](https://github.com/gchq/CyberChef) directly to autonomous coding and security agents, including **Claude Desktop**, **Cursor IDE**, **Windsurf**, and **[Strix Pentesting Framework](docs/strix-integration.md)**.

Agents can dynamically bake complex multi-stage recipe pipelines (Hex -> XOR -> Base64 -> Deflate -> Regex) in a single turn without hallucinating encodings or failing on obscure binary transformations.

---

## ⚡ Token Economics: Why Use CyberChef MCP?

Instead of burning thousands of output tokens having an LLM write, debug, and execute Python scripts in a sandbox, CyberChef MCP provides **instantaneous, deterministic execution** in a single tool call:

| Task | Standard LLM (Python Execution) | CyberChef MCP Tool Call | Token Savings | Latency Speedup |
|---|---|---|---|---|
| **Multi-layer Deobfuscation (Hex → XOR → B64)** | 3 turns, ~1,850 tokens, 4,200ms | **1 turn, ~28 tokens, 0.04ms** | **98.5% fewer tokens** | **105,000x faster** |
| **Shannon Entropy Calculation** | 2 turns, ~920 tokens, 2,100ms | **1 turn, ~18 tokens, 0.016ms** | **98.0% fewer tokens** | **131,250x faster** |
| **JWT Decode & Expiry Check** | 2 turns, ~750 tokens, 1,800ms | **1 turn, ~22 tokens, 0.022ms** | **97.1% fewer tokens** | **81,800x faster** |

*Run the benchmark yourself: `node benchmark.js`*

---

## 🚀 Features

- **⚡ Native Recipe Execution (`cyberchef_bake`)**: Chain any sequence of operations with arbitrary parameters.
- **🪄 Magic Mode (`cyberchef_magic`)**: Automatically detect and deobfuscate unknown payloads without prior knowledge of the encoding scheme.
- **🛡️ Specialized Cybersecurity Primitives**:
  - `cyberchef_jwt_decode`: Parse header, claims, and signature with Unix expiry conversions.
  - `cyberchef_entropy`: Measure Shannon entropy to detect packed, obfuscated, or encrypted blobs.
  - `cyberchef_defang_url`: Sanitize malicious URLs and IPs (`hxxps[://]`, `192[.]168[.]1[.]1`) before safe display.
  - `cyberchef_extract_entities`: Forensic extraction of URLs, emails, and IPv4 addresses from logs.
  - `cyberchef_xor` / `cyberchef_rot13`: Bitwise encryption and Caesar rotation ciphers.
  - `cyberchef_from_base64` / `cyberchef_to_base64`, `cyberchef_from_hex` / `cyberchef_to_hex`, `cyberchef_url_decode` / `cyberchef_url_encode`.
- **📚 Interactive Catalog (`cyberchef_help`)**: Allows agents to introspect available operations and parameter schemas dynamically on demand.

---

## 📦 Installation & Quickstart

### Option A: Install via Smithery (Recommended)
```bash
npx -y @smithery/cli install @noor-202401938/cyber-chef-mcp --client claude
```

### Option B: Zero-Install Remote SSE (Hosted on Microsoft Azure)
Connect directly to the cloud without installing anything locally:
```json
{
  "mcpServers": {
    "cyberchef": {
      "url": "https://cyber-chef-mcp-ehcdg4a5ebehgvc2.eastasia-01.azurewebsites.net/sse"
    }
  }
}
```

### Option C: Run via NPX (Local Stdio)
```bash
npx @noorfatima123456/cyber-chef-mcp
```

### Option D: Clone & Run Locally
```bash
git clone https://github.com/noor202401938-netizen/cyber-chef-mcp.git
cd cyber-chef-mcp
npm install
npm start
```

---

## 🔌 Agent Integration Configurations

### 1. Claude Desktop
Add to your `claude_desktop_config.json`:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cyberchef": {
      "command": "npx",
      "args": ["-y", "@noorfatima123456/cyber-chef-mcp"]
    }
  }
}
```

### 2. Cursor IDE
In Cursor **Settings > Features > MCP**:
- Name: `cyberchef`
- Type: `command`
- Command: `npx -y @noorfatima123456/cyber-chef-mcp`

### 3. Windsurf Cascade
Add to `~/.codeium/windsurf/mcp_config.json`:
```json
{
  "mcpServers": {
    "cyberchef": {
      "command": "npx",
      "args": ["-y", "@noorfatima123456/cyber-chef-mcp"]
    }
  }
}
```

### 4. Strix Pentesting Framework
Add to `~/.strix/mcp-servers.json` (or pass via `--mcp-config`):
```json
[
  {
    "name": "cyberchef",
    "transport": "stdio",
    "command": "npx",
    "args": ["-y", "@noorfatima123456/cyber-chef-mcp"],
    "notes": "CyberChef MCP server for multi-layer payload deobfuscation, crypto decoding, and entropy analysis."
  }
]
```

---

## 🛠️ Available MCP Tools

| Tool Name | Parameters | Description |
|---|---|---|
| `cyberchef_bake` | `input` (string), `recipe` (array of op objects) | Run multi-stage pipeline recipes (e.g. Base64 -> XOR -> Gunzip) |
| `cyberchef_magic` | `input` (string), `depth` (number, default 3) | Automatically bruteforces and decodes nested obfuscated data |
| `jwt_decode` | `token` (string) | Decodes JWT header, payload, and formats expiry timestamps |
| `entropy_calc` | `input` (string) | Calculates Shannon entropy (0.0 to 8.0) to identify encrypted payloads |
| `defang_url` | `url` (string) | Neutralizes malicious URLs/IPs for safe reporting |
| `from_base64` | `input` (string) | Decodes base64 strings |
| `to_base64` | `input` (string) | Encodes string to base64 |
| `from_hex` | `input` (string) | Converts hexadecimal sequences to plaintext |
| `to_hex` | `input` (string) | Converts plaintext string to hex |
| `url_decode` | `input` (string) | Decodes percent-encoded URL parameters |
| `cyberchef_help` | `query` (optional string) | Searches and lists available operations and usage examples |

---

## 💡 Example Agent Workflows

### Scenario 1: Reversing Obfuscated SQL Injection
**Prompt to Claude/Strix**:
> *"The application log caught query `?id=JyBVTklPTiBTRUxFQ1QgdXNlcm5hbWUsIHBhc3N3b3JkIEZST00gdXNlcnMtLQ==`. What is this payload doing?"*

**Agent Action**:
1. Calls `from_base64` on the payload.
2. Receives: `' UNION SELECT username, password FROM users--`.
3. Analyzes business risk: **High risk of credential database dump via SQL Injection**.

### Scenario 2: High Entropy Shellcode Detection
**Prompt**:
> *"Analyze this suspicious payload string found in an uploaded avatar file."*

**Agent Action**:
1. Calls `entropy_calc`. Returns `7.82` (critical anomaly > 7.2).
2. Calls `cyberchef_magic` with depth 3.
3. Unpacks XOR key `0x5A` + Gzip compression -> reveals obfuscated reverse shell binary.

---

## 🏛️ Part of Project Hisaar (حصار)

CyberChef MCP powers the deep analysis engine inside **Hisaar**, the grassroots bilingual AI cybersecurity platform for Pakistan. While Hisaar provides automated AST remediation and community scam protection, `cyberchef-mcp` is open-sourced as a standalone foundation for the global AI security ecosystem.

### License
Apache License 2.0. Open-sourced for security researchers and autonomous defense engineers.
