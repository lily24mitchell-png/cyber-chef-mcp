import { BuiltinChef } from "./builtin-chef.js";

/**
 * Automated Security Triage Helper for Autonomous Security Agents (Strix, Claude, Cursor).
 * Analyzes unknown payloads in a single call to detect data leaks, high-entropy secrets,
 * encoded commands, and credential hashes.
 */
export const StrixHelper = {
  triage(input) {
    const raw = String(input).trim();
    const entropyInfo = BuiltinChef.entropy(raw);
    const dlpInfo = BuiltinChef.extractDlpEntities(raw);
    const magicInfo = BuiltinChef.magic(raw);

    const findings = [];
    const recommendedActions = [];

    // 1. DLP / Compliance Findings
    if (dlpInfo.totalEntities > 0) {
      findings.push({
        severity: "HIGH",
        category: "data_leak_detected",
        description: `Found ${dlpInfo.totalEntities} sensitive entities in payload.`,
        entityBreakdown: dlpInfo.entityCountsByType
      });
      recommendedActions.push("Review redacted previews and alert incident response if live credentials or PII leaked.");
    }

    // 2. High Entropy / Ciphertext Detection (Whole Payload or Embedded Tokens)
    if (entropyInfo.verdict === "encrypted_or_compressed" || entropyInfo.verdict === "high_entropy") {
      findings.push({
        severity: "MEDIUM",
        category: "high_entropy_payload",
        description: `Payload representation saturation is ${(entropyInfo.normalizedRatio * 100).toFixed(1)}% of ${entropyInfo.alphabet} max. Probable ciphertext, token, or compressed binary.`,
        entropy: entropyInfo.shannonEntropy,
        normalizedRatio: entropyInfo.normalizedRatio
      });
      recommendedActions.push("Attempt XOR key bruteforce or inspect surrounding headers for decompression algorithms.");
    } else {
      // Check individual words/tokens >= 16 chars for embedded high-entropy secrets
      const tokens = raw.split(/[\s,;]+/).filter(w => w.length >= 16);
      for (const tok of tokens) {
        const tokEntropy = BuiltinChef.entropy(tok);
        if (tokEntropy.verdict === "encrypted_or_compressed" || tokEntropy.verdict === "high_entropy") {
          findings.push({
            severity: "MEDIUM",
            category: "high_entropy_payload",
            description: `Embedded high-entropy secret token detected: '${tok.slice(0, 10)}...' (${(tokEntropy.normalizedRatio * 100).toFixed(1)}% saturation).`,
            entropy: tokEntropy.shannonEntropy,
            normalizedRatio: tokEntropy.normalizedRatio,
            tokenPreview: tok.slice(0, 8) + "..."
          });
          recommendedActions.push("Inspect isolated token as potential API secret, bearer token, or ciphertext.");
          break;
        }
      }
    }

    // 3. Magic Suggestions
    if (magicInfo.matchesFound > 0 && magicInfo.suggestions[0].confidence >= 0.8) {
      findings.push({
        severity: "INFO",
        category: "detected_encoding",
        description: magicInfo.suggestions[0].description,
        topRecipe: magicInfo.suggestions[0].recipe
      });
      recommendedActions.push(`Execute recommended recipe via 'cyberchef_bake': ${JSON.stringify(magicInfo.suggestions[0].recipe)}`);
    }

    return {
      payloadLength: raw.length,
      entropy: entropyInfo,
      findings,
      recommendedActions,
      dlpSummary: dlpInfo.entityCountsByType,
      magicMatches: magicInfo.suggestions
    };
  }
};
