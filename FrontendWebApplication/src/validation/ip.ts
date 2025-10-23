//
// IPv4 validation utilities
//

// PUBLIC_INTERFACE
export function isValidIPv4(ip: string): boolean {
  /**
   * Validates IPv4 addresses with these rules:
   * - Four dot-separated octets
   * - Each octet is 0-255
   * - No leading zeros unless the octet is exactly "0"
   */
  const octets = ip.trim().split('.');
  if (octets.length !== 4) return false;
  return octets.every((oct) => {
    if (!/^\d+$/.test(oct)) return false;
    if (oct.length > 1 && oct.startsWith('0')) return false;
    const n = Number(oct);
    return n >= 0 && n <= 255;
  });
}
