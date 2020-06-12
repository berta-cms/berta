var EventHooksPlugin = require('event-hooks-webpack-plugin');
var cpx = require('cpx');

module.exports = {
  module: {
    rules: [{
      test: /\.twig$/,
      loader: 'twig-loader',
    }]
  },

  node: {
    fs: 'empty'
  },

  plugins: [
    new EventHooksPlugin({
      beforeRun: function () {
        cpx.copySync('../_api_app/app/Sites/**/*.twig', 'src/templates', {
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
