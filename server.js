import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import http from "node:http";
import { readFileSync } from "node:fs";
import { z } from "zod";
import { CyberChefEngine } from "./utils/cyberchef-runner.js";
import { BuiltinChef } from "./utils/builtin-chef.js";

// Initialize CyberChef MCP Server
const server = new McpServer({
  name: "cyberchef-mcp",
  version: "1.0.2"
});

// Tool 1: Universal Recipe Runner (Bake)
server.tool(
  "cyberchef_bake",
  "Executes a multi-stage sequential data transformation pipeline ('recipe') on the input string, chaining multiple operations such as Base64, Hex, URL decoding, XOR, ROT13, and hashing in a single turn. Use this tool when dealing with layered obfuscation or when an automated pipeline is needed to fully unwrap nested attack payloads without requiring multiple LLM conversational rounds.",
  {
    input: z.string().describe("The raw, encoded, or obfuscated input string to process through the transformation pipeline. Can be plain text, hex-encoded bytes, Base64 strings, or URL-encoded parameters."),
    recipe: z.array(
      z.object({
        op: z.string().describe("The canonical name of the CyberChef operation to apply. Supported operations include: 'From Base64', 'To Base64', 'From Hex', 'To Hex', 'URL Decode', 'URL Encode', 'XOR', 'ROT13', 'MD5', 'SHA256', 'Defang URL', 'Refang URL', 'Entropy', 'Extract URLs', 'Extract Emails'."),
        args: z.array(z.any()).optional().describe("Optional array of arguments required by the operation (e.g. ['secret'] for XOR key, or [13] for ROT13 offset). If omitted, operation defaults are used.")
      })
    ).describe("Ordered array of recipe steps to execute in sequence. Example: [{'op': 'From Base64'}, {'op': 'URL Decode'}]")
  },
  async ({ input, recipe }) => {
    try {
      const result = CyberChefEngine.bake(input, recipe);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (err) {
      return {
        isError: true,
        content: [{ type: "text", text: `CyberChef Bake Error: ${err.message}` }]
      };
    }
  }
);

// Tool 2: Magic (Heuristic Detection)
server.tool(
  "cyberchef_magic",
  "Performs heuristic forensic analysis on suspicious, unknown, or obfuscated strings to detect encoding formats (Base64, Hex, URL encoding), hash signatures (MD5, SHA1, SHA256), ciphers, and compression. Returns identified patterns, confidence scores, and recommended CyberChef recipes to deobfuscate the data.",
  {
    input: z.string().describe("The unknown or obfuscated string, token, or payload to inspect and analyze.")
  },
  async ({ input }) => {
    const analysis = CyberChefEngine.magic(input);
    return {
      content: [{ type: "text", text: JSON.stringify(analysis, null, 2) }]
    };
  }
);

// Tool 3: Help & Operation Discovery
server.tool(
  "cyberchef_help",
  "Searches the built-in CyberChef operations catalog to find available tools, supported recipe names, and operation capabilities by keyword or category.",
  {
    query: z.string().optional().describe("Optional search term to filter operations (e.g., 'base64', 'hex', 'hash', 'xor', 'jwt', 'forensics'). If omitted or empty, returns the full catalog.")
  },
  async ({ query = "" }) => {
    const results = CyberChefEngine.searchHelp(query);
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
    };
  }
);

// Tool 4: From Base64
server.tool(
  "cyberchef_from_base64",
  "Decodes standard RFC 4648 or URL-safe Base64 encoded strings into readable UTF-8 plaintext. Automatically strips whitespace and handles padding.",
  {
    input: z.string().describe("The Base64 encoded string to decode (e.g., 'SGVsbG8gV29ybGQ=')."),
    urlSafe: z.boolean().optional().describe("Optional boolean. Set to true if the input uses URL-safe Base64 encoding with '-' and '_' instead of '+' and '/'.")
  },
  async ({ input, urlSafe = false }) => {
    try {
      const output = BuiltinChef.fromBase64(input, urlSafe);
      return { content: [{ type: "text", text: output }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Base64 Decode Error: ${e.message}` }] };
    }
  }
);

// Tool 5: To Base64
server.tool(
  "cyberchef_to_base64",
  "Encodes arbitrary text or byte data into standard RFC 4648 or URL-safe Base64 string representation.",
  {
    input: z.string().describe("The plaintext string to encode into Base64 format."),
    urlSafe: z.boolean().optional().describe("Optional boolean. Set to true to generate URL-safe Base64 (substitutes '+' with '-' and '/' with '_', omits padding).")
  },
  async ({ input, urlSafe = false }) => {
    const output = BuiltinChef.toBase64(input, urlSafe);
    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 6: From Hex
server.tool(
  "cyberchef_from_hex",
  "Converts a hexadecimal byte string back into UTF-8 text or raw character data. Supports raw contiguous hex, space-separated bytes, 0x prefixes, and comma delimiters.",
  {
    input: z.string().describe("Hexadecimal string to decode (e.g., '48656c6c6f', '48 65 6c 6c 6f', or '0x480x650x6c0x6c0x6f')."),
    delimiter: z.enum(["None", "Space", "0x", "Comma"]).optional().describe("Optional delimiter used between hex bytes. Allowed values: 'None' (default, contiguous hex), 'Space' ('48 65'), '0x' ('0x480x65'), or 'Comma' ('48,65').")
  },
  async ({ input, delimiter = "None" }) => {
    try {
      const output = BuiltinChef.fromHex(input, delimiter);
      return { content: [{ type: "text", text: output }] };
    } catch (e) {
      return { isError: true, content: [{ type: "text", text: `Hex Decode Error: ${e.message}` }] };
    }
  }
);

// Tool 7: To Hex
server.tool(
  "cyberchef_to_hex",
  "Converts UTF-8 text or character data into its hexadecimal byte representation with optional custom delimiter formatting.",
  {
    input: z.string().describe("Plaintext string to convert into hex bytes."),
    delimiter: z.enum(["None", "Space", "0x", "Comma"]).optional().describe("Optional delimiter to insert between hex pairs. Allowed values: 'None' (default, e.g. '48656c6c6f'), 'Space' ('48 65'), '0x' ('0x480x65'), or 'Comma' ('48,65').")
  },
  async ({ input, delimiter = "None" }) => {
    const output = BuiltinChef.toHex(input, delimiter);
    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 8: URL Decode
server.tool(
  "cyberchef_url_decode",
  "Decodes percent-encoded URL query strings and path segments into standard UTF-8 characters, restoring special characters and spaces.",
  {
    input: z.string().describe("The percent-encoded URL string or parameter to decode (e.g., '%41%64%6d%69%6e' or 'hello+world%21').")
  },
  async ({ input }) => {
    const output = BuiltinChef.urlDecode(input);
    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 9: URL Encode
server.tool(
  "cyberchef_url_encode",
  "Encodes reserved and unsafe characters in a string into standard percent-encoded format (%XX) for safe transmission in URLs.",
  {
    input: z.string().describe("The plaintext string to URL encode."),
    encodeAll: z.boolean().optional().describe("Optional boolean. If true, encodes all characters including alphanumerics into percent format. Default is false (standard RFC 3986 encoding).")
  },
  async ({ input, encodeAll = false }) => {
    const output = BuiltinChef.urlEncode(input, encodeAll);
    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 10: ROT13
server.tool(
  "cyberchef_rot13",
  "Applies the ROT13 substitution cipher or an arbitrary Caesar cipher shift to alphabetic characters while preserving case and non-alphabet symbols.",
  {
    input: z.string().describe("The text string to rotate using the Caesar/ROT cipher."),
    amount: z.number().optional().describe("Optional integer offset count for the rotation. Default is 13 for standard ROT13. Range is typically 1 to 25.")
  },
  async ({ input, amount = 13 }) => {
    const output = BuiltinChef.rot13(input, amount);
    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 11: XOR
server.tool(
  "cyberchef_xor",
  "Applies a bitwise XOR cipher using a repeating key against the input string. Frequently used in malware analysis, shellcode obfuscation, and CTF challenges. Applying XOR twice with the same key restores the original plaintext.",
  {
    input: z.string().describe("The ciphertext or plaintext string to process with bitwise XOR."),
    key: z.string().describe("The secret key used for XOR operations. Can be a text string or hex bytes."),
    keyFormat: z.enum(["UTF8", "Hex"]).optional().describe("Optional format of the key string. Allowed values: 'UTF8' (default, ASCII/UTF-8 string key) or 'Hex' (hexadecimal byte key, e.g. '5a' or 'deadbeef').")
  },
  async ({ input, key, keyFormat = "UTF8" }) => {
    const output = BuiltinChef.xor(input, key, keyFormat);
    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 12: Hash Analysis & Hashing (MD5, SHA256)
server.tool(
  "cyberchef_analyse_hash",
  "Identifies probable cryptographic hash algorithms for a given digest based on character set, bit length, and structural signatures (such as MD5, SHA-1, SHA-256, NTLM, bcrypt).",
  {
    hash: z.string().describe("The hash digest string to inspect and classify (e.g., a 32-character hex string for MD5, 64-character for SHA-256).")
  },
  async ({ hash }) => {
    const info = BuiltinChef.analyseHash(hash);
    return { content: [{ type: "text", text: JSON.stringify(info, null, 2) }] };
  }
);

server.tool(
  "cyberchef_sha256",
  "Calculates the cryptographic SHA-256 (Secure Hash Algorithm 256-bit) digest of the input string and returns the resulting 64-character hexadecimal checksum.",
  {
    input: z.string().describe("The string or payload to hash using SHA-256.")
  },
  async ({ input }) => {
    return { content: [{ type: "text", text: BuiltinChef.sha256(input) }] };
  }
);

// Tool 13: Entropy Analysis
server.tool(
  "cyberchef_entropy",
  "Calculates the Shannon entropy (randomness in bits per symbol) of the input data to determine whether it is plaintext, compressed data, packed shellcode, or high-entropy encrypted ciphertext. Provides representation-calibrated analysis for Hex (max 4.0 bits/char) and Base64 (max 6.0 bits/char).",
  {
    input: z.string().describe("The data string or payload representation to analyze for information density and randomness.")
  },
  async ({ input }) => {
    const result = BuiltinChef.entropy(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// Tool 14: JWT Decode
server.tool(
  "cyberchef_jwt_decode",
  "Decodes and inspects JSON Web Tokens (JWT) without requiring a signature secret. Parses and validates the Jose header, claims payload, algorithm specifications, expiration dates, and detects dangerous 'none' algorithms.",
  {
    token: z.string().describe("The complete encoded JSON Web Token in standard 'header.payload.signature' dot-separated format.")
  },
  async ({ token }) => {
    const result = BuiltinChef.jwtDecode(token);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// Tool 15: Defang / Refang URL
server.tool(
  "cyberchef_defang_url",
  "Sanitizes malicious or suspicious URLs into a defanged representation (e.g. converting 'http' to 'hxxp' and '.' to '[.]') to prevent accidental clicks while preserving the domain for security reporting.",
  {
    url: z.string().describe("The full or partial URL string to defang.")
  },
  async ({ url }) => {
    return { content: [{ type: "text", text: BuiltinChef.defangUrl(url) }] };
  }
);

// Tool 16: Forensic Entity Extraction
server.tool(
  "cyberchef_extract_entities",
  "Scans unstructured text, logs, memory dumps, or decompiled scripts to automatically extract security entities including IPv4 addresses, URLs, and email addresses.",
  {
    text: z.string().describe("The unstructured text, log excerpt, or payload from which to extract forensic artifacts.")
  },
  async ({ text }) => {
    const urls = BuiltinChef.extractUrls(text);
    const emails = BuiltinChef.extractEmails(text);
    const ips = (text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || []);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          urls,
          emails,
          ipAddresses: [...new Set(ips)]
        }, null, 2)
      }]
    };
  }
);

// Dual Transport: STDIO (local CLI / Claude / Cursor / Strix) & HTTP/SSE (Hugging Face / Cloud)
async function main() {
  const portArgIdx = process.argv.indexOf("--port");
  const portFromArg = portArgIdx !== -1 ? process.argv[portArgIdx + 1] : null;
  const isHttp = Boolean(
    (process.env.PORT || portFromArg || process.argv.includes("--http") || process.argv.includes("--sse")) &&
    !process.argv.includes("--stdio")
  );

  if (!isHttp) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("CyberChef MCP Server running on stdio transport.");
    return;
  }

  const port = parseInt(portFromArg || process.env.PORT || "7860", 10);
  let sseTransport = null;

  const httpServer = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const host = req.headers.host || `localhost:${port}`;
    const url = new URL(req.url, `http://${host}`);

    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>CyberChef MCP Server</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #f3f4f6; margin: 0; padding: 40px 20px; }
    .container { max-width: 800px; margin: 0 auto; background: #131c2e; border: 1px solid #1f2d47; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h1 { color: #60a5fa; margin-top: 0; display: flex; align-items: center; gap: 10px; }
    .badge { display: inline-block; background: #10b981; color: white; padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: bold; margin-bottom: 20px; }
    p { line-height: 1.6; color: #9ca3af; }
    code, pre { background: #070c14; border: 1px solid #1e293b; border-radius: 6px; padding: 3px 6px; color: #38bdf8; font-family: Consolas, Monaco, monospace; }
    pre { padding: 16px; overflow-x: auto; color: #e2e8f0; }
    .endpoint { background: #1e293b; padding: 12px; border-radius: 8px; font-weight: 600; color: #a5f3fc; margin: 20px 0; }
    ul { list-style: none; padding-left: 0; }
    li { padding: 6px 0; border-bottom: 1px solid #1e293b; color: #cbd5e1; }
    li span { color: #f472b6; font-family: monospace; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🍳 CyberChef MCP Server</h1>
    <div class="badge">● Online & Ready</div>
    <p>Model Context Protocol (MCP) server providing 500+ data transformations, ciphers, hashing, JWT inspection, Shannon entropy analysis, and multi-stage payload deobfuscation for AI security agents.</p>
    
    <div class="endpoint">
      SSE Endpoint: <code>/sse</code> | Message Endpoint: <code>/message</code>
    </div>

    <h3>Connect via Claude Desktop / Cursor / Windsurf / Strix:</h3>
    <pre>{
  "mcpServers": {
    "cyberchef": {
      "url": "https://${host}/sse"
    }
  }
}</pre>

    <h3>Available Tools (15):</h3>
    <ul>
      <li><span>cyberchef_magic</span> — Heuristic payload detection & recipe recommendation</li>
      <li><span>cyberchef_bake</span> — Multi-stage sequential transformation pipeline</li>
      <li><span>cyberchef_jwt_decode</span> — Inspect header, claims, and signature of JWTs</li>
      <li><span>cyberchef_entropy</span> — Shannon entropy calculation for packed/encrypted strings</li>
      <li><span>cyberchef_from_base64</span> / <span>cyberchef_to_base64</span> — Standard and URL-safe Base64</li>
      <li><span>cyberchef_from_hex</span> / <span>cyberchef_to_hex</span> — Hexadecimal encoding & decoding</li>
      <li><span>cyberchef_url_decode</span> / <span>cyberchef_url_encode</span> — Percent-encoding operations</li>
      <li><span>cyberchef_rot13</span> / <span>cyberchef_xor</span> — Ciphers & key decryption</li>
      <li><span>cyberchef_defang_url</span> — Malicious URL sanitization</li>
      <li><span>cyberchef_extract_entities</span> — Regex forensic entity extraction</li>
    </ul>
  </div>
</body>
</html>`);
      return;
    }

    if (req.method === "GET" && url.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "healthy", name: "cyberchef-mcp", version: "1.0.2" }));
      return;
    }

    if (req.method === "GET" && (url.pathname === "/.well-known/mcp/server-card.json" || url.pathname === "/server-card.json")) {
      try {
        const cardData = readFileSync(new URL("./.well-known/mcp/server-card.json", import.meta.url), "utf-8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(cardData);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    if (req.method === "GET" && url.pathname === "/sse") {
      sseTransport = new SSEServerTransport("/message", res);
      await server.connect(sseTransport);
      return;
    }

    if (req.method === "POST" && url.pathname === "/message") {
      if (sseTransport) {
        await sseTransport.handlePostMessage(req, res);
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "SSE session not established yet" }));
      }
      return;
    }

    res.writeHead(404);
    res.end("Not Found");
  });

  httpServer.listen(port, "0.0.0.0", () => {
    console.error(`CyberChef MCP Server running over HTTP/SSE on http://0.0.0.0:${port}`);
    console.error(`SSE endpoint: http://0.0.0.0:${port}/sse`);
  });
}

main().catch((err) => {
  console.error("Fatal error starting CyberChef MCP Server:", err);
  process.exit(1);
});
