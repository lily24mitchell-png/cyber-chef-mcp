# 🍳 CyberChef MCP Server
> **Turn your AI Agents into Master Reverse Engineers & Cryptographers.**  

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![MCP Version](https://img.shields.io/badge/MCP-1.30+-green.svg)](https://modelcontextprotocol.io)
[![Node.js](https://img.shields.io/badge/Node.js-18+-orange.svg)](https://nodejs.org)
[![npm](https://img.shields.io/npm/v/@noorfatima123456/cyber-chef-mcp.svg)](https://www.npmjs.com/package/@noorfatima123456/cyber-chef-mcp)

The **CyberChef Model Context Protocol (MCP)** server exposes the power of [CyberChef (The Cyber Swiss Army Knife)](https://github.com/gchq/CyberChef) directly to autonomous coding and security agents, including **Claude Desktop**, **Cursor IDE**, **Windsurf**, and **Strix Pentesting Framework**.

Agents can dynamically bake complex multi-stage recipe pipelines (Hex -> XOR -> Base64 -> Deflate -> Regex) in a single turn without hallucinating encodings or failing on obscure binary transformations.

---

## 🚀 Features

- **⚡ Native Recipe Execution (`cyberchef_bake`)**: Chain any sequence of operations with arbitrary parameters.
- **🪄 Magic Mode (`cyberchef_magic`)**: Automatically detect and deobfuscate unknown payloads without prior knowledge of the encoding scheme.
- **🛡️ Specialized Cybersecurity Primitives**:
  - `jwt_decode`: Parse header, claims, and signature with Unix expiry conversions.
  - `entropy_calc`: Measure Shannon entropy to detect packed, obfuscated, or encrypted blobs (threshold > 7.2).
  - `defang_url`: Sanitize malicious URLs and IPs (`hxxps[://]`, `192[.]168[.]1[.]1`) before safe display.
  - `from_base64` / `to_base64`, `from_hex` / `to_hex`, `url_decode` / `url_encode`.
- **📚 Interactive Catalog (`cyberchef_help`)**: Allows agents to introspect available operations and parameter schemas dynamically on demand.

---

## 📦 Installation & Quickstart

### Option A: Run via NPX (Recommended)
```bash
npx @noorfatima123456/cyber-chef-mcp
```

### Option B: Clone & Run Locally
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
