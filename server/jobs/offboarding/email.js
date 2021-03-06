/* eslint-disable no-param-reassign */
import { sendITOffboardingMail, sendSOPOffboardingMail } from '../../modules/email/emailModule';
import { executeEmailAutomation } from '../helpers';

/**
 * @desc Automates developer offboarding via email
 *
 * @param {Object} placement Placement record whose developer is to be offboarded
 * @param {Object} partner Partner details to be used in the automation
 * @param {Object} automationId ID of the particular automation
 * @returns {Promise} Promise to return the result of the email automation executed
 */
export default function emailOffboarding(placement, partner, automationId) {
  return executeEmailAutomation(
    [sendSOPOffboardingMail, sendITOffboardingMail],
    placement,
    partner.location,
    automationId,
  );
}
