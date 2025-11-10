export default {
  routes: [
    {
      method: 'POST',
      path: '/email-auth/send-code',
      handler: 'email-auth.sendCode',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/email-auth/verify-code',
      handler: 'email-auth.verifyCode',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};