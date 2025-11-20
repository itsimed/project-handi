/**
 * Tabs Component - Composant onglets accessible
 */

import React, { useState } from 'react';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills';
  fullWidth?: boolean;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  fullWidth = false,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const baseButtonStyles = `
    px-4 py-2.5 font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'flex-1' : ''}
  `;

  const variantStyles = {
    default: {
      inactive: 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300',
      active: 'text-indigo-600 border-b-2 border-indigo-600',
    },
    pills: {
      inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg',
      active: 'text-white bg-indigo-600 rounded-lg',
    },
  };

  return (
    <div className={className}>
      {/* Tab List */}
      <div
        className={`flex gap-1 ${
          variant === 'default' ? 'border-b border-gray-200' : ''
        }`}
        role="tablist"
        aria-label="Onglets"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => handleTabChange(tab.id)}
            className={`
              ${baseButtonStyles}
              ${
                activeTab === tab.id
                  ? variantStyles[variant].active
                  : variantStyles[variant].inactive
              }
            `}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.badge && (
                <span
                  className={`
                    px-2 py-0.5 text-xs font-semibold rounded-full
                    ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }
                  `}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`tabpanel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
