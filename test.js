import assert from "assert";
import { BuiltinChef } from "./utils/builtin-chef.js";
import { CyberChefEngine } from "./utils/cyberchef-runner.js";

console.log("🧪 Running CyberChef MCP Test Suite...\n");

// Test 1: Base64
console.log("1. Testing Base64 encode & decode...");
const plain = "Strix-CyberChef-2026";
const b64 = BuiltinChef.toBase64(plain);
assert.strictEqual(BuiltinChef.fromBase64(b64), plain);

const urlSafePlain = "https://example.com/test?param=1&data=xyz";
const urlSafeB64 = BuiltinChef.toBase64(urlSafePlain, true);
assert.strictEqual(BuiltinChef.fromBase64(urlSafeB64, true), urlSafePlain);
console.log("   ✅ Base64 passed");

// Test 2: Hex
console.log("2. Testing Hex conversions...");
const hexStr = "41424344";
assert.strictEqual(BuiltinChef.fromHex(hexStr), "ABCD");
assert.strictEqual(BuiltinChef.toHex("ABCD"), "41424344");
assert.strictEqual(BuiltinChef.fromHex("0x41 0x42", "0x"), "AB");
console.log("   ✅ Hex conversions passed");

// Test 3: URL Encode / Decode
console.log("3. Testing URL encoding...");
const urlParam = "SELECT * FROM users WHERE '1'='1'";
const encoded = BuiltinChef.urlEncode(urlParam);
assert.strictEqual(BuiltinChef.urlDecode(encoded), urlParam);
console.log("   ✅ URL encoding passed");

// Test 4: ROT13
console.log("4. Testing ROT13...");
assert.strictEqual(BuiltinChef.rot13("Hello World"), "Uryyb Jbeyq");
assert.strictEqual(BuiltinChef.rot13("Uryyb Jbeyq"), "Hello World");
console.log("   ✅ ROT13 passed");

// Test 5: XOR
console.log("5. Testing XOR cipher...");
const xorKey = "secret";
const xorCipher = BuiltinChef.xor("ConfidentialData", xorKey);
const xorPlain = BuiltinChef.xor(xorCipher, xorKey);
assert.strictEqual(xorPlain, "ConfidentialData");
console.log("   ✅ XOR passed");

// Test 6: Entropy calculation
console.log("6. Testing Shannon entropy...");
const lowEntropy = BuiltinChef.entropy("AAAAAAAAAAAAAAAAAAAAAAAAAA");
const highEntropy = BuiltinChef.entropy("d8#9sF*1&mZ!094xLqW^2@bA");
assert(lowEntropy.entropy < 1.0, "Expected low entropy for repeated string");
assert(highEntropy.entropy > 3.5, "Expected high entropy for random string");
console.log(`   ✅ Entropy passed (low: ${lowEntropy.entropy.toFixed(2)}, high: ${highEntropy.entropy.toFixed(2)})`);

// Test 7: JWT Decode
console.log("7. Testing JWT decoding...");
// A sample standard JWT: {"sub":"agent-007","role":"admin"}
const sampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZ2VudC0wMDciLCJyb2xlIjoiYWRtaW4ifQ.signature";
const decodedJwt = BuiltinChef.jwtDecode(sampleJwt);
assert.strictEqual(decodedJwt.header.alg, "HS256");
assert.strictEqual(decodedJwt.payload.role, "admin");
assert.strictEqual(decodedJwt.payload.sub, "agent-007");
console.log("   ✅ JWT decoding passed");

// Test 8: Defang & Refang URL
console.log("8. Testing Defang & Refang URL...");
const evilUrl = "https://malicious-c2.attacker.com/payload.exe";
const defanged = BuiltinChef.defangUrl(evilUrl);
assert(defanged.includes("[.]"), "URL should be defanged with [.]");
assert(defanged.startsWith("hxxps"), "Protocol should be defanged to hxxps");
const refanged = BuiltinChef.refangUrl(defanged);
assert.strictEqual(refanged, evilUrl);
console.log("   ✅ Defang/Refang passed");

// Test 9: Entity Extraction
console.log("9. Testing Entity Extraction...");
const logSnippet = "Attacker from 192.168.1.100 accessed https://secure.target.com/api with email admin@corp.local";
assert(BuiltinChef.extractUrls(logSnippet).includes("https://secure.target.com/api"));
assert(BuiltinChef.extractEmails(logSnippet).includes("admin@corp.local"));
console.log("   ✅ Entity Extraction passed");

// Test 10: Multi-layer Bake pipeline
console.log("10. Testing CyberChefEngine.bake multi-layer recipe...");
// Layer 1: "ADMIN_ACCESS" -> Hex -> URL Encode
const basePayload = "ADMIN_ACCESS";
const hexStep = BuiltinChef.toHex(basePayload);
const urlStep = BuiltinChef.urlEncode(hexStep);

const bakeResult = CyberChefEngine.bake(urlStep, [
  { op: "URL Decode" },
  { op: "From Hex", args: ["None"] }
]);
assert.strictEqual(bakeResult.output, basePayload);
assert.strictEqual(bakeResult.stepsCompleted, 2);
console.log("   ✅ Multi-layer bake passed: output = " + bakeResult.output);

// Test 11: Heuristic Magic detection
console.log("11. Testing CyberChefEngine.magic heuristics...");
const magicBase64 = CyberChefEngine.magic("dGhpcyBpcyBhIHRlc3Qgc3RyaW5n");
assert(magicBase64.suggestions.some(s => s.description.includes("Base64")), "Should detect Base64 encoding in suggestions");

const magicHex = CyberChefEngine.magic("48656c6c6f20576f726c64");
assert(magicHex.suggestions.some(s => s.description.includes("Hexadecimal")), "Should detect Hexadecimal encoding in suggestions");
console.log("   ✅ Heuristic Magic passed");

console.log("\n🎉 ALL 11 TEST SUITES PASSED CLEANLY!");
