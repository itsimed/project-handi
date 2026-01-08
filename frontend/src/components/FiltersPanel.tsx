/**
 * FiltersPanel Component - Panneau de filtres accessibles RGAA
 * Filtres avancés avec accordion et checkboxes
 */

import { useState } from 'react';
import { Icon } from './Icon';
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
      className="w-full md:w-80 bg-slate-800 rounded-2xl border border-slate-700 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      <div className="p-6">
        {/* Header avec compteur */}
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Icon name="filter" size={24} className="text-sky-400" />
          Filtres
        </h2>
        {activeCount > 0 && (
          <div
            aria-live="polite"
            className="bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full"
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
          className="w-full mb-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          aria-label={`Réinitialiser tous les filtres (${activeCount} actifs)`}
        >
          Réinitialiser
        </button>
      )}

      <div className="space-y-4">
        {/* Type de contrat */}
        <div className="border-t border-slate-700 pt-4">
          <button
            type="button"
            onClick={() => toggleSection('contract')}
            className="w-full flex items-center justify-between text-sm font-semibold text-slate-300 hover:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded px-2 py-1 -ml-2"
            aria-expanded={openSections.contract}
            aria-controls="contract-filters"
          >
            <span className="flex items-center gap-2">
              <Icon name="briefcase" size={16} className="text-sky-400" />
              Type de contrat
              {filters.contractTypes && filters.contractTypes.length > 0 && (
                <span className="text-xs bg-sky-500 text-white px-2 py-0.5 rounded-full">
                  {filters.contractTypes.length}
                </span>
              )}
            </span>
            <Icon
              name={openSections.contract ? 'chevron-up' : 'chevron-down'}
              size={20}
              className="text-slate-400"
            />
          </button>
          
          {openSections.contract && (
            <div id="contract-filters" className="mt-3 space-y-2">
              {contractTypes.map((contract) => (
                <label
                  key={contract}
                  className="flex items-center gap-3 text-slate-300 hover:text-slate-100 cursor-pointer transition-colors px-2 py-1 rounded hover:bg-slate-900/50"
                >
                  <input
                    type="checkbox"
                    checked={filters.contractTypes?.includes(contract) || false}
                    onChange={() => handleContractChange(contract)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer"
                  />
                  <span className="text-sm">{getLabel(contract)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Niveau d'expérience */}
        <div className="border-t border-slate-700 pt-4">
          <button
            type="button"
            onClick={() => toggleSection('experience')}
            className="w-full flex items-center justify-between text-sm font-semibold text-slate-300 hover:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded px-2 py-1 -ml-2"
            aria-expanded={openSections.experience}
            aria-controls="experience-filters"
          >
            <span className="flex items-center gap-2">
              <Icon name="star" size={16} className="text-sky-400" />
              Niveau d'expérience
              {filters.experienceLevels && filters.experienceLevels.length > 0 && (
                <span className="text-xs bg-sky-500 text-white px-2 py-0.5 rounded-full">
                  {filters.experienceLevels.length}
                </span>
              )}
            </span>
            <Icon
              name={openSections.experience ? 'chevron-up' : 'chevron-down'}
              size={20}
              className="text-slate-400"
            />
          </button>
          
          {openSections.experience && (
            <div id="experience-filters" className="mt-3 space-y-2">
              {experienceLevels.map((exp) => (
                <label
                  key={exp}
                  className="flex items-center gap-3 text-slate-300 hover:text-slate-100 cursor-pointer transition-colors px-2 py-1 rounded hover:bg-slate-900/50"
                >
                  <input
                    type="checkbox"
                    checked={filters.experienceLevels?.includes(exp) || false}
                    onChange={() => handleExperienceChange(exp)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer"
                  />
                  <span className="text-sm">{getLabel(exp)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Télétravail */}
        <div className="border-t border-slate-700 pt-4">
          <button
            type="button"
            onClick={() => toggleSection('remote')}
            className="w-full flex items-center justify-between text-sm font-semibold text-slate-300 hover:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded px-2 py-1 -ml-2"
            aria-expanded={openSections.remote}
            aria-controls="remote-filters"
          >
            <span className="flex items-center gap-2">
              <Icon name="home" size={16} className="text-sky-400" />
              Télétravail
              {filters.remote && filters.remote.length > 0 && (
                <span className="text-xs bg-sky-500 text-white px-2 py-0.5 rounded-full">
                  {filters.remote.length}
                </span>
              )}
            </span>
            <Icon
              name={openSections.remote ? 'chevron-up' : 'chevron-down'}
              size={20}
              className="text-slate-400"
            />
          </button>
          
          {openSections.remote && (
            <div id="remote-filters" className="mt-3 space-y-2">
              {remotePolicies.map((policy) => (
                <label
                  key={policy}
                  className="flex items-center gap-3 text-slate-300 hover:text-slate-100 cursor-pointer transition-colors px-2 py-1 rounded hover:bg-slate-900/50"
                >
                  <input
                    type="checkbox"
                    checked={filters.remote?.includes(policy) || false}
                    onChange={() => handleRemoteChange(policy)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer"
                  />
                  <span className="text-sm">{getLabel(policy)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Compatibilité handicap */}
        <div className="border-t border-slate-700 pt-4">
          <button
            type="button"
            onClick={() => toggleSection('disability')}
            className="w-full flex items-center justify-between text-sm font-semibold text-slate-300 hover:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded px-2 py-1 -ml-2"
            aria-expanded={openSections.disability}
            aria-controls="disability-filters"
          >
            <span className="flex items-center gap-2">
              <Icon name="accessibility" size={16} className="text-green-400" />
              Compatibilité handicap
              {filters.disabilityCompatible && filters.disabilityCompatible.length > 0 && (
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  {filters.disabilityCompatible.length}
                </span>
              )}
            </span>
            <Icon
              name={openSections.disability ? 'chevron-up' : 'chevron-down'}
              size={20}
              className="text-slate-400"
            />
          </button>
          
          {openSections.disability && (
            <div id="disability-filters" className="mt-3 space-y-2">
              {disabilityCategories.map((disability) => (
                <label
                  key={disability}
                  className="flex items-center gap-3 text-slate-300 hover:text-slate-100 cursor-pointer transition-colors px-2 py-1 rounded hover:bg-slate-900/50"
                >
                  <input
                    type="checkbox"
                    checked={filters.disabilityCompatible?.includes(disability) || false}
                    onChange={() => handleDisabilityChange(disability)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer"
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

