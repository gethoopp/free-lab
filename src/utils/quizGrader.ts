export interface GradeResult {
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  diffMessage?: string;
  mismatchedLine?: number;
}

export function gradeDartChallenge(
  actual: string,
  expected: string
): GradeResult {
  const normalize = (text: string) => {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line, index, arr) => {
        // Remove trailing empty lines
        if (line.length === 0 && index === arr.length - 1) return false;
        return true;
      })
      .join('\n')
      .trim();
  };

  const normActual = normalize(actual);
  const normExpected = normalize(expected);

  if (normActual === normExpected) {
    return {
      passed: true,
      actualOutput: actual.trim(),
      expectedOutput: expected.trim(),
    };
  }

  // Identify line mismatch
  const actualLines = normActual.split('\n');
  const expectedLines = normExpected.split('\n');
  let mismatchedLine: number | undefined;
  let diffMessage = 'Output belum sesuai dengan yang diharapkan.';

  for (let i = 0; i < expectedLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      mismatchedLine = i + 1;
      diffMessage = `Perbedaan ditemukan pada baris output ${i + 1}:\n• Diharapkan: "${expectedLines[i] || ''}"\n• Dihasilkan : "${actualLines[i] || ''}"`;
      break;
    }
  }

  if (!mismatchedLine && actualLines.length !== expectedLines.length) {
    diffMessage = `Jumlah baris output berbeda. Diharapkan ${expectedLines.length} baris, namun dihasilkan ${actualLines.length} baris.`;
  }

  return {
    passed: false,
    actualOutput: actual.trim(),
    expectedOutput: expected.trim(),
    diffMessage,
    mismatchedLine,
  };
}
