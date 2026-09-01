// =============================================================================
// Human Approval State Machine & Idempotency Engine
// =============================================================================

import { OperationalIncident, IncidentState, UserRole, SecurityEvent } from '../types/opsguard';
import { PolicyEngine } from './policyEngine';
import { TamperEvidentAudit } from './tamperEvidentAudit';

export class ApprovalStateMachine {
  private static executedKeys: Set<string> = new Set();

  public static transition(
    incident: OperationalIncident,
    targetState: IncidentState,
    actorRole: UserRole,
    actorName: string,
    idempotencyKey: string,
    notes?: string
  ): OperationalIncident {
    // 1. Idempotency Check — Prevent Double Execution
    if (this.executedKeys.has(idempotencyKey)) {
      const secEvent: SecurityEvent = {
        id: `SEC-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        eventType: 'DUPLICATE_EXECUTION_PREVENTED',
        severity: 'MEDIUM',
        actor: actorName,
        actorRole,
        details: `Idempotency Safeguard: Blocked duplicate action execution for key "${idempotencyKey}". Action already executed.`
      };
      PolicyEngine.logSecurityEvent(secEvent);
      throw new Error(`Idempotency Protection: Action with key "${idempotencyKey}" has already been executed.`);
    }

    // 2. Permission Check
    if (targetState === 'APPROVED') {
      PolicyEngine.enforce(actorRole, 'APPROVE_ACTION', 'approve action plan', actorName);
    } else if (targetState === 'REJECTED') {
      PolicyEngine.enforce(actorRole, 'REJECT_ACTION', 'reject action plan', actorName);
    } else if (targetState === 'MODIFIED') {
      PolicyEngine.enforce(actorRole, 'MODIFY_ACTION', 'modify action plan', actorName);
    }

    // 3. Register Idempotency Key
    this.executedKeys.add(idempotencyKey);

    const updatedIncident: OperationalIncident = {
      ...incident,
      state: targetState,
      status: targetState === 'APPROVED' || targetState === 'MODIFIED' ? 'approved' : targetState === 'REJECTED' ? 'rejected' : incident.status,
      idempotencyKey
    };

    // 4. Log to Hash-Chained Tamper-Evident Audit Trail
    TamperEvidentAudit.appendEvent(
      actorName,
      actorRole,
      targetState === 'APPROVED' ? 'action_approved' : targetState === 'REJECTED' ? 'action_rejected' : 'action_modified',
      `State transition to ${targetState} by ${actorName}.${notes ? ` Notes: "${notes}"` : ''}`,
      { incidentId: incident.id, targetState, idempotencyKey }
    );

    return updatedIncident;
  }
}
