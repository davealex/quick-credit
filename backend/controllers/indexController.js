exports.getIndex = (req, res) => {
  res.status(200).json(
    {
      status: 200,
      message: 'Welcome to Quick Credit! (API)',
      data: {
        service: 'quick-credit',
        version: '1.0',
        github: 'https://github.com/davealex/quick-credit',
      },
    },
  );
};
