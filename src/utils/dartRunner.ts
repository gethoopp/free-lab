export interface DartRunResult {
  success: boolean;
  output: string;
  error: string | null;
  errorLine?: number;
}

// Polyfill Dart List methods for the browser runtime
declare global {
  interface Array<T> {
    add(item: T): void;
    where(predicate: (item: T) => boolean): T[];
    toList(): T[];
  }
}

if (!Array.prototype.add) {
  Array.prototype.add = function (item: any) {
    this.push(item);
  };
}
if (!Array.prototype.where) {
  Array.prototype.where = function (predicate: any) {
    return this.filter(predicate);
  };
}
if (!Array.prototype.toList) {
  Array.prototype.toList = function () {
    return this;
  };
}

function transpileDartToJS(dartCode: string): string {
  let js = dartCode;

  // Auto-wrap into void main() if the user writes bare statements
  if (!/void\s+main\s*\(/.test(js)) {
    js = `void main() {\n${js}\n}`;
  }

  // 1. Convert Dart string interpolations
  // Replace $varName with ${varName}
  js = js.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, '${$1}');

  // Convert single quote strings containing ${ to template literals
  js = js.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (match, content) => {
    if (content.includes('${')) {
      const cleaned = content.replace(/\\'/g, "'");
      return '`' + cleaned + '`';
    }
    return match;
  });

  // Convert double quote strings containing ${ to template literals
  js = js.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, content) => {
    if (content.includes('${')) {
      const cleaned = content.replace(/\\"/g, '"');
      return '`' + cleaned + '`';
    }
    return match;
  });

  // 2. Strict Dart variable declarations (String with capital S, int, double, bool, num, dynamic, var, final, const):
  // e.g. String name = "budi" -> let name = "budi"
  // e.g. String name2 = name -> let name2 = name
  js = js.replace(
    /\b(?:(?:final|const|var)\s+)?(?:int|double|bool|String|num|dynamic|[A-Z][a-zA-Z0-9_]*(?:<[^>]+>)?)\??\s+([a-zA-Z0-9_]+)\s*=/g,
    'let $1 ='
  );

  // e.g. var x = ... / final x = ...
  js = js.replace(/\b(?:var|final|const)\s+([a-zA-Z0-9_]+)\s*=/g, 'let $1 =');

  // Uninitialized nullable variables: String? bio; -> let bio = null;
  js = js.replace(
    /\b(?:(?:final|const|var)\s+)?(?:int|double|bool|String|num|dynamic|[A-Z][a-zA-Z0-9_]*(?:<[^>]+>)?)\??\s+([a-zA-Z0-9_]+)\s*;/g,
    'let $1 = null;'
  );

  // 3. Arrow functions: int square(int s) => s * s; -> const square = (s) => s * s;
  js = js.replace(
    /(?:int|double|bool|String|void|[A-Z][a-zA-Z0-9_<>]*)\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*=>\s*(.*?);/g,
    (_, fnName, params, body) => {
      const cleanParams = params.replace(/\b(?:int|double|bool|String|var|final)\s+/g, '');
      return `const ${fnName} = (${cleanParams}) => ${body};`;
    }
  );

  // 4. void main() -> async function main()
  js = js.replace(/void\s+main\s*\(\s*\)\s*(async)?\s*\{/, 'async function main() {');

  return js;
}

