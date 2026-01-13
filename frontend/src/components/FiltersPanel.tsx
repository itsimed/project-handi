/**
 * FiltersPanel Component - Panneau de filtres accessibles RGAA
 * Filtres avancés avec accordion et checkboxes
 */

import { useState } from 'react';
import { Icon } from './Icon';
import { useTheme } from '../contexts/ThemeContext';
import type { ContractType, ExperienceLevel, RemotePolicy, DisabilityCategory } from '../../../src/types/index';

interface FiltersPanelProps {
  filters: {
    contractTypes?: ContractType[];
    experienceLevels?: ExperienceLevel[];
    remote?: RemotePolicy[];
    disabilityCompatible?: DisabilityCategory[];
  };
  onFilterChange: (filters: any) => void;
  activeCount: number;
}

/**
 * Panneau de filtres accessible avec accordion collapsible
 * Conforme RGAA/WCAG AA
 */
export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFilterChange,
  activeCount,
}) => {
  const { colors } = useTheme();
  // États pour gérer l'ouverture/fermeture des sections
  const [openSections, setOpenSections] = useState({
    contract: true,
    experience: true,
    remote: true,
    disability: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleContractChange = (contract: ContractType) => {
    const current = filters.contractTypes || [];
    const updated = current.includes(contract)
      ? current.filter((c) => c !== contract)
      : [...current, contract];
    onFilterChange({ ...filters, contractTypes: updated });
  };

  const handleExperienceChange = (exp: ExperienceLevel) => {
    const current = filters.experienceLevels || [];
    const updated = current.includes(exp)
      ? current.filter((e) => e !== exp)
      : [...current, exp];
    onFilterChange({ ...filters, experienceLevels: updated });
  };

  const handleRemoteChange = (remote: RemotePolicy) => {
    const current = filters.remote || [];
    const updated = current.includes(remote)
      ? current.filter((r) => r !== remote)
      : [...current, remote];
    onFilterChange({ ...filters, remote: updated });
  };

  const handleDisabilityChange = (disability: DisabilityCategory) => {
    const current = filters.disabilityCompatible || [];
    const updated = current.includes(disability)
      ? current.filter((d) => d !== disability)
      : [...current, disability];
    onFilterChange({ ...filters, disabilityCompatible: updated });
  };

  const handleClearAll = () => {
    onFilterChange({
      contractTypes: [],
      experienceLevels: [],
      remote: [],
      disabilityCompatible: [],
    });
  };

  const contractTypes: ContractType[] = ['CDI', 'CDD', 'INTERIM', 'STAGE', 'ALTERNANCE'];
  const experienceLevels: ExperienceLevel[] = ['JUNIOR', 'CONFIRME', 'SENIOR'];
  const remotePolicies: RemotePolicy[] = ['NO_REMOTE', 'HYBRID', 'FULL_REMOTE'];
  const disabilityCategories: DisabilityCategory[] = [
    'MOTEUR',
    'VISUEL',
    'AUDITIF',
    'PSYCHIQUE',
    'COGNITIF',
    'INVISIBLE',
  ];

  const getLabel = (value: string): string => {
    const labels: Record<string, string> = {
      // Contract types
      CDI: 'CDI',
      CDD: 'CDD',
      INTERIM: 'Intérim',
      STAGE: 'Stage',
      ALTERNANCE: 'Alternance',
      // Experience levels
      JUNIOR: 'Junior',
      CONFIRME: 'Confirmé',
      SENIOR: 'Senior',
      // Remote policies
      NO_REMOTE: 'Présentiel',
      HYBRID: 'Hybride',
      FULL_REMOTE: 'Télétravail complet',
      // Disability categories
      MOTEUR: 'Moteur',
      VISUEL: 'Visuel',
      AUDITIF: 'Auditif',
      PSYCHIQUE: 'Psychique',
      COGNITIF: 'Cognitif',
      INVISIBLE: 'Invisible',
    };
    return labels[value] || value;
  };

  return (
    <aside
      role="complementary"
      aria-label="Filtres de recherche"
      className="w-full md:w-80 rounded-2xl border-2 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto"
      style={{ 
        backgroundColor: colors.bg,
        borderColor: colors.border
      }}
    >
      <div className="p-6">
        {/* Header avec compteur */}
        <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-xl font-bold flex items-center gap-2"
          style={{ color: colors.text }}
        >
          <Icon name="filter" size={24} style={{ color: colors.text }} />
          Filtres
        </h2>
        {activeCount > 0 && (
          <div
            aria-live="polite"
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ 
              backgroundColor: colors.text,
              color: colors.bg
            }}
          >
            {activeCount}
          </div>
        )}
      </div>

      {/* Bouton réinitialiser */}
      {activeCount > 0 && (
        <button
          type="button"
          onClick={handleClearAll}
          className="w-full mb-6 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 border-2"
          style={{ 
            backgroundColor: colors.bg,
            color: colors.text,
            borderColor: colors.border
          }}
          aria-label={`Réinitialiser tous les filtres (${activeCount} actifs)`}
        >
          Réinitialiser
        </button>
      )}

      <div className="space-y-4">
        {/* Type de contrat */}
        <div className="border-t pt-4" style={{ borderColor: colors.border }}>
          <button
            type="button"
            onClick={() => toggleSection('contract')}
            className="w-full flex items-center justify-between text-sm font-semibold transition-opacity duration-200 focus:outline-none focus:ring-2 rounded-xl px-2 py-1 -ml-2"
            style={{ color: colors.text }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            aria-expanded={openSections.contract}
            aria-controls="contract-filters"
          >
            <span className="flex items-center gap-2">
              <Icon name="briefcase" size={16} style={{ color: colors.text }} />
              Type de contrat
              {filters.contractTypes && filters.contractTypes.length > 0 && (
                <span 
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: colors.text,
                    color: colors.bg
                  }}
                >
                  {filters.contractTypes.length}
                </span>
              )}
            </span>
            <Icon
              name={openSections.contract ? 'chevron-up' : 'chevron-down'}
              size={20}
              style={{ color: colors.text, opacity: 0.6 }}
            />
          </button>
          
          {openSections.contract && (
            <div id="contract-filters" className="mt-3 space-y-2">
              {contractTypes.map((contract) => (
                <label
                  key={contract}
                  className="flex items-center gap-3 cursor-pointer transition-opacity duration-200 px-2 py-1 rounded-xl"
                  style={{ color: colors.text }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.backgroundColor = colors.border + '20';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <input
                    type="checkbox"
                    checked={filters.contractTypes?.includes(contract) || false}
                    onChange={() => handleContractChange(contract)}
                    className="w-4 h-4 rounded cursor-pointer focus:ring-2"
                    style={{ 
                      accentColor: colors.text
                    }}
                  />
                  <span className="text-sm">{getLabel(contract)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Niveau d'expérience */}
        <div className="border-t pt-4" style={{ borderColor: colors.border }}>
          <button
            type="button"
            onClick={() => toggleSection('experience')}
            className="w-full flex items-center justify-between text-sm font-semibold transition-opacity duration-200 focus:outline-none focus:ring-2 rounded-xl px-2 py-1 -ml-2"
            style={{ color: colors.text }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            aria-expanded={openSections.experience}
            aria-controls="experience-filters"
          >
            <span className="flex items-center gap-2">
              <Icon name="star" size={16} style={{ color: colors.text }} />
              Niveau d'expérience
              {filters.experienceLevels && filters.experienceLevels.length > 0 && (
                <span 
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: colors.text,
                    color: colors.bg
                  }}
                >
                  {filters.experienceLevels.length}
                </span>
              )}
            </span>
            <Icon
              name={openSections.experience ? 'chevron-up' : 'chevron-down'}
              size={20}
              style={{ color: colors.text, opacity: 0.6 }}
            />
          </button>
          
          {openSections.experience && (
            <div id="experience-filters" className="mt-3 space-y-2">
              {experienceLevels.map((exp) => (
                <label
                  key={exp}
                  className="flex items-center gap-3 cursor-pointer transition-opacity duration-200 px-2 py-1 rounded-xl"
                  style={{ color: colors.text }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.backgroundColor = colors.border + '20';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <input
                    type="checkbox"
                    checked={filters.experienceLevels?.includes(exp) || false}
                    onChange={() => handleExperienceChange(exp)}
                    className="w-4 h-4 rounded cursor-pointer focus:ring-2"
                    style={{ 
                      accentColor: colors.text
                    }}
                  />
                  <span className="text-sm">{getLabel(exp)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Télétravail */}
        <div className="border-t pt-4" style={{ borderColor: colors.border }}>
          <button
            type="button"
            onClick={() => toggleSection('remote')}
            className="w-full flex items-center justify-between text-sm font-semibold transition-opacity duration-200 focus:outline-none focus:ring-2 rounded-xl px-2 py-1 -ml-2"
            style={{ color: colors.text }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            aria-expanded={openSections.remote}
            aria-controls="remote-filters"
          >
            <span className="flex items-center gap-2">
              <Icon name="home" size={16} style={{ color: colors.text }} />
              Télétravail
              {filters.remote && filters.remote.length > 0 && (
                <span 
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: colors.text,
                    color: colors.bg
                  }}
                >
                  {filters.remote.length}
                </span>
              )}
            </span>
            <Icon
              name={openSections.remote ? 'chevron-up' : 'chevron-down'}
              size={20}
              style={{ color: colors.text, opacity: 0.6 }}
            />
          </button>
          
          {openSections.remote && (
            <div id="remote-filters" className="mt-3 space-y-2">
              {remotePolicies.map((policy) => (
                <label
                  key={policy}
                  className="flex items-center gap-3 cursor-pointer transition-opacity duration-200 px-2 py-1 rounded-xl"
                  style={{ color: colors.text }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.backgroundColor = colors.border + '20';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <input
                    type="checkbox"
                    checked={filters.remote?.includes(policy) || false}
                    onChange={() => handleRemoteChange(policy)}
                    className="w-4 h-4 rounded cursor-pointer focus:ring-2"
                    style={{ 
                      accentColor: colors.text
                    }}
                  />
                  <span className="text-sm">{getLabel(policy)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Compatibilité handicap */}
        <div className="border-t pt-4" style={{ borderColor: colors.border }}>
          <button
            type="button"
            onClick={() => toggleSection('disability')}
            className="w-full flex items-center justify-between text-sm font-semibold transition-opacity duration-200 focus:outline-none focus:ring-2 rounded-xl px-2 py-1 -ml-2"
            style={{ color: colors.text }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            aria-expanded={openSections.disability}
            aria-controls="disability-filters"
          >
            <span className="flex items-center gap-2">
              <Icon name="accessibility" size={16} style={{ color: '#22c55e' }} />
              Compatibilité handicap
              {filters.disabilityCompatible && filters.disabilityCompatible.length > 0 && (
                <span 
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: '#22c55e',
                    color: '#FFFFFF'
                  }}
                >
                  {filters.disabilityCompatible.length}
                </span>
              )}
            </span>
            <Icon
              name={openSections.disability ? 'chevron-up' : 'chevron-down'}
              size={20}
              style={{ color: colors.text, opacity: 0.6 }}
            />
          </button>
          
          {openSections.disability && (
            <div id="disability-filters" className="mt-3 space-y-2">
              {disabilityCategories.map((disability) => (
                <label
                  key={disability}
                  className="flex items-center gap-3 cursor-pointer transition-opacity duration-200 px-2 py-1 rounded-xl"
                  style={{ color: colors.text }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.backgroundColor = colors.border + '20';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <input
                    type="checkbox"
                    checked={filters.disabilityCompatible?.includes(disability) || false}
                    onChange={() => handleDisabilityChange(disability)}
                    className="w-4 h-4 rounded cursor-pointer focus:ring-2"
                    style={{ 
                      accentColor: '#22c55e'
                    }}
                  />
                  <span className="text-sm">{getLabel(disability)}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </aside>
  );
};

