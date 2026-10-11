const fs = require("node:fs");
const path = require("node:path");

// Karma necesita encontrar Google Chrome.
const rutasChrome = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  path.join(
    process.env.LOCALAPPDATA || "",
    "Google/Chrome/Application/chrome.exe"
  ),
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

if (!process.env.CHROME_BIN) {
  const chrome = rutasChrome.find((ruta) => fs.existsSync(ruta));

  if (chrome) {
    process.env.CHROME_BIN = chrome;
  }
}

module.exports = function (config) {
  config.set({
    frameworks: ["jasmine"],

    files: ["test/index.js"],

    preprocessors: {
      "test/index.js": ["webpack"],
    },

    webpack: {
      mode: "development",
      devtool: "inline-source-map",

      resolve: {
        extensions: [".js", ".jsx"],
      },

      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,

            use: {
              loader: "babel-loader",

              options: {
                presets: [
                  ["@babel/preset-env", { targets: { chrome: "120" } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],

                plugins: [
                  [
                    "istanbul",
                    {
                      include: ["src/**/*.js", "src/**/*.jsx"],
                      exclude: ["src/main.jsx"],
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    },

    reporters: ["progress", "coverage"],

    coverageReporter: {
      dir: "coverage",
      subdir: ".",

      reporters: [
        { type: "html" },
        { type: "text-summary" },
        { type: "json-summary" },
      ],
    },

    browsers: ["ChromeHeadless"],
    singleRun: true,

    client: {
      jasmine: {
        random: false,
      },
    },
  });
};