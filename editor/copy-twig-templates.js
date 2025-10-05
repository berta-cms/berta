// Angular uses the same twig templates from backend
// This copy twig templates from backend to frontend
// so that they can be used in the Angular app via twig-loader

const cpx = require("cpx");

cpx.copySync(
  "../_api_app/app/**/*.twig",
  "src/templates",
  {
    clean: true,
  },
  function (err) {
    if (err) {
      return console.error(err);
    }
    console.log("Twig files copied.");
  }
);
