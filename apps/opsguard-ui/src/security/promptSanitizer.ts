// =============================================================================
// Prompt Injection Defense & Data Boundaries
// =============================================================================

import { SecurityEvent } from '../types/opsguard';
import { PolicyEngine } from './policyEngine';

export class PromptSanitizer {
  private static injectionPatterns = [
    /ignore (all )?previous instructions/i,
    /bypass (approval|security|permission)/i,
    /set risk (score )?to 0/i,
    /system prompt override/i,
    /grant admin role/i,
    /execute shell command/i
  ];

  public static sanitizeDataInput(rawText: string, actorName: string = 'User'): string {
    if (!rawText) return '';

    let hasInjection = false;
    let sanitizedText = rawText;

    for (const pattern of this.injectionPatterns) {
      if (pattern.test(sanitizedText)) {
        hasInjection = true;
        sanitizedText = sanitizedText.replace(pattern, '[REDACTED_PROMPT_INJECTION_ATTEMPT]');
      }
    }

    if (hasInjection) {
      const secEvent: SecurityEvent = {
        id: `SEC-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        eventType: 'PROMPT_INJECTION_DETECTED',
        severity: 'HIGH',
        actor: actorName,
        actorRole: 'ANALYST',
        details: `Prompt Injection Safeguard: Detected system instruction override directive in operational text payload. Sanitized as data.`
      };
      PolicyEngine.logSecurityEvent(secEvent);
    }

    return sanitizedText;
  }
}
