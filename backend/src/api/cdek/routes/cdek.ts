export default {
  routes: [
    {
      method: 'GET',
      path: '/cdek/token',
      handler: 'cdek.getToken',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/cdek/delivery-points',
      handler: 'cdek.getDeliveryPoints',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/cdek/calculate',
      handler: 'cdek.calculateDelivery',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/cdek/orders',
      handler: 'cdek.createOrder',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/cdek/orders/:uuid',
      handler: 'cdek.getOrderStatus',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    }
  ]
};
