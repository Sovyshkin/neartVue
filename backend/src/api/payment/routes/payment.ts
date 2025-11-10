'use strict';

/**
 * payment router
 */

import { factories } from '@strapi/strapi';

const defaultRouter = factories.createCoreRouter('api::payment.payment');

const customRoutes = {
  routes: [
    {
      method: 'POST',
      path: '/payment/tinkoff/init',
      handler: 'api::payment.payment.initTinkoffPayment',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/payment/tinkoff/callback',
      handler: 'api::payment.payment.handleCallback',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    }
  ]
};

export default customRoutes;