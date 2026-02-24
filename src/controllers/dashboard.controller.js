import { getDashboardStats } from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Dashboard Controller.
 * Single endpoint, single responsibility: return aggregated stats.
 *
 * WHY SO SIMPLE?
 * Because all the complexity lives in the service (where it belongs).
 * The controller only translates "HTTP request → service call → HTTP response."
 */

// GET /api/dashboard
export const getStats = async (req, res) => {
  const stats = await getDashboardStats();
  sendSuccess(res, stats);
};
