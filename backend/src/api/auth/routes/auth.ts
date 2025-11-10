export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/send-password-change-code',
      handler: 'auth.sendPasswordChangeCode',
      config: {
        middlewares: [],
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/auth/change-password',
      handler: 'auth.changePassword',
      config: {
        middlewares: [],
        policies: [],
      },
    },
  ],
};