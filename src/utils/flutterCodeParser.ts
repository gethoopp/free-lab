import type { EmulatorRuntimeState, FlutterCompileError } from '../types/flutter';

interface ParseResult {
  success: boolean;
  error: FlutterCompileError | null;
  updates: Partial<EmulatorRuntimeState>;
}

const COLOR_MAP: Record<string, string> = {
  blue: '#2563eb',
  blueaccent: '#0284c7',
  cyan: '#06b6d4',
  teal: '#0d9488',
  green: '#16a34a',
  emerald: '#059669',
  amber: '#d97706',
  orange: '#ea580c',
  deeporange: '#f97316',
  red: '#dc2626',
  redaccent: '#ef4444',
  rose: '#e11d48',
  purple: '#9333ea',
  deeppurple: '#7c3aed',
  indigo: '#4f46e5',
  pink: '#db2777',
  yellow: '#eab308',
  black: '#0f172a',
  black87: '#1e293b',
  black54: '#475569',
  black26: '#94a3b8',
  white: '#ffffff',
  white70: '#cbd5e1',
  grey: '#64748b',
  gray: '#64748b',
};

export function parseAndValidateFlutterCode(
  code: string,
  topicId: string
): ParseResult {
  const lines = code.split('\n');

  // 1. Basic structural check: Must have minimal Dart/Flutter keywords
  const trimmed = code.trim();
  if (trimmed.length === 0) {
    return {
      success: false,
      error: {
        message: 'Kode tidak boleh kosong. Masukkan kode Flutter/Dart.',
        line: 1,
      },
      updates: {},
    };
  }

  const hasDartKeywords =
    /import|Widget|build|StatelessWidget|StatefulWidget|return|class|void|main|BuildContext/i.test(
      code
    );
  if (!hasDartKeywords) {
    return {
      success: false,
      error: {
        message:
          'SyntaxError: Kode harus berupa kode Dart/Flutter yang valid (memiliki deklarasi Widget atau method build).',
        line: 1,
      },
      updates: {},
    };
  }

  // 2. Validate unclosed string literals
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const sanitized = line.replace(/\\['"]/g, '');
    const singleQuotes = (sanitized.match(/'/g) || []).length;
    const doubleQuotes = (sanitized.match(/"/g) || []).length;

    if (singleQuotes % 2 !== 0 && !line.includes('//')) {
      return {
        success: false,
        error: {
          message: `SyntaxError: String literal petik tunggal (') tidak ditutup dengan benar pada baris ${i + 1}.`,
          line: i + 1,
          snippet: line.trim(),
        },
        updates: {},
      };
    }

    if (doubleQuotes % 2 !== 0 && !line.includes('//')) {
      return {
        success: false,
        error: {
          message: `SyntaxError: String literal petik ganda (") tidak ditutup dengan benar pada baris ${i + 1}.`,
          line: i + 1,
          snippet: line.trim(),
        },
        updates: {},
      };
    }
  }

  // 3. Validate balanced brackets: (), {}, []
  const bracketStack: { char: string; line: number; col: number }[] = [];
  const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const lineText = lines[lineIdx];
    // Strip comments and strings for bracket checking
    const stripped = lineText
      .replace(/\/\/.*$/, '')
      .replace(/'[^']*'/g, "''")
      .replace(/"[^"]*"/g, '""');

    for (let colIdx = 0; colIdx < stripped.length; colIdx++) {
      const ch = stripped[colIdx];
      if (ch === '(' || ch === '{' || ch === '[') {
        bracketStack.push({ char: ch, line: lineIdx + 1, col: colIdx + 1 });
      } else if (ch === ')' || ch === '}' || ch === ']') {
        if (bracketStack.length === 0) {
          return {
            success: false,
            error: {
              message: `SyntaxError: Ditemukan kurung tutup '${ch}' tanpa kurung buka yang sesuai pada baris ${lineIdx + 1}.`,
              line: lineIdx + 1,
              snippet: lineText.trim(),
            },
            updates: {},
          };
        }

        const last = bracketStack.pop()!;
        if (last.char !== pairs[ch]) {
          return {
            success: false,
            error: {
              message: `SyntaxError: Kurung tidak cocok. Menemukan '${ch}' pada baris ${lineIdx + 1}, tetapi mengharapkan pasangan untuk '${last.char}' dari baris ${last.line}.`,
              line: lineIdx + 1,
              snippet: lineText.trim(),
            },
            updates: {},
          };
        }
      }
    }
  }

  if (bracketStack.length > 0) {
    const unclosed = bracketStack[bracketStack.length - 1];
    return {
      success: false,
      error: {
        message: `SyntaxError: Kurung '${unclosed.char}' dari baris ${unclosed.line} belum ditutup.`,
        line: unclosed.line,
        snippet: lines[unclosed.line - 1]?.trim(),
      },
      updates: {},
    };
  }

  // 4. Validate return of Widget
  if (!/return\s+(const\s+)?[A-Z][a-zA-Z0-9_.]*\(/.test(code)) {
    return {
      success: false,
      error: {
        message:
          'FlutterError: Method build() harus mengembalikan Widget dengan statement return (contoh: return Scaffold(...)).',
        line: lines.findIndex((l) => /build\s*\(/.test(l)) + 1 || 1,
      },
      updates: {},
    };
  }

  // 5. Extract Parameter Updates
  const updates: Partial<EmulatorRuntimeState> = {
    compileError: null,
    hotReloadTriggered: true,
  };

  // Extract AppBar Title
  const appBarMatch = code.match(/AppBar\s*\([^)]*title:\s*(?:const\s+)?Text\(\s*['"]([^'"]+)['"]/);
  if (appBarMatch) {
    updates.customAppBarTitle = appBarMatch[1];
  }

  // Extract AppBar Background Color
  const appBarColorMatch = code.match(/AppBar\s*\([^)]*backgroundColor:\s*(?:Colors\.([a-zA-Z0-9]+)|Color\(0x(?:FF)?([0-9a-fA-F]{6})\))/);
  if (appBarColorMatch) {
    if (appBarColorMatch[1]) {
      const key = appBarColorMatch[1].toLowerCase();
      if (COLOR_MAP[key]) updates.appBarColor = COLOR_MAP[key];
    } else if (appBarColorMatch[2]) {
      updates.appBarColor = `#${appBarColorMatch[2]}`;
    }
  }

  // Extract Container Background Color
  const colorNameMatch = code.match(/color:\s*Colors\.([a-zA-Z0-9]+)/);
  if (colorNameMatch) {
    const colorKey = colorNameMatch[1].toLowerCase();
    if (COLOR_MAP[colorKey]) {
      updates.containerColor = COLOR_MAP[colorKey];
    }
  }

  const hexColorMatch = code.match(/Color\(0x(?:FF)?([0-9a-fA-F]{6})\)/);
  if (hexColorMatch) {
    updates.containerColor = `#${hexColorMatch[1]}`;
  }

  // Extract BorderRadius
  const radiusMatch = code.match(/BorderRadius\.circular\((\d+(?:\.\d+)?)\)/);
  if (radiusMatch) {
    const r = parseFloat(radiusMatch[1]);
    if (!isNaN(r)) updates.containerRadius = Math.min(48, Math.max(0, r));
  }

  // Extract Padding
  const paddingMatch = code.match(/EdgeInsets\.all\((\d+(?:\.\d+)?)\)/);
  if (paddingMatch) {
    const p = parseFloat(paddingMatch[1]);
    if (!isNaN(p)) updates.containerPadding = Math.min(48, Math.max(0, p));
  }

  // Extract Container Dimensions (width & height)
  const widthMatch = code.match(/width:\s*(\d+(?:\.\d+)?)/);
  if (widthMatch) {
    const w = parseFloat(widthMatch[1]);
    if (!isNaN(w)) updates.containerWidth = Math.min(280, Math.max(50, w));
  }

  const heightMatch = code.match(/height:\s*(\d+(?:\.\d+)?)/);
  if (heightMatch) {
    const h = parseFloat(heightMatch[1]);
    if (!isNaN(h)) updates.containerHeight = Math.min(320, Math.max(40, h));
  }

  // Extract TextStyle Properties: fontSize, fontWeight, textColor
  const fontSizeMatch = code.match(/fontSize:\s*(\d+(?:\.\d+)?)/);
  if (fontSizeMatch) {
    const fs = parseFloat(fontSizeMatch[1]);
    if (!isNaN(fs)) updates.fontSize = Math.min(48, Math.max(8, fs));
  }

  const fontWeightMatch = code.match(/fontWeight:\s*FontWeight\.(w[1-9]00|bold|normal)/i);
  if (fontWeightMatch) {
    const weightKey = fontWeightMatch[1].toLowerCase();
    const weightMap: Record<string, string> = {
      w100: '100',
      w200: '200',
      w300: '300',
      w400: '400',
      w500: '500',
      w600: '600',
      w700: '700',
      w800: '800',
      w900: '900',
      bold: '700',
      normal: '400',
    };
    updates.fontWeight = weightMap[weightKey] || '500';
  }

  const textAlignMatch = code.match(/textAlign:\s*TextAlign\.(center|left|right|start|end|justify)/i);
  if (textAlignMatch) {
    const alignKey = textAlignMatch[1].toLowerCase();
    if (alignKey === 'center') updates.textAlign = 'center';
    else if (alignKey === 'left' || alignKey === 'start') updates.textAlign = 'left';
    else if (alignKey === 'right' || alignKey === 'end') updates.textAlign = 'right';
    else if (alignKey === 'justify') updates.textAlign = 'justify';
  }

  const styleColorMatch = code.match(/TextStyle\s*\([^)]*color:\s*(?:Colors\.([a-zA-Z0-9]+)|Color\(0x(?:FF)?([0-9a-fA-F]{6})\))/);
  if (styleColorMatch) {
    if (styleColorMatch[1]) {
      const key = styleColorMatch[1].toLowerCase();
      if (COLOR_MAP[key]) updates.textColor = COLOR_MAP[key];
    } else if (styleColorMatch[2]) {
      updates.textColor = `#${styleColorMatch[2]}`;
    }
  }

  // Extract MainAxisAlignment
  const mainAxisMatch = code.match(/mainAxisAlignment:\s*MainAxisAlignment\.([a-zA-Z]+)/i);
  if (mainAxisMatch) {
    const val = mainAxisMatch[1].toLowerCase();
    if (val === 'center') updates.mainAxisAlignment = 'center';
    else if (val === 'end') updates.mainAxisAlignment = 'end';
    else if (val === 'spacebetween') updates.mainAxisAlignment = 'spaceBetween';
    else if (val === 'start') updates.mainAxisAlignment = 'start';
  }

  // Extract CrossAxisAlignment
  const crossAxisMatch = code.match(/crossAxisAlignment:\s*CrossAxisAlignment\.([a-zA-Z]+)/i);
  if (crossAxisMatch) {
    const val = crossAxisMatch[1].toLowerCase();
    if (val === 'center') updates.crossAxisAlignment = 'center';
    else if (val === 'start') updates.crossAxisAlignment = 'start';
    else if (val === 'end') updates.crossAxisAlignment = 'end';
  }

  // Extract Flex direction
  if (topicId === 'row-and-column') {
    if (/\bRow\s*\(/.test(code) && !/\bColumn\s*\(/.test(code)) {
      updates.flexDirection = 'row';
    } else if (/\bColumn\s*\(/.test(code) && !/\bRow\s*\(/.test(code)) {
      updates.flexDirection = 'column';
    }
  }

  // Extract Text content inside Body / Center / Container
  const allTextMatches = [...code.matchAll(/Text\(\s*['"]([^'"]+)['"]/g)];
  if (allTextMatches.length > 0) {
    const nonAppBarTexts = allTextMatches.filter(
      (m) => m[1] !== updates.customAppBarTitle && m[1] !== 'PRO'
    );
    if (nonAppBarTexts.length > 0) {
      updates.customBodyText = nonAppBarTexts[0][1];
    }
  }

  // Extract Button Label & Style
  const buttonLabelMatch = code.match(
    /(?:label|child):\s*(?:const\s+)?Text\(\s*['"]([^'"]+)['"]/
  );
  if (buttonLabelMatch && topicId === 'interactive-buttons') {
    updates.customButtonLabel = buttonLabelMatch[1];
  }

  const btnBgMatch = code.match(/ElevatedButton\.styleFrom\s*\([^)]*backgroundColor:\s*(?:Colors\.([a-zA-Z0-9]+)|Color\(0x(?:FF)?([0-9a-fA-F]{6})\))/);
  if (btnBgMatch) {
    if (btnBgMatch[1]) {
      const key = btnBgMatch[1].toLowerCase();
      if (COLOR_MAP[key]) updates.buttonBgColor = COLOR_MAP[key];
    } else if (btnBgMatch[2]) {
      updates.buttonBgColor = `#${btnBgMatch[2]}`;
    }
  }

  const btnFgMatch = code.match(/ElevatedButton\.styleFrom\s*\([^)]*foregroundColor:\s*(?:Colors\.([a-zA-Z0-9]+)|Color\(0x(?:FF)?([0-9a-fA-F]{6})\))/);
  if (btnFgMatch) {
    if (btnFgMatch[1]) {
      const key = btnFgMatch[1].toLowerCase();
      if (COLOR_MAP[key]) updates.buttonFgColor = COLOR_MAP[key];
    } else if (btnFgMatch[2]) {
      updates.buttonFgColor = `#${btnFgMatch[2]}`;
    }
  }

  // Extract Input Label
  const inputLabelMatch = code.match(/labelText:\s*['"]([^'"]+)['"]/);
  if (inputLabelMatch) {
    updates.customInputLabel = inputLabelMatch[1];
  }

  // Extract Stack Badge Text
  const badgeMatch = code.match(/Text\(\s*['"](PRO|VIP|NEW|MEMBER|HOT|[A-Z]{2,6})['"]/);
  if (badgeMatch && topicId === 'stack-positioned') {
    updates.customBadgeText = badgeMatch[1];
  }

  // Extract Counter initial value
  const counterMatch = code.match(/int\s+_counter\s*=\s*(\d+)/);
  if (counterMatch) {
    updates.counter = parseInt(counterMatch[1], 10);
  }

  // Extract Switch value
  const switchMatch = code.match(/bool\s+isDark\s*=\s*(true|false)/);
  if (switchMatch) {
    updates.isSwitchOn = switchMatch[1] === 'true';
  }

  return {
    success: true,
    error: null,
    updates,
  };
}
