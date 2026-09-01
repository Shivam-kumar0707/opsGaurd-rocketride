// =============================================================================
// Tool Registry Security Validator
// =============================================================================

import { UserRole, SecurityPermission, SecurityEvent } from '../types/opsguard';
import { PolicyEngine } from './policyEngine';

export interface ToolSecurityDefinition {
  toolName: string;
  requiredPermission: SecurityPermission;
  allowedRoles: UserRole[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const TOOL_SECURITY_REGISTRY: Record<string, ToolSecurityDefinition> = {
  analyzeRisk: {
    toolName: 'analyzeRisk',
    requiredPermission: 'ANALYZE_RISK',
    allowedRoles: ['ADMIN', 'OPERATIONS_LEAD', 'ANALYST'],
    riskLevel: 'MEDIUM'
  },
  simulateRisk: {
    toolName: 'simulateRisk',
    requiredPermission: 'RUN_SIMULATION',
    allowedRoles: ['ADMIN', 'OPERATIONS_LEAD', 'ANALYST'],
    riskLevel: 'LOW'
  },
  activateModel: {
    toolName: 'activateModel',
    requiredPermission: 'ACTIVATE_MODEL',
    allowedRoles: ['ADMIN'],
    riskLevel: 'HIGH'
  },
  approveAction: {
    toolName: 'approveAction',
    requiredPermission: 'APPROVE_ACTION',
    allowedRoles: ['ADMIN', 'OPERATIONS_LEAD'],
    riskLevel: 'HIGH'
  }
};

export class ToolSecurity {
  public static validateToolExecution(
    toolName: string,
    actorRole: UserRole,
    actorName: string
  ): void {
    const toolDef = TOOL_SECURITY_REGISTRY[toolName];
    if (!toolDef) return; // Unrestricted tool

    if (!toolDef.allowedRoles.includes(actorRole)) {
      const secEvent: SecurityEvent = {
        id: `SEC-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        eventType: 'AUTHORIZATION_FAILURE',
        severity: toolDef.riskLevel === 'HIGH' ? 'HIGH' : 'MEDIUM',
        actor: actorName,
        actorRole,
        details: `Tool Security Policy: Role "${actorRole}" is not authorized to execute tool "${toolName}". Allowed roles: ${toolDef.allowedRoles.join(', ')}.`
      };
      PolicyEngine.logSecurityEvent(secEvent);
      throw new Error(`Tool Execution Denied: User role "${actorRole}" cannot invoke tool "${toolName}".`);
    }
  }
}
