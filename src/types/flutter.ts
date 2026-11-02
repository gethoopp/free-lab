export type WidgetCategory = 'core' | 'layout' | 'input' | 'list';

export interface KeyProperty {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
}

export interface WidgetTreeNode {
  id: string;
  name: string;
  type: 'framework' | 'layout' | 'component' | 'leaf';
  description: string;
  properties?: Record<string, string>;
  children?: WidgetTreeNode[];
}

export interface FlutterChallengeCriteria {
  id: string;
  label: string;
  description: string;
}

export interface FlutterChallenge {
  instruction: string;
  hint: string;
  starterCode: string;
  unlockCode: string;
  nextTopicId?: string;
  nextTopicTitle?: string;
  criteria: FlutterChallengeCriteria[];
}

export interface FlutterTopic {
  id: string;
  title: string;
  subtitle: string;
  category: WidgetCategory;
  categoryLabel: string;
  difficulty: 'Pemula' | 'Menengah';
  summary: string;
  conceptPoints: { title: string; explanation: string }[];
  keyProperties: KeyProperty[];
  dartCode: string;
  treeData: WidgetTreeNode;
  defaultParams: Record<string, any>;
  challenge: FlutterChallenge;
}

export interface FlutterCompileError {
  message: string;
  line?: number;
  snippet?: string;
}

export interface EmulatorRuntimeState {
  counter: number;
  inputText: string;
  isSwitchOn: boolean;
  sliderValue: number;
  containerColor: string;
  containerRadius: number;
  containerPadding: number;
  flexDirection: 'row' | 'column';
  mainAxisAlignment: 'start' | 'center' | 'end' | 'spaceBetween';
  crossAxisAlignment: 'start' | 'center' | 'end';
  buttonClicks: number;
  activeSnackbar: string | null;
  listItems: string[];

  // Live code custom overrides & dynamic styling
  customAppBarTitle?: string;
  appBarColor?: string;
  customBodyText?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textColor?: string;
  containerWidth?: number;
  containerHeight?: number;
  buttonBgColor?: string;
  buttonFgColor?: string;
  customButtonLabel?: string;
  customInputLabel?: string;
  customBadgeText?: string;
  hotReloadTriggered?: boolean;
  compileError: FlutterCompileError | null;
}
