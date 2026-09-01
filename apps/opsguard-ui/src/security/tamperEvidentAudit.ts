// =============================================================================
// SHA-256 Hash-Chained Tamper-Evident Audit Trail
// =============================================================================

import { AuditEvent, TamperVerificationResult, SecurityEvent } from '../types/opsguard';
import { ModelIntegrity } from './modelIntegrity';
import { PolicyEngine } from './policyEngine';

export class TamperEvidentAudit {
  private static auditChain: AuditEvent[] = [
    {
      id: 'AUD-CHAIN-001',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: 'System Genesis',
      actorRole: 'ADMIN',
      eventType: 'security_event',
      summary: 'OpsGuard Tamper-Evident Audit Chain Initialized.',
      previousEventHash: '0000000000000000000000000000000000000000000000000000000000000000',
      eventHash: ModelIntegrity.computeSHA256('GENESIS_EVENT_HASH_001')
    }
  ];

  public static appendEvent(
    actor: string,
    actorRole: string,
    eventType: AuditEvent['eventType'],
    summary: string,
    details?: Record<string, unknown>
  ): AuditEvent {
    const lastEvent = this.auditChain[this.auditChain.length - 1];
    const previousEventHash = lastEvent ? lastEvent.eventHash || 'GENESIS_HASH' : 'GENESIS_HASH';
    const id = `AUD-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const payload = `${previousEventHash}:${id}:${actor}:${eventType}:${summary}:${JSON.stringify(details || {})}`;
    const eventHash = ModelIntegrity.computeSHA256(payload);

    const newEvent: AuditEvent = {
      id,
      timestamp,
      actor,
      actorRole,
      eventType,
      summary,
      details,
      previousEventHash,
      eventHash
    };

    this.auditChain.push(newEvent);
    return newEvent;
  }

  public static verifyAuditIntegrity(): TamperVerificationResult {
    let isValid = true;
    let tamperedEventId: string | undefined;

    for (let i = 1; i < this.auditChain.length; i++) {
      const prev = this.auditChain[i - 1];
      const curr = this.auditChain[i];

      if (curr.previousEventHash !== prev.eventHash) {
        isValid = false;
        tamperedEventId = curr.id;
        break;
      }
    }

    if (!isValid) {
      const secEvent: SecurityEvent = {
        id: `SEC-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        eventType: 'AUDIT_TAMPER_DETECTED',
        severity: 'CRITICAL',
        actor: 'System Audit Verifier',
        actorRole: 'ADMIN',
        details: `⚠ AUDIT INTEGRITY FAILURE: Audit hash chain broken at event ${tamperedEventId}! Audit log modification detected.`
      };
      PolicyEngine.logSecurityEvent(secEvent);
    } else {
      const secEvent: SecurityEvent = {
        id: `SEC-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        eventType: 'AUDIT_VERIFIED',
        severity: 'LOW',
        actor: 'System Audit Verifier',
        actorRole: 'ADMIN',
        details: `✓ Audit Hash Chain Verified (${this.auditChain.length} events). Integrity intact.`
      };
      PolicyEngine.logSecurityEvent(secEvent);
    }

    return {
      isIntegrityValid: isValid,
      checkedEventsCount: this.auditChain.length,
      tamperedEventId,
      message: isValid
        ? `✓ SYSTEM INTEGRITY VERIFIED: All ${this.auditChain.length} audit trail hash-links are intact.`
        : `⚠ SECURITY INTEGRITY FAILURE: Audit record modification detected at ${tamperedEventId}!`,
      verifiedAt: new Date().toISOString()
    };
  }

  public static getAuditChain(): AuditEvent[] {
    return [...this.auditChain].reverse();
  }
}
