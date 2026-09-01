// =============================================================================
// Security Policy Engine
// =============================================================================

import { UserRole, SecurityPermission, SecurityEvent } from '../types/opsguard';
import { ROLE_DEFINITIONS } from './rbac';

export class PolicyEngine {
  private static securityEvents: SecurityEvent[] = [
    {
      id: 'SEC-001',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eventType: 'AUTHENTICATION_SUCCESS',
      severity: 'LOW',
      actor: 'Sarah (Operations Lead)',
      actorRole: 'OPERATIONS_LEAD',
      details: 'Authenticated via RocketRide host OAuth2 session.'
    },
    {
      id: 'SEC-002',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eventType: 'MODEL_HASH_VERIFIED',
      severity: 'LOW',
      actor: 'System',
      actorRole: 'ADMIN',
      details: 'Active model SHA-256 integrity hash verified (MATCH: e3b0c442...).'
    }
  ];

  public static canPerform(role: UserRole, permission: SecurityPermission): boolean {
    const roleDef = ROLE_DEFINITIONS[role];
    if (!roleDef) return false;
    return roleDef.permissions.has(permission);
  }

  public static enforce(role: UserRole, permission: SecurityPermission, actionName: string, actorName: string): void {
    if (!this.canPerform(role, permission)) {
      const event: SecurityEvent = {
        id: `SEC-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        eventType: 'AUTHORIZATION_FAILURE',
        severity: 'MEDIUM',
        actor: actorName,
        actorRole: role,
        details: `Access Denied: User role "${role}" attempted unauthorized action "${actionName}" (Requires permission "${permission}").`
      };
      this.logSecurityEvent(event);
      throw new Error(`Security Policy Violation: Role "${role}" does not have permission "${permission}" required to ${actionName}.`);
    }
  }

  public static logSecurityEvent(event: SecurityEvent): void {
    this.securityEvents.unshift(event);
  }

  public static getSecurityEvents(): SecurityEvent[] {
    return this.securityEvents;
  }
}
