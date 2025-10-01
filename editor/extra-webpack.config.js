var EventHooksPlugin = require('event-hooks-webpack-plugin');
var cpx = require('cpx');

module.exports = {
  module: {
    rules: [{
      test: /\.twig$/,
      loader: 'twig-loader',
    }]
  },

  resolve: {
    fallback: {
      fs: false,
      path: false,
    }
  },

  plugins: [
    new EventHooksPlugin({
      beforeRun: function () {
        cpx.copySync('../_api_app/app/**/*.twig', 'src/templates', {
          clean: true
        }, function (err) {
          if (err) {
            return console.error(err);
          }
          console.log('Twig files copied.');
        });
      }
    })
  ]
};
