module.exports = {
	runtimeCaching: [
	  {
		urlPattern: /^https:\/\/challenge\.thef2e\.com\/.*/,
		handler: 'networkFirst',
	  }
	],
  };