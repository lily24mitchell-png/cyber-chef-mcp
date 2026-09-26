import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import http from "node:http";
import { z } from "zod";
import { CyberChefEngine } from "./utils/cyberchef-runner.js";
import { BuiltinChef } from "./utils/builtin-chef.js";

// Initialize CyberChef MCP Server
const server = new McpServer({
  name: "cyberchef-mcp",
  version: "1.0.0"
});

// Tool 1: Universal Recipe Runner (Bake)
server.tool(
  "cyberchef_bake",
  "Execute a chain of CyberChef operations (recipe) on input data. Supports From Base64, URL Decode, From Hex, XOR, ROT13, MD5, SHA256, Defang, etc.",
  {
    input: z.string().describe("The raw or encoded input string to transform"),
    recipe: z.array(
      z.object({
        op: z.string().describe("Operation name, e.g., 'From Base64', 'URL Decode', 'From Hex'"),
        args: z.array(z.any()).optional().describe("Optional arguments for the operation")
      })
    ).describe("Array of recipe steps to execute in sequence")
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
  "Analyzes unknown or obfuscated data to detect encodings, hashes, ciphers, and recommends deobfuscation recipes with confidence scores.",
  {
    input: z.string().describe("Suspicious, obfuscated, or encoded payload to analyze")
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
  "Search the catalog of available CyberChef operations by keyword or category to discover recipes.",
  {
    query: z.string().optional().describe("Search term like 'hash', 'base64', 'aes', 'forensics', or leave empty for full catalog")
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
  "Decode a Base64 or URL-safe Base64 string into plaintext UTF-8",
  {
    input: z.string().describe("Base64 string to decode"),
    urlSafe: z.boolean().optional().describe("Set true if URL-safe Base64 (- and _ characters)")
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
  "Encode data to standard or URL-safe Base64",
  {
    input: z.string().describe("Plaintext string to encode"),
    urlSafe: z.boolean().optional().describe("Produce URL-safe Base64 format")
  },
  async ({ input, urlSafe = false }) => {
    const output = BuiltinChef.toBase64(input, urlSafe);
    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 6: From Hex
server.tool(
  "cyberchef_from_hex",
  "Convert hexadecimal byte representation back to text or byte string",
  {
    input: z.string().describe("Hex string (e.g. '48656c6c6f' or '48 65 6c 6c 6f' or '0x480x65')"),
    delimiter: z.enum(["None", "Space", "0x", "Comma"]).optional().describe("Delimiter between hex bytes")
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

// Tool 7: URL Decode
server.tool(
  "cyberchef_url_decode",
  "Decode percent-encoded characters (%20, %27, etc.) in URLs or payloads",
  {
    input: z.string().describe("URL-encoded string")
  },
  async ({ input }) => {
    const output = BuiltinChef.urlDecode(input);
    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 8: URL Encode
server.tool(
  "cyberchef_url_encode",
  "Encode special characters into percent-encoding for HTTP transmission",
  {
    input: z.string().describe("Raw string to encode"),
    encodeAll: z.boolean().optional().describe("Encode all characters including alphanumerics")
  },
  async ({ input, encodeAll = false }) => {
    const output = BuiltinChef.urlEncode(input, encodeAll);
    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 9: ROT13
server.tool(
  "cyberchef_rot13",
  "Rotate alphabetic characters by an offset (default 13 for ROT13, or Caesar cipher)",
  {
    input: z.string().describe("Text to rotate"),
    amount: z.number().optional().describe("Offset count (default 13)")
  },
  async ({ input, amount = 13 }) => {
    const output = BuiltinChef.rot13(input, amount);
    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 10: XOR
server.tool(
  "cyberchef_xor",
  "Apply bitwise XOR cipher with a key",
  {
    input: z.string().describe("Ciphertext or plaintext"),
    key: z.string().describe("Secret key for XOR"),
    keyFormat: z.enum(["UTF8", "Hex"]).optional().describe("Format of key string")
  },
  async ({ input, key, keyFormat = "UTF8" }) => {
    const output = BuiltinChef.xor(input, key, keyFormat);
    return { content: [{ type: "text", text: output }] };
  }
);

// Tool 11: Hash Analysis & Hashing (MD5, SHA256)
server.tool(
  "cyberchef_analyse_hash",
  "Identify probable hash algorithms based on length, character set, and common format signatures",
  {
    hash: z.string().describe("Hash string to identify")
  },
  async ({ hash }) => {
    const info = BuiltinChef.analyseHash(hash);
    return { content: [{ type: "text", text: JSON.stringify(info, null, 2) }] };
  }
);

server.tool(
  "cyberchef_sha256",
  "Generate SHA-256 cryptographic digest of input",
  {
    input: z.string().describe("Data to hash")
  },
  async ({ input }) => {
    return { content: [{ type: "text", text: BuiltinChef.sha256(input) }] };
  }
);

// Tool 12: Entropy Analysis
server.tool(
  "cyberchef_entropy",
  "Calculate Shannon entropy to determine randomness, encryption, or compression level",
  {
    input: z.string().describe("Data string or file buffer representation to assess")
  },
  async ({ input }) => {
    const result = BuiltinChef.entropy(input);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// Tool 13: JWT Decode
server.tool(
  "cyberchef_jwt_decode",
  "Parse and inspect claims, algorithm, expiration, and signature of a JSON Web Token",
  {
    token: z.string().describe("Full JWT token (header.payload.signature)")
  },
  async ({ token }) => {
    const result = BuiltinChef.jwtDecode(token);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// Tool 14: Defang / Refang URL
server.tool(
  "cyberchef_defang_url",
  "Defang malicious or suspicious URLs into harmless representations (e.g. hxxps://evil[.]com)",
  {
    url: z.string().describe("URL to defang")
  },
  async ({ url }) => {
    return { content: [{ type: "text", text: BuiltinChef.defangUrl(url) }] };
  }
);

// Tool 15: Forensic Entity Extraction
server.tool(
  "cyberchef_extract_entities",
  "Extract URLs, IP addresses, and email addresses from unstructured logs, memory dumps, or payloads",
  {
    text: z.string().describe("Unstructured text to extract entities from")
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
      res.end(JSON.stringify({ status: "healthy", name: "cyberchef-mcp", version: "1.0.1" }));
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
