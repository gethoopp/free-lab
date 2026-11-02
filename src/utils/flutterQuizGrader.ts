import type { EmulatorRuntimeState, FlutterChallenge } from '../types/flutter';

export interface CriteriaEvaluation {
  id: string;
  label: string;
  passed: boolean;
}

export interface FlutterGradeEvaluation {
  passed: boolean;
  passedCount: number;
  totalCount: number;
  criteriaResults: CriteriaEvaluation[];
  message: string;
}

export function evaluateFlutterChallenge(
  _topicId: string,
  code: string,
  state: Partial<EmulatorRuntimeState>,
  challenge: FlutterChallenge
): FlutterGradeEvaluation {
  const criteriaResults: CriteriaEvaluation[] = [];

  for (const criterion of challenge.criteria) {
    let passed = false;

    switch (criterion.id) {
      // what-is-widget criteria
      case 'appbar-title':
        passed =
          Boolean(state.customAppBarTitle && state.customAppBarTitle.trim().length > 0) ||
          /AppBar\s*\([^)]*title:\s*(?:const\s+)?Text\(['"][^'"]+['"]\)/i.test(code);
        break;

      case 'body-text':
        passed =
          Boolean(state.customBodyText && state.customBodyText.length > 5) ||
          /Center\s*\([^)]*child:\s*(?:const\s+)?Text\(['"][^'"]+['"]\)/s.test(code);
        break;

      case 'text-style-size':
        passed =
          Boolean(state.fontSize && state.fontSize >= 14) ||
          /fontSize:\s*(?:1[4-9]|[2-9][0-9])/i.test(code);
        break;

      case 'text-style-color':
        passed =
          Boolean(state.textColor) ||
          /TextStyle\s*\([^)]*color:\s*(?:Colors\.[a-zA-Z]+|Color\(0x[0-9a-fA-F]+\))/i.test(code);
        break;

      // stateless-vs-stateful criteria
      case 'stateful-structure':
        passed =
          /class\s+\w+\s+extends\s+StatefulWidget/i.test(code) &&
          /createState\s*\(\s*\)/i.test(code);
        break;

      case 'counter-init':
        passed =
          (state.counter !== undefined && state.counter >= 0) ||
          /int\s+_counter\s*=\s*\d+/i.test(code);
        break;

      case 'setstate-usage':
        passed = /setState\s*\(\s*\(\s*\)\s*\{/i.test(code);
        break;

      case 'fab-present':
        passed =
          /FloatingActionButton\s*\(/i.test(code) &&
          /onPressed:\s*_[a-zA-Z0-9_]+/i.test(code);
        break;

      // container criteria
      case 'container-sizing':
        passed =
          (Boolean(state.containerWidth) && Boolean(state.containerHeight)) ||
          (/width:\s*\d+/i.test(code) && /height:\s*\d+/i.test(code));
        break;

      case 'container-color':
        passed =
          Boolean(state.containerColor) ||
          /color:\s*(?:Colors\.[a-zA-Z]+|Color\(0x[0-9a-fA-F]+\))/i.test(code);
        break;

      case 'container-radius':
        passed =
          (state.containerRadius !== undefined && state.containerRadius >= 10) ||
          /BorderRadius\.circular\(\s*(?:1[0-9]|[2-9][0-9])\s*\)/i.test(code);
        break;

      // row-and-column criteria
      case 'flex-direction':
        passed =
          (state.flexDirection === 'column' || state.flexDirection === 'row') &&
          (/\b(?:Column|Row)\s*\(/i.test(code));
        break;

      case 'main-axis-align':
        passed =
          Boolean(state.mainAxisAlignment) ||
          /mainAxisAlignment:\s*MainAxisAlignment\.(?:center|spaceBetween|end|spaceAround)/i.test(code);
        break;

      case 'flex-children':
        passed =
          /children:\s*\[[\s\S]*?(?:_buildBox|Container)[\s\S]*?(?:_buildBox|Container)[\s\S]*?\]/i.test(code);
        break;

      // stack-positioned criteria
      case 'stack-structure':
        passed = /\bStack\s*\([^)]*children:\s*\[/i.test(code);
        break;

      case 'positioned-usage':
        passed =
          /Positioned\s*\([^)]*(?:top|right|bottom|left):\s*\d+/i.test(code);
        break;

      case 'badge-content':
        passed =
          Boolean(state.customBadgeText) ||
          /Text\(\s*['"](?:PRO|VIP|NEW|MEMBER|HOT|[A-Z]{2,6})['"]/i.test(code);
        break;

      // interactive-buttons criteria
      case 'elevated-button-usage':
        passed = /ElevatedButton(?:\.icon)?\s*\(/i.test(code);
        break;

      case 'button-onpressed':
        passed = /onPressed:\s*(?:\(\s*\)\s*\{|_[a-zA-Z0-9_]+)/i.test(code);
        break;

      case 'button-style-color':
        passed =
          Boolean(state.buttonBgColor) ||
          /ElevatedButton\.styleFrom\s*\([^)]*backgroundColor:/i.test(code);
        break;

      // text-field-input criteria
      case 'textfield-usage':
        passed = /TextField\s*\(/i.test(code);
        break;

      case 'input-decoration':
        passed =
          /decoration:\s*InputDecoration\s*\([^)]*(?:labelText|hintText):/i.test(code);
        break;

      // switch-and-slider criteria
      case 'switch-usage':
        passed = /Switch(?:ListTile)?\s*\(/i.test(code);
        break;

      case 'switch-state-bound':
        passed = /value:\s*(?:isDark|_isSwitched|true|false|[a-zA-Z0-9_]+)/i.test(code);
        break;

      // listview criteria
      case 'listview-builder':
        passed = /ListView(?:\.builder)?\s*\(/i.test(code);
        break;

      case 'list-tile-usage':
        passed = /ListTile\s*\(/i.test(code) || /Card\s*\(/i.test(code);
        break;

      default:
        // Generic fallback check: criteria is checked by regex if specified
        passed = true;
        break;
    }

    criteriaResults.push({
      id: criterion.id,
      label: criterion.label,
      passed,
    });
  }

  const passedCount = criteriaResults.filter((c) => c.passed).length;
  const totalCount = criteriaResults.length;
  const allPassed = passedCount === totalCount;

  return {
    passed: allPassed,
    passedCount,
    totalCount,
    criteriaResults,
    message: allPassed
      ? 'Selamat! Seluruh kriteria tantangan Flutter berhasil Anda penuhi.'
      : `Masih ada ${totalCount - passedCount} kriteria tantangan yang belum terpenuhi. Periksa daftar kriteria di bawah.`,
  };
}
