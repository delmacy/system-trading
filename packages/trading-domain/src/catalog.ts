import { architectureDecisions, type ArchitectureDecisions } from './architecture-decisions.js';
import { glossary, type Glossary } from './glossary.js';
import { getWorkspaceDescriptor, type WorkspaceDescriptor } from './workspace.js';

export type DomainCatalog = {
  workspace: WorkspaceDescriptor;
  glossary: Glossary;
  architecture_decisions: ArchitectureDecisions;
};

export const getDomainCatalog = (): DomainCatalog => {
  return {
    workspace: getWorkspaceDescriptor(),
    glossary,
    architecture_decisions: architectureDecisions,
  };
};
