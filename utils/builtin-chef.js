import crypto from "crypto";

/**
 * Builtin high-performance security primitives matching CyberChef operations
 */
export const BuiltinChef = {
  // Encodings
  fromBase64(input, urlSafe = false) {
    let str = String(input).trim();
    if (urlSafe) {
      str = str.replace(/-/g, "+").replace(/_/g, "/");
      while (str.length % 4) str += "=";
    }
    return Buffer.from(str, "base64").toString("utf8");
  },

  toBase64(input, urlSafe = false) {
    const b64 = Buffer.from(String(input), "utf8").toString("base64");
    if (urlSafe) {
      return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    return b64;
  },

  fromHex(input, delimiter = "None") {
    let str = String(input);
    if (delimiter === "0x") str = str.replace(/0x/gi, "");
    str = str.replace(/[^0-9a-fA-F]/g, "");
    return Buffer.from(str, "hex").toString("utf8");
  },

  toHex(input, delimiter = "None") {
    const buf = Buffer.from(String(input), "utf8");
    if (delimiter === "Space") {
      return Array.from(buf).map(b => b.toString(16).padStart(2, "0")).join(" ");
    }
    if (delimiter === "0x") {
      return Array.from(buf).map(b => "0x" + b.toString(16).padStart(2, "0")).join(" ");
    }
    return buf.toString("hex");
  },

  urlDecode(input) {
    let str = String(input);
    try {
      return decodeURIComponent(str.replace(/\+/g, " "));
    } catch {
      return unescape(str);
    }
  },

  urlEncode(input, encodeAll = false) {
    const str = String(input);
    if (encodeAll) {
      return Array.from(Buffer.from(str, "utf8"))
        .map(b => "%" + b.toString(16).toUpperCase().padStart(2, "0"))
        .join("");
    }
    return encodeURIComponent(str);
  },

  // Ciphers & Transformations
  rot13(input, amount = 13) {
    const amt = ((amount % 26) + 26) % 26;
    return String(input).replace(/[a-zA-Z]/g, (c) => {
      const base = c <= "Z" ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + amt) % 26) + base);
    });
  },

  xor(input, key = "hisaar", keyFormat = "UTF8") {
    const inBuf = Buffer.from(String(input), "utf8");
    const keyBuf = keyFormat === "Hex" ? Buffer.from(key.replace(/[^0-9a-fA-F]/g, ""), "hex") : Buffer.from(key, "utf8");
    if (keyBuf.length === 0) return inBuf.toString("utf8");

    const outBuf = Buffer.alloc(inBuf.length);
    for (let i = 0; i < inBuf.length; i++) {
      outBuf[i] = inBuf[i] ^ keyBuf[i % keyBuf.length];
    }
    return outBuf.toString("latin1");
  },

  aesDecrypt(input, key, iv = "", mode = "CBC") {
    try {
      const keyBuf = Buffer.isBuffer(key) ? key : Buffer.from(key, "hex");
      const ivBuf = iv ? (Buffer.isBuffer(iv) ? iv : Buffer.from(iv, "hex")) : Buffer.alloc(16, 0);
      const cipherName = `aes-${keyBuf.length * 8}-${mode.toLowerCase()}`;
      const decipher = crypto.createDecipheriv(cipherName, keyBuf, ivBuf);
      let decrypted = decipher.update(Buffer.from(input, "hex"));
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString("utf8");
    } catch (err) {
      return `[AES Decrypt Error: ${err.message}]`;
    }
  },

  // Hashing
  md5(input) {
    return crypto.createHash("md5").update(String(input)).digest("hex");
  },

  sha1(input) {
    return crypto.createHash("sha1").update(String(input)).digest("hex");
  },

  sha256(input) {
    return crypto.createHash("sha256").update(String(input)).digest("hex");
  },

  sha512(input) {
    return crypto.createHash("sha512").update(String(input)).digest("hex");
  },

  analyseHash(hash) {
    const raw = String(hash).trim();
    // 1. PHC string detection: $argon2id$v=19$m=19456,t=2,p=1$salt$hash, scrypt, pbkdf2
    const phc = /^\$(argon2(?:id|i|d)|scrypt|pbkdf2(?:-sha\d+)?)\$/i.exec(raw);
    if (phc) {
      const fields = raw.split("$").filter(Boolean);
      const params = {};
      for (const f of fields) {
        if (f.includes("=")) {
          for (const kv of f.split(",")) {
            const [k, v] = kv.split("=");
            if (k && v !== undefined) {
              const num = Number(v);
              params[k] = isNaN(num) ? v : num;
            }
          }
        }
      }
      const warnings = [];
      if (params.m && params.m < 19456) {
        warnings.push("memory cost below OWASP minimum of 19 MiB (19456 KiB)");
      }
      if (params.t && params.t < 2) {
        warnings.push("iteration count below OWASP recommendation (t >= 2)");
      }
      return {
        algorithm: phc[1].toLowerCase(),
        params,
        confidence: "certain",
        probableTypes: [phc[1]],
        warnings
      };
    }

    const h = raw.toLowerCase();
    const len = h.length;
    const candidates = [];

    // 2. Bcrypt prefix check: $2$, $2a$, $2b$, $2x$, $2y$
    if (/^\$2[abxy]?\$/i.test(raw)) {
      return {
        algorithm: "bcrypt",
        probableTypes: ["Bcrypt"],
        confidence: "certain",
        length: len
      };
    }
    if (h.startsWith("$6$")) {
      return {
        algorithm: "sha512crypt",
        probableTypes: ["SHA-512 Crypt"],
        confidence: "certain",
        length: len
      };
    }
    if (h.startsWith("$5$")) {
      return {
        algorithm: "sha256crypt",
        probableTypes: ["SHA-256 Crypt"],
        confidence: "certain",
        length: len
      };
    }

    // 3. Hex digests with ranked confidence
    if (/^[0-9a-f]+$/i.test(h)) {
      if (len === 32) {
        return {
          lengthHex: 32,
          probableTypes: ["MD5", "NTLM", "MD4"],
          rankedConfidence: [
            { type: "MD5", confidence: "high", reason: "Standard 128-bit hex digest" },
            { type: "NTLM", confidence: "medium", reason: "Windows NTLM password hash" },
            { type: "MD4", confidence: "low", reason: "Legacy hash algorithm" }
          ]
        };
      } else if (len === 40) candidates.push("SHA-1", "RIPEMD-160");
      else if (len === 56) candidates.push("SHA-224", "SHA3-224");
      else if (len === 64) candidates.push("SHA-256", "SHA3-256", "BLAKE2s-256");
      else if (len === 96) candidates.push("SHA-384", "SHA3-384");
      else if (len === 128) candidates.push("SHA-512", "SHA3-512", "BLAKE2b-512");
    }

    return {
      hash: h,
      lengthHex: len,
      probableTypes: candidates.length ? candidates : ["Unknown Hash / Custom Digest"]
    };
  },

  // Analysis & Forensics
  entropy(input) {
    const str = String(input);
    if (!str.length) {
      return {
        shannonEntropy: 0,
        entropy: 0,
        bitsPerChar: 0,
        totalBits: 0,
        length: 0,
        interpretation: "Empty input"
      };
    }

    const freqs = {};
    for (const ch of str) freqs[ch] = (freqs[ch] || 0) + 1;
    let ent = 0;
    for (const ch in freqs) {
      const p = freqs[ch] / str.length;
      ent -= p * Math.log2(p);
    }

    const alphabet = /^[0-9a-fA-F\s]+$/.test(str)
      ? { name: "hex", max: 4 }
      : /^[A-Za-z0-9+/=_-]+$/.test(str)
      ? { name: "base64", max: 6 }
      : { name: "raw", max: 8 };

    const saturation = ent / alphabet.max;

    return {
      shannonEntropy: +ent.toFixed(4),
      entropy: +ent.toFixed(4),
      bitsPerChar: +ent.toFixed(4),
      alphabet: alphabet.name,
      maxForAlphabet: alphabet.max,
      saturation: +saturation.toFixed(3),
      totalBits: Math.round(ent * str.length),
      length: str.length,
      interpretation: saturation > 0.95
        ? "Near-maximal for this alphabet (random / encrypted / compressed)"
        : saturation > 0.75
        ? "High for this alphabet (encoded or compressed)"
        : saturation > 0.45
        ? "Moderate (structured text / source code)"
        : "Low (repetitive or plain text)"
    };
  },

  jwtDecode(token) {
    const parts = String(token).trim().split(".");
    if (parts.length < 2) return { error: "Not a valid 3-part JWT" };
    try {
      const header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
      return {
        header,
        payload,
        signatureHex: parts[2] ? Buffer.from(parts[2], "base64url").toString("hex") : null,
        isExpired: payload.exp ? (Date.now() / 1000 > payload.exp) : null,
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null
      };
    } catch (e) {
      return { error: `Failed to parse JWT JSON: ${e.message}` };
    }
  },

  defangUrl(url) {
    return String(url)
      .replace(/^http:/i, "hxxp:")
      .replace(/^https:/i, "hxxps:")
      .replace(/\./g, "[.]");
  },

  refangUrl(url) {
    return String(url)
      .replace(/^hxxp:/i, "http:")
      .replace(/^hxxps:/i, "https:")
      .replace(/\[\.\]/g, ".")
      .replace(/\[dot\]/gi, ".");
  },

  extractUrls(text) {
    const urlRegex = /(?:https?|ftp|hxxps?):\/\/[^\s/$.?#].[^\s]*/gi;
    const matches = String(text).match(urlRegex) || [];
    return [...new Set(matches)];
  },

  extractEmails(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
    const matches = String(text).match(emailRegex) || [];
    return [...new Set(matches)];
  },

  extractIpAddresses(text) {
    const ipv4Regex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
    const ipv6Regex = /(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])/gi;
    const ipv4Matches = String(text).match(ipv4Regex) || [];
    const ipv6Matches = String(text).match(ipv6Regex) || [];
    return [...new Set([...ipv4Matches, ...ipv6Matches])];
  },

  strings(input, minLength = 4) {
    const regex = new RegExp(`[A-Za-z0-9/\\-_.:@#%^&*()+=~<>?]{${minLength},}`, "g");
    return String(input).match(regex) || [];
  },

  magic(input) {
    const str = String(input).trim();
    const suggestions = [];

    // Check Base64
    if (/^[A-Za-z0-9+/=_-]{8,}$/.test(str) && str.length % 4 === 0) {
      try {
        const decoded = Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
        if (/^[\x20-\x7E\r\n\t]+$/.test(decoded)) {
          suggestions.push({
            recipe: [{ op: "From Base64", args: [] }],
            confidence: 0.95,
            sample: decoded.slice(0, 100),
            description: "Standard or URL-safe Base64 encoded plaintext"
          });
        }
      } catch {}
    }

    // Check Hex
    if (/^([0-9a-fA-F]{2})+$/.test(str) && str.length >= 8) {
      try {
        const decoded = Buffer.from(str, "hex").toString("utf8");
        if (/^[\x20-\x7E\r\n\t]+$/.test(decoded)) {
          suggestions.push({
            recipe: [{ op: "From Hex", args: ["None"] }],
            confidence: 0.90,
            sample: decoded.slice(0, 100),
            description: "Hexadecimal byte sequence"
          });
        }
      } catch {}
    }

    // Check URL encoding
    if (str.includes("%") && /%[0-9a-fA-F]{2}/.test(str)) {
      try {
        const decoded = decodeURIComponent(str.replace(/\+/g, " "));
        suggestions.push({
          recipe: [{ op: "URL Decode", args: [] }],
          confidence: 0.92,
          sample: decoded.slice(0, 100),
          description: "Percent-encoded (URL) string"
        });
      } catch {}
    }

    // Check JWT
    if (str.startsWith("eyJ") && str.split(".").length === 3) {
      suggestions.push({
        recipe: [{ op: "JWT Decode", args: [] }],
        confidence: 0.99,
        sample: "Header: " + Buffer.from(str.split(".")[0], "base64url").toString("utf8"),
        description: "JSON Web Token (RFC 7519)"
      });
    }

    // Hash check
    if (/^[0-9a-fA-F]{32,128}$/.test(str)) {
      const hashInfo = BuiltinChef.analyseHash(str);
      suggestions.push({
        recipe: [{ op: "Analyse hash", args: [] }],
        confidence: 0.85,
        sample: hashInfo.probableTypes.join(", "),
        description: `Cryptographic digest: ${hashInfo.probableTypes.join("/")}`
      });
    }

    return {
      inputLength: str.length,
      entropy: BuiltinChef.entropy(str).shannonEntropy,
      matchesFound: suggestions.length,
      suggestions: suggestions.length ? suggestions : [{ description: "Plaintext or custom encoding with no obvious magic signature", confidence: 0.2 }]
    };
  }
};
