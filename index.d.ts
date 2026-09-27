/**
 * TypeScript Type Definitions for CyberChef MCP
 */

export interface DecodedPayload {
  utf8: string;
  hex: string;
  isPrintable: boolean;
  byteLength: number;
}

export interface EntropyResult {
  shannonEntropy: number;
  entropy: number;
  bitsPerChar: number;
  alphabet: "hex" | "base64" | "raw";
  maxForAlphabet: number;
  normalizedRatio: number;
  saturation: number;
  totalBits: number;
  length: number;
  verdict: "empty" | "low_entropy" | "moderate_entropy" | "high_entropy" | "encrypted_or_compressed";
  interpretation: string;
}

export interface RankedConfidence {
  type: string;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface HashAnalysisResult {
  algorithm?: string;
  variant?: string;
  cost?: number;
  params?: Record<string, string | number>;
  confidence?: "certain" | "probable";
  warnings?: string[];
  probableTypes: string[];
  rankedConfidence?: RankedConfidence[];
  lengthHex?: number;
  hash?: string;
}

export interface DlpEntityMatch {
  type: "credit_card" | "us_ssn" | "india_pan" | "iban" | "phone_e164" | "ipv4_address" | "ipv6_address" | "aws_access_key" | "jwt" | "private_key_header" | "url" | "email";
  offset: number;
  length: number;
  preview: string;
}

export interface DlpScanResult {
  totalEntities: number;
  entityCountsByType: Record<string, number>;
  entities: DlpEntityMatch[];
}

export interface RecipeStep {
  op: string;
  args?: any[];
}

export interface BakeResult {
  output: string;
  stepsCompleted: number;
  history: Array<{
    op: string;
    beforeSample?: string;
    afterSample?: string;
    resultLength?: number;
    warning?: string;
  }>;
}

export interface OperationCatalogItem {
  name: string;
  category: "Data format" | "Ciphers" | "Hashing" | "Analysis" | "Forensics" | "Utils";
  description: string;
}

export declare const BuiltinChef: {
  fromBase64(input: string, urlSafe?: boolean): string;
  decodeBase64(input: string, urlSafe?: boolean): DecodedPayload;
  toBase64(input: string | Buffer, urlSafe?: boolean): string;
  fromHex(input: string, delimiter?: "None" | "Space" | "0x" | "Comma"): string;
  decodeHex(input: string, delimiter?: "None" | "Space" | "0x" | "Comma"): DecodedPayload;
  toHex(input: string | Buffer, delimiter?: "None" | "Space" | "0x" | "Comma"): string;
  urlDecode(input: string): string;
  urlEncode(input: string, encodeAll?: boolean): string;
  rot13(input: string, amount?: number): string;
  xor(input: string | Buffer, key?: string, keyFormat?: "UTF8" | "Hex"): string;
  aesDecrypt(input: string, key: string | Buffer, iv?: string | Buffer, mode?: "CBC" | "ECB"): string;
  aesEncrypt(input: string, key: string | Buffer, iv?: string | Buffer, mode?: "CBC" | "ECB"): string;
  md5(input: string): string;
  sha1(input: string): string;
  sha256(input: string): string;
  sha512(input: string): string;
  analyseHash(hash: string): HashAnalysisResult;
  entropy(input: string): EntropyResult;
  jwtDecode(token: string): {
    header?: Record<string, any>;
    payload?: Record<string, any>;
    signatureHex?: string | null;
    isExpired?: boolean | null;
    expiresAt?: string | null;
    error?: string;
  };
  defangUrl(input: string): string;
  refangUrl(input: string): string;
  extractUrls(text: string): string[];
  extractEmails(text: string): string[];
  extractIpAddresses(text: string): string[];
  extractDlpEntities(text: string): DlpScanResult;
  strings(input: string, minLength?: number): string[];
  magic(input: string): {
    inputLength: number;
    entropy: number;
    matchesFound: number;
    suggestions: Array<{
      recipe?: RecipeStep[];
      confidence: number;
      sample?: string;
      description: string;
    }>;
  };
};

export declare class CyberChefEngine {
  static bake(input: string, recipe?: RecipeStep[]): BakeResult;
  static magic(input: string): any;
  static searchHelp(query?: string): OperationCatalogItem[];
}

export declare const OPERATIONS_CATALOG: OperationCatalogItem[];
