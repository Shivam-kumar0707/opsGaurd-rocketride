// =============================================================================
// AI / Human Alignment Feedback Analytics
// =============================================================================

import { FeedbackMetrics, RiskDomain } from '../types/opsguard';
import { FeedbackStore } from './feedbackStore';

export class FeedbackAnalyzer {
  public static calculateMetrics(): FeedbackMetrics {
    const records = FeedbackStore.getRecords();
    const totalReviewed = records.length;

    let approvedCount = 0;
    let modifiedCount = 0;
    let rejectedCount = 0;

    const domainBreakdown: FeedbackMetrics['domainBreakdown'] = {
      customer_churn: { total: 0, approved: 0, modified: 0, rejected: 0, approvalRatePct: 0 },
      contract_deadline: { total: 0, approved: 0, modified: 0, rejected: 0, approvalRatePct: 0 },
      project_delay: { total: 0, approved: 0, modified: 0, rejected: 0, approvalRatePct: 0 }
    };

    records.forEach(r => {
      if (r.humanDecision === 'APPROVED') approvedCount++;
      else if (r.humanDecision === 'MODIFIED') modifiedCount++;
      else if (r.humanDecision === 'REJECTED') rejectedCount++;

      const dom = domainBreakdown[r.domain];
      if (dom) {
        dom.total++;
        if (r.humanDecision === 'APPROVED') dom.approved++;
        else if (r.humanDecision === 'MODIFIED') dom.modified++;
        else if (r.humanDecision === 'REJECTED') dom.rejected++;
      }
    });

    Object.keys(domainBreakdown).forEach(key => {
      const domKey = key as RiskDomain;
      const dom = domainBreakdown[domKey];
      dom.approvalRatePct = dom.total > 0 ? Number(((dom.approved / dom.total) * 100).toFixed(1)) : 0;
    });

    return {
      totalReviewed,
      approvedCount,
      modifiedCount,
      rejectedCount,
      approvalRatePct: totalReviewed > 0 ? Number(((approvedCount / totalReviewed) * 100).toFixed(1)) : 0,
      modificationRatePct: totalReviewed > 0 ? Number(((modifiedCount / totalReviewed) * 100).toFixed(1)) : 0,
      rejectionRatePct: totalReviewed > 0 ? Number(((rejectedCount / totalReviewed) * 100).toFixed(1)) : 0,
      domainBreakdown
    };
  }
}
