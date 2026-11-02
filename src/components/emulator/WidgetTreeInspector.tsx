import React, { useState } from 'react';
import type { WidgetTreeNode } from '../../types/flutter';
import { ChevronRight, ChevronDown, Layers, Box, Cpu, FileCode } from 'lucide-react';

interface WidgetTreeInspectorProps {
  tree: WidgetTreeNode;
}

export const WidgetTreeInspector: React.FC<WidgetTreeInspectorProps> = ({ tree }) => {
  const [selectedNode, setSelectedNode] = useState<WidgetTreeNode>(tree);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getNodeIcon = (type: WidgetTreeNode['type']) => {
    switch (type) {
      case 'framework':
        return <Cpu className="w-3.5 h-3.5 text-indigo-400 dark:text-[#818CF8]" aria-hidden="true" />;
      case 'layout':
        return <Layers className="w-3.5 h-3.5 text-sky-400 dark:text-[#38BDF8]" aria-hidden="true" />;
      case 'component':
        return <Box className="w-3.5 h-3.5 text-amber-400 dark:text-[#FBBF24]" aria-hidden="true" />;
      case 'leaf':
      default:
        return <FileCode className="w-3.5 h-3.5 text-emerald-400 dark:text-[#34D399]" aria-hidden="true" />;
    }
  };

  const renderNode = (node: WidgetTreeNode, depth = 0) => {
    const isSelected = selectedNode?.id === node.id;
    const isCollapsed = collapsedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div
          role="treeitem"
          aria-selected={isSelected}
          tabIndex={0}
          onClick={() => setSelectedNode(node)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSelectedNode(node);
            }
          }}
          className={`group flex items-center gap-1.5 py-1 px-2 rounded-md font-mono text-xs cursor-pointer transition-colors ${
            isSelected
              ? 'bg-sky-500/20 dark:bg-[#18181D] text-sky-300 dark:text-white font-semibold border border-sky-500/40 dark:border-[#2B2B32]'
              : 'text-slate-300 dark:text-[#D4D4D8] hover:bg-slate-800/80 dark:hover:bg-[#16161A] hover:text-white'
          }`}
          style={{ paddingLeft: `${depth * 16 + 6}px` }}
        >
          {hasChildren ? (
            <button
              type="button"
              aria-label={isCollapsed ? `Buka cabang ${node.name}` : `Tutup cabang ${node.name}`}
              onClick={(e) => toggleCollapse(node.id, e)}
              className="p-0.5 rounded text-slate-400 dark:text-[#8A8A93] hover:text-slate-100 focus:outline-none"
            >
              {isCollapsed ? (
                <ChevronRight className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          ) : (
            <span className="w-4" aria-hidden="true" />
          )}

          <span className="inline-flex items-center justify-center">
            {getNodeIcon(node.type)}
          </span>

          <span className="truncate">{node.name}</span>

          <span
            className={`ml-auto text-[10px] px-1.5 py-0.2 rounded uppercase font-sans tracking-wide ${
              node.type === 'framework'
                ? 'bg-indigo-950/80 dark:bg-[#18181F] text-indigo-300 dark:text-[#818CF8] border border-indigo-800/50 dark:border-[#2B2B38]'
                : node.type === 'layout'
                ? 'bg-sky-950/80 dark:bg-[#18181F] text-sky-300 dark:text-[#38BDF8] border border-sky-800/50 dark:border-[#202838]'
                : node.type === 'component'
                ? 'bg-amber-950/80 dark:bg-[#201B11] text-amber-300 dark:text-[#FBBF24] border border-amber-800/50 dark:border-[#382E18]'
                : 'bg-emerald-950/80 dark:bg-[#112017] text-emerald-300 dark:text-[#34D399] border border-emerald-800/50 dark:border-[#1A3828]'
            }`}
          >
            {node.type}
          </span>
        </div>

        {hasChildren && !isCollapsed && (
          <div className="relative">
            <div
              className="absolute left-[11px] top-0 bottom-0 border-l border-slate-700/60 dark:border-[#202025]"
              style={{ left: `${depth * 16 + 12}px` }}
            />
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 dark:bg-[#09090B] text-slate-200 dark:text-[#D4D4D8] rounded-2xl overflow-hidden border border-slate-800 dark:border-[#202025]">
      {/* Header Info */}
      <div className="p-3 border-b border-slate-800 dark:border-[#202025] bg-slate-950/60 dark:bg-[#111114] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400 dark:text-[#38BDF8]" />
          <span className="text-xs font-semibold text-slate-200 dark:text-white">Flutter Widget Tree</span>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-[#8A8A93]">Klik node untuk detail</span>
      </div>

      {/* Tree Visualization Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5" role="tree">
        {renderNode(tree)}
      </div>

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="p-3.5 border-t border-slate-800 dark:border-[#202025] bg-slate-950/90 dark:bg-[#111114] space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            {getNodeIcon(selectedNode.type)}
            <span className="font-mono font-semibold text-sky-300 dark:text-[#38BDF8]">{selectedNode.name}</span>
            <span className="text-[10px] text-slate-400 dark:text-[#8A8A93]">({selectedNode.type})</span>
          </div>
          <p className="text-slate-300 dark:text-[#A1A1AA] leading-relaxed font-sans">{selectedNode.description}</p>
        </div>
      )}
    </div>
  );
};