export async function runDartCodeSimulation(code: string): Promise<DartRunResult> {
  const trimmed = code.trim();
  if (trimmed.length === 0) {
    return {
      success: false,
      output: '',
      error: 'Error: Kode Dart kosong. Masukkan kode sebelum menjalankan.',
      errorLine: 1,
    };
  }

  const lines = code.split('\n');

  // 1. Enforce Dart convention: Type 'String' must be capitalized (not lowercase 'string')
  const lowercaseStringMatch = code.match(/\b(string)\s+([a-zA-Z0-9_]+)/);
  if (lowercaseStringMatch) {
    const errorLine = lines.findIndex((l) => /\bstring\s+[a-zA-Z0-9_]+/.test(l)) + 1 || 1;
    return {
      success: false,
      output: '',
      error: `Error: 'string' bukan tipe data yang valid di Dart (baris ${errorLine}). Sesuai kaidah resmi Dart, tipe data teks wajib diawali huruf kapital: 'String'.`,
      errorLine,
    };
  }

  // 2. Validate unclosed string quotes
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const sanitized = line.replace(/\\['"]/g, '');
    const singleQuotes = (sanitized.match(/'/g) || []).length;
    const doubleQuotes = (sanitized.match(/"/g) || []).length;
    if (singleQuotes % 2 !== 0 && !line.includes('//')) {
      return {
        success: false,
        output: '',
        error: `SyntaxError: String literal petik tunggal (') tidak ditutup dengan benar pada baris ${i + 1}.`,
        errorLine: i + 1,
      };
    }
    if (doubleQuotes % 2 !== 0 && !line.includes('//')) {
      return {
        success: false,
        output: '',
        error: `SyntaxError: String literal petik ganda (") tidak ditutup dengan benar pada baris ${i + 1}.`,
        errorLine: i + 1,
      };
    }
  }

  // 3. Check brackets balance
  const bracketStack: { char: string; line: number }[] = [];
  const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stripped = line.replace(/\/\/.*$/, '').replace(/'.*?'/g, "''").replace(/".*?"/g, '""');

    for (const ch of stripped) {
      if (ch === '(' || ch === '{' || ch === '[') {
        bracketStack.push({ char: ch, line: i + 1 });
      } else if (ch === ')' || ch === '}' || ch === ']') {
        if (bracketStack.length === 0) {
          return {
            success: false,
            output: '',
            error: `SyntaxError: Ditemukan kurung tutup '${ch}' tanpa kurung buka pada baris ${i + 1}.`,
            errorLine: i + 1,
          };
        }
        const last = bracketStack.pop()!;
        if (last.char !== pairs[ch]) {
          return {
            success: false,
            output: '',
            error: `SyntaxError: Kurung '${ch}' pada baris ${i + 1} tidak cocok dengan '${last.char}'.`,
            errorLine: i + 1,
          };
        }
      }
    }
  }

  if (bracketStack.length > 0) {
    const unclosed = bracketStack.pop()!;
    return {
      success: false,
      output: '',
      error: `SyntaxError: Kurung '${unclosed.char}' pada baris ${unclosed.line} belum ditutup.`,
      errorLine: unclosed.line,
    };
  }

  // 4. Transpile and execute with sandbox environment
  const outputs: string[] = [];
  const customPrint = (...args: any[]) => {
    outputs.push(args.map((a) => (a === null ? 'null' : String(a))).join(' '));
  };

  try {
    const js = transpileDartToJS(code);
    // Custom Future mock for async Dart code
    const FutureMock = {
      delayed: (_: any, val?: any) => Promise.resolve(val),
    };

    const runner = new Function('print', 'Future', `${js}\nreturn main();`);
    await runner(customPrint, FutureMock);

    if (outputs.length === 0) {
      outputs.push('Program berhasil dieksekusi (tidak ada perintah print).');
    }

    return {
      success: true,
      output: outputs.join('\n'),
      error: null,
    };
  } catch (err: any) {
    let msg = err?.message || String(err);
    let errorLine: number | undefined;

    // Format JavaScript ReferenceError into authentic Dart error
    const refMatch = msg.match(/(?:ReferenceError:\s+)?(\w+)\s+is not defined/);
    if (refMatch) {
      const varName = refMatch[1];
      msg = `Error: Undefined name '${varName}'.`;
      const foundIdx = lines.findIndex((l) => new RegExp(`\\b${varName}\\b`).test(l));
      if (foundIdx !== -1) {
        errorLine = foundIdx + 1;
      }
    }

    return {
      success: false,
      output: '',
      error: msg,
      errorLine,
    };
  }
}
