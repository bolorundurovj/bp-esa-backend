/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-console */
import paginationMeta from '../helpers/paginationHelper';
import { paginationResponse, response } from '../utils/formatter';
import { isValidDateFormat, isValidStartDate } from '../helpers/dateHelpers';
import { upsellingPartnerQuery, partnerStatsQuery } from '../utils/sequelizeFunctions/dashboardQuery';

/**
 * Returns pagination in JSON format
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {object} JSON object
 */
const upselllingPartnerPaginatedData = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const offset = limit * (page - 1);

  const { date = {} } = req.query;

  const { dateFrom, dateTo } = isValidStartDate(date);

  const allData = await upsellingPartnerQuery('onboarding', offset, limit, dateFrom, dateTo);
  const data = { count: allData.count.length };
  const { numberOfPages, nextPage, prevPage } = paginationMeta(page, data.count, limit);
  return paginationResponse(res, allData.rows, page, numberOfPages, data, nextPage, prevPage);
};

/**
 * @desc Returns count and value in JSON format
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {object} JSON object
 */
const PartnerStats = async (req, res) => {
  const { date = {} } = req.query;
  const { dateFrom, dateTo } = isValidStartDate(date);

  const allData = await partnerStatsQuery(dateFrom, dateTo);
  return response(res, allData);
};

const responseData = async (req, res, val) => {
  const obj = { upSelling: upselllingPartnerPaginatedData, partnerStats: PartnerStats };
  const { date = {} } = req.query;

  throw !isValidDateFormat(date.startDate, date.endDate) ? new Error('Invalid date format provided please provide date in iso 8601 string') : await obj[val](req, res);
};

export default class DashboardController {
  /**
   * @desc Gets onboarding partner results and returns to user
   *
   * @param {object} req Get request object from client
   * @param {object} res REST Response object
   * @returns {object} Response containing status message and dashboard data
   */

  static async getUpsellingPartners(req, res) {
    try {
      return await responseData(req, res, 'upSelling');
    } catch (err) {
      console.log('err', err);
      return res.status(400).json({ error: err.message });
    }
  }

  /**
   * @desc Gets partner statistics results and returns to user
   *
   * @param {object} req Get request object from client
   * @param {object} res REST Response object
   * @returns {object} Response containing status message and dashboard data
   */

  static async getPartnerStats(req, res) {
    try {
      return await responseData(req, res, 'partnerStats');
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}