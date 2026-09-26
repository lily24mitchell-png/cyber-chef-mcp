import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
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

// Connect via STDIO transport for MCP clients (Strix, Claude, Antigravity)
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CyberChef MCP Server running on stdio transport.");
}

main().catch((err) => {
  console.error("Fatal error starting CyberChef MCP Server:", err);
  process.exit(1);
});
