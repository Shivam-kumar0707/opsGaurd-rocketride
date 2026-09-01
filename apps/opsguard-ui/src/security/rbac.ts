// =============================================================================
// Role-Based Access Control (RBAC) & Permissions Matrix
// =============================================================================

import { UserRole, SecurityPermission } from '../types/opsguard';

export interface RoleDefinition {
  role: UserRole;
  label: string;
  description: string;
  permissions: Set<SecurityPermission>;
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  ADMIN: {
    role: 'ADMIN',
    label: 'System Administrator',
    description: 'Full administrative authority over security configurations, model registry, ML training, weight parameters, and system audit logs.',
    permissions: new Set<SecurityPermission>([
      'ANALYZE_RISK',
      'VIEW_INCIDENT',
      'APPROVE_ACTION',
      'MODIFY_ACTION',
      'REJECT_ACTION',
      'RECORD_OUTCOME',
      'RUN_SIMULATION',
      'VIEW_HISTORICAL',
      'UPLOAD_DATASET',
      'TRAIN_MODEL',
      'ACTIVATE_MODEL',
      'MODIFY_WEIGHTS',
      'MANAGE_SECURITY'
    ])
  },

  OPERATIONS_LEAD: {
    role: 'OPERATIONS_LEAD',
    label: 'Operations Lead',
    description: 'Operational manager authorized to analyze risks, inspect evidence, approve/modify/reject action plans, and record outcomes.',
    permissions: new Set<SecurityPermission>([
      'ANALYZE_RISK',
      'VIEW_INCIDENT',
      'APPROVE_ACTION',
      'MODIFY_ACTION',
      'REJECT_ACTION',
      'RECORD_OUTCOME',
      'RUN_SIMULATION',
      'VIEW_HISTORICAL',
      'UPLOAD_DATASET'
    ])
  },

  ANALYST: {
    role: 'ANALYST',
    label: 'Risk Analyst',
    description: 'Analytical user authorized to run risk analyses, inspect evidence, perform What-If simulations, and upload permitted training datasets.',
    permissions: new Set<SecurityPermission>([
      'ANALYZE_RISK',
      'VIEW_INCIDENT',
      'RUN_SIMULATION',
      'VIEW_HISTORICAL',
      'UPLOAD_DATASET',
      'TRAIN_MODEL'
    ])
  },

  VIEWER: {
    role: 'VIEWER',
    label: 'Read-Only Viewer',
    description: 'Auditor or stakeholder with read-only access to view risk dashboards, incidents, evidence, historical cases, and audit logs.',
    permissions: new Set<SecurityPermission>([
      'VIEW_INCIDENT',
      'VIEW_HISTORICAL'
    ])
  }
};
