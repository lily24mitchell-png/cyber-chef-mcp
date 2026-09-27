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

The **CyberChef Model Context Protocol (MCP)** server provides 28 rock-solid, zero-dependency core CyberChef operations directly to autonomous coding and security agents, including **Claude Desktop**, **Cursor IDE**, **Windsurf**, and **[Strix Pentesting Framework](docs/strix-integration.md)**.

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

## 🚀 Features & Capabilities (28 Core Operations)

- **⚡ Native Recipe Execution (`cyberchef_bake`)**: Chain sequences across 28 operations with 5000ms timeout and 10MB memory safety guards.
- **🪄 Magic Mode (`cyberchef_magic`)**: Automatically detect and deobfuscate unknown payloads without prior knowledge of the encoding scheme.
- **🛡️ Enterprise Forensics & Security Primitives**:
  - `cyberchef_entropy`: Representation-calibrated Shannon entropy (Hex max 4.0 bits/char, Base64 max 6.0 bits/char, Raw max 8.0 bits/char). Reports `bitsPerChar`, `maxForAlphabet`, `normalizedRatio`, and `totalBits` to prevent false confidence on encoded ciphertext.
  - `cyberchef_analyse_hash`: Modern password hash recognition (Argon2id/i/d, scrypt, PBKDF2) with OWASP parameter audits, full bcrypt prefixes ($2$, $2a$, $2b$, $2x$, $2y$), and ranked hex confidence.
  - `cyberchef_extract_entities`: Enterprise DLP scanner. Extracts and redacts: Credit Cards (with Luhn check), US SSN, India PAN, IBAN, E.164 phone numbers, strict dual-stack IPv4 (validating 0-255 octets; rejects 999.999.999.999) and IPv6, AWS access keys, JWTs, private keys, URLs, and emails with offsets and masked previews.
  - `cyberchef_defang_url`: Scoped sanitization for URLs (host defanged, path and query parameters preserved), standalone IPv4 (`192[.]168[.]1[.]1`), and emails (`admin[at]corp[.]com`).
  - `cyberchef_from_base64` / `cyberchef_from_hex`: Structured output `{ utf8, hex, isPrintable, byteLength }` preventing undecodable mojibake on binary ciphertext and TOTP secrets.
  - `cyberchef_jwt_decode`: Parse Jose header, claims, and signature with Unix expiry conversions.
  - `cyberchef_xor` / `cyberchef_rot13`: Bitwise binary-safe encryption and Caesar rotation ciphers.
  - `cyberchef_to_base64` / `cyberchef_to_hex`, `cyberchef_url_decode` / `cyberchef_url_encode`, `cyberchef_sha256`.
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
npm test
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

## 🛠️ Available MCP Tools (17 Primary Tools)

| Tool Name | Parameters | Description |
|---|---|---|
| `cyberchef_bake` | `input` (string), `recipe` (array of op objects) | Run multi-stage sequential pipeline recipes across 28 core operations |
| `cyberchef_magic` | `input` (string) | Automatically inspects and suggests recipes for unknown payloads |
| `cyberchef_jwt_decode` | `token` (string) | Decodes JWT header, claims, and formats expiration dates |
| `cyberchef_entropy` | `input` (string) | Representation-calibrated Shannon entropy (Hex max 4.0, Base64 max 6.0, Raw max 8.0) |
| `cyberchef_analyse_hash` | `hash` (string) | Classifies modern PHC hashes (Argon2/scrypt/PBKDF2/bcrypt) with OWASP checks & ranked hex |
| `cyberchef_extract_entities` | `text` (string) | Enterprise DLP scanner (Credit Cards with Luhn, SSN, PAN, IBAN, E.164, strict IPv4/IPv6, AWS, JWT) |
| `cyberchef_defang_url` | `url` (string) | Scoped URL/host/IP/email sanitization preserving query/path decimals |
| `cyberchef_from_base64` | `input` (string), `urlSafe` (bool) | Decodes Base64 with structured output `{ utf8, hex, isPrintable, byteLength }` |
| `cyberchef_to_base64` | `input` (string), `urlSafe` (bool) | Encodes string to Base64 (standard or URL-safe) |
| `cyberchef_from_hex` | `input` (string), `delimiter` (string) | Converts hexadecimal sequences to structured output |
| `cyberchef_to_hex` | `input` (string), `delimiter` (string) | Converts string to hexadecimal byte representation |
| `cyberchef_url_decode` | `input` (string) | Decodes percent-encoded URL parameters |
| `cyberchef_url_encode` | `input` (string), `encodeAll` (bool) | Encodes characters to percent-encoded format |
| `cyberchef_rot13` | `input` (string), `amount` (number) | Applies ROT13 or custom Caesar rotation shift |
| `cyberchef_xor` | `input` (string), `key` (string), `keyFormat` (string) | Bitwise XOR cipher preserving binary data without mojibake |
| `cyberchef_sha256` | `input` (string) | Generates SHA-256 cryptographic checksum |
| `cyberchef_help` | `query` (optional string) | Searches and lists available operations from the 28-operation catalog |

---

## 💡 Example Agent Workflows

### Scenario 1: Reversing Obfuscated SQL Injection
**Prompt to Claude/Strix**:
> *"The application log caught query `?id=JyBVTklPTiBTRUxFQ1QgdXNlcm5hbWUsIHBhc3N3b3JkIEZST00gdXNlcnMtLQ==`. What is this payload doing?"*

**Agent Action**:
1. Calls `cyberchef_from_base64` on the payload.
2. Receives: `{ "utf8": "' UNION SELECT username, password FROM users--", "isPrintable": true }`.
3. Analyzes business risk: **High risk of credential database dump via SQL Injection**.

### Scenario 2: High Entropy Token Classification
**Prompt**:
> *"Analyze this suspicious Base64 string: `Khn583yd1-tfLW7dHYqBQlxHdxtM37bv7Xtnh5DK5Gc`."*

**Agent Action**:
1. Calls `cyberchef_entropy`.
2. Returns: `{ alphabet: "base64", maxForAlphabet: 6, bitsPerChar: 4.70, normalizedRatio: 0.784, verdict: "high_entropy" }`.
3. Concludes with mathematical certainty that the token is high-entropy encoded ciphertext or a CSPRNG secret.

---

## 🏛️ Part of Project Hisaar (حصار)

CyberChef MCP powers the deep analysis engine inside **Hisaar**, the grassroots bilingual AI cybersecurity platform for Pakistan. While Hisaar provides automated AST remediation and community scam protection, `cyberchef-mcp` is open-sourced as a standalone foundation for the global AI security ecosystem.

### License
Apache License 2.0. Open-sourced for security researchers and autonomous defense engineers.
