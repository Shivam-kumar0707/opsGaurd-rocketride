// =============================================================================
// Protected Mode System Integrity Manager
// =============================================================================

import { SecurityEvent } from '../types/opsguard';
import { PolicyEngine } from './policyEngine';

export type IntegrityMode = 'NORMAL' | 'PROTECTED';

export class SystemProtection {
  private static mode: IntegrityMode = 'NORMAL';
  private static triggerReason: string | null = null;

  public static triggerProtectedMode(reason: string): void {
    this.mode = 'PROTECTED';
    this.triggerReason = reason;

    const secEvent: SecurityEvent = {
      id: `SEC-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eventType: 'PROTECTED_MODE_TRIGGERED',
      severity: 'CRITICAL',
      actor: 'System Integrity Verifier',
      actorRole: 'ADMIN',
      details: `⚠ OpsGuard Protected Mode Activated: ${reason}. All privileged execution and model activations blocked.`
    };
    PolicyEngine.logSecurityEvent(secEvent);
  }

  public static resetToNormal(actorName: string): void {
    this.mode = 'NORMAL';
    this.triggerReason = null;

    const secEvent: SecurityEvent = {
      id: `SEC-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eventType: 'AUTHENTICATION_SUCCESS',
      severity: 'LOW',
      actor: actorName,
      actorRole: 'ADMIN',
      details: `System Protection reset to NORMAL mode by ${actorName}.`
    };
    PolicyEngine.logSecurityEvent(secEvent);
  }

  public static getMode(): IntegrityMode {
    return this.mode;
  }

  public static getReason(): string | null {
    return this.triggerReason;
  }

  public static isProtected(): boolean {
    return this.mode === 'PROTECTED';
  }
}
