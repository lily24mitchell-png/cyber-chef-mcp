export const SERVER_CARD = {
  "serverInfo": {
    "name": "cyberchef-mcp",
    "version": "1.0.13"
  },
  "authentication": {
    "required": false
  },
  "tools": [
    {
      "name": "cyberchef_bake",
      "description": "Executes a multi-stage sequential data transformation pipeline ('recipe') on the input string across 28 core CyberChef operations (Base64, Hex, URL, HTML entities, XOR, ROT13, AES-CBC Encrypt/Decrypt, MD5, SHA1, SHA256, SHA512, Entropy, Magic, JWT, Defang, Dual-stack IP, DLP entities, Strings, JSON Beautify, Regex, Reverse, Find/Replace). Limits: 5000ms execution timeout, 10MB memory cap per recipe.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "input": {
            "type": "string",
            "description": "The raw, encoded, or obfuscated input string to process"
          },
          "recipe": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "op": { "type": "string" },
                "args": { "type": "array" }
              },
              "required": ["op"]
            },
            "description": "Ordered array of recipe steps to execute in sequence"
          }
        },
        "required": ["input", "recipe"]
      }
    },
    {
      "name": "cyberchef_magic",
      "description": "Performs heuristic forensic analysis on suspicious, unknown, or obfuscated strings to detect encoding formats, hash signatures, ciphers, and compression with confidence scores.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "input": {
            "type": "string",
            "description": "The unknown or obfuscated string to inspect"
          }
        },
        "required": ["input"]
      }
    },
    {
      "name": "cyberchef_help",
      "description": "Searches the built-in CyberChef operations catalog across 28 core operations to find available tools, supported recipe names, and operation capabilities by keyword or category.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "Optional search term to filter operations"
          }
        }
      }
    },
    {
      "name": "cyberchef_from_base64",
      "description": "Decodes standard RFC 4648 or URL-safe Base64 encoded strings and returns structured output { utf8, hex, isPrintable, byteLength } to distinguish text from binary ciphertext without mojibake.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "input": { "type": "string", "description": "Base64 string to decode" },
          "urlSafe": { "type": "boolean", "description": "Set true if URL-safe Base64" }
        },
        "required": ["input"]
      }
    },
    {
      "name": "cyberchef_to_base64",
      "description": "Encodes arbitrary text or byte data into standard RFC 4648 or URL-safe Base64 string representation.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "input": { "type": "string", "description": "Plaintext string to encode" },
          "urlSafe": { "type": "boolean", "description": "Produce URL-safe Base64" }
        },
        "required": ["input"]
      }
    },
    {
      "name": "cyberchef_from_hex",
      "description": "Converts a hexadecimal byte string into character data and returns structured output { utf8, hex, isPrintable, byteLength }.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "input": { "type": "string", "description": "Hexadecimal string to decode" },
          "delimiter": { "type": "string", "enum": ["None", "Space", "0x", "Comma"] }
        },
        "required": ["input"]
      }
    },
    {
      "name": "cyberchef_to_hex",
      "description": "Converts UTF-8 text or character data into hexadecimal byte representation with optional delimiters.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "input": { "type": "string", "description": "Plaintext string to convert" },
          "delimiter": { "type": "string", "enum": ["None", "Space", "0x", "Comma"] }
        },
        "required": ["input"]
      }
    },
    {
      "name": "cyberchef_url_decode",
      "description": "Decodes percent-encoded URL query strings and path segments into standard characters.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "input": { "type": "string", "description": "URL-encoded string to decode" }
        },
        "required": ["input"]
      }
    },
    {
      "name": "cyberchef_url_encode",
      "description": "Encodes characters into standard percent-encoded format (%XX) for safe transmission in URLs.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "input": { "type": "string", "description": "Plaintext string to encode" },
          "encodeAll": { "type": "boolean", "description": "Percent encode all characters" }
        },
        "required": ["input"]
      }
    },
    {
      "name": "cyberchef_rot13",
      "description": "Applies ROT13 or custom Caesar rotation shift to alphabetic characters.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "input": { "type": "string", "description": "String to rotate" },
          "amount": { "type": "number", "description": "Rotation offset count" }
        },
        "required": ["input"]
      }
    },
    {
      "name": "cyberchef_xor",
      "description": "Applies a bitwise XOR cipher using repeating key against input with binary byte preservation.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "input": { "type": "string", "description": "String to XOR" },
          "key": { "type": "string", "description": "Secret key" },
          "keyFormat": { "type": "string", "enum": ["UTF8", "Hex"] }
        },
        "required": ["input", "key"]
      }
    },
    {
      "name": "cyberchef_analyse_hash",
      "description": "Identifies probable cryptographic hash algorithms. Supports PHC password hashes ($argon2id$, $argon2i$, $argon2d$, $scrypt$, $pbkdf2$) with OWASP audits, bcrypt prefixes ($2$, $2a$, $2b$, $2x$, $2y$), and ranked confidence for hex digests.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "hash": { "type": "string", "description": "Hash digest or password hash string to inspect" }
        },
        "required": ["hash"]
      }
    },
    {
      "name": "cyberchef_sha256",
      "description": "Calculates cryptographic SHA-256 digest of input and returns 64-character hex checksum.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "input": { "type": "string", "description": "Payload to hash" }
        },
        "required": ["input"]
      }
    },
    {
      "name": "cyberchef_entropy",
      "description": "Calculates Shannon entropy calibrated against alphabet ceiling (Hex max 4.0, Base64 max 6.0, Raw max 8.0). Reports bitsPerChar, maxForAlphabet, normalizedRatio, and totalBits.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "input": { "type": "string", "description": "Payload representation to analyze" }
        },
        "required": ["input"]
      }
    },
    {
      "name": "cyberchef_jwt_decode",
      "description": "Decodes and inspects JSON Web Tokens (JWT) without requiring a signature secret.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "token": { "type": "string", "description": "Encoded JWT token" }
        },
        "required": ["token"]
      }
    },
    {
      "name": "cyberchef_defang_url",
      "description": "Sanitizes malicious URLs, domains, IPv4 addresses, and email addresses. Scoped: defangs protocol and host/IP dots while preserving query strings and path decimals, and converts '@' to '[at]'.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "url": { "type": "string", "description": "URL or domain to defang" }
        },
        "required": ["url"]
      }
    },
    {
      "name": "cyberchef_extract_entities",
      "description": "Enterprise DLP and forensic entity scanner. Extracts and redacts: Credit Cards (with Luhn check), US SSN, India PAN, IBAN, E.164 phone numbers, strict dual-stack IPv4 (validating 0-255 octet range) and IPv6, AWS access keys, JWTs, private keys, URLs, and emails. Returns match type, offset, and masked preview.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "text": { "type": "string", "description": "Unstructured text or log excerpt to scan" }
        },
        "required": ["text"]
      }
    },
    {
      "name": "cyberchef_strix_triage",
      "description": "Automated one-shot security triage for autonomous AI agents (Strix, Claude, Cursor). Checks for DLP leaks, calculates calibrated entropy, detects encoding formats, and provides actionable findings.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "input": { "type": "string", "description": "Suspicious payload or token to triage" }
        },
        "required": ["input"]
      }
    }
  ]
};
