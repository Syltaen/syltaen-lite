// =============================================================================
// > ASSETS
// =============================================================================

// Utils
const project              = require("./package.json");
const webpack              = require("webpack");
const path                 = require("path");
const glob                 = require("glob");

// Plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const LiveReloadPlugin     = require("webpack-livereload-plugin")
const BrowserSyncPlugin    = require("browser-sync-webpack-plugin")
const TerserPlugin         = require("terser-webpack-plugin");
const CssMinimizerPlugin   = require("css-minimizer-webpack-plugin")
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin')


module.exports = {
    cache: true,
    stats: false,

    // IN
    entry: [
        "./scripts/builder.coffee",
        "./styles/builder.sass",
    ].concat(glob.sync("./views/**/[^_]*.pug")),

    // OUT
    output: {
        path: path.resolve(__dirname, "build/assets"),
        filename: 'js/bundle.js',
    },

    // BUILD
    optimization: {
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin()
        ],
    },

    // ==================================================
    // > RULES
    // ==================================================
    module: {
        rules: [

            // Pug
            {
                test: /index\.pug$/,
                use: [
                    "file-loader?name=../index.html",
                    {
                        loader: "pug-html-loader",
                        options: {data: {
                            asset: (file) => { return "assets/" + file + "?v=" + Date.now(); },
                            link: (endpoint = "") => { return "./" + endpoint; },
                            bg: (file) => { return "background-image: url(assets/img/" + file + "?v=" + Date.now() + ");"; },
                        }}
                    }
                ]
            },
            {
                test: /[^(index)]\.pug$/,
                use: [
                    "file-loader?name=../[name]/index.html",
                    {
                        loader: "pug-html-loader",
                        options: {data: {
                            asset: (file) => { return "../assets/" + file + "?v=" + Date.now(); },
                            link: (endpoint = "") => { return "../" + endpoint; },
                            bg: (file) => { return "background-image: url(../assets/img/" + file + "?v=" + Date.now() + ");"; },
                        }}
                    }
                ]
            },

            // Coffee
            {
                test: /\.coffee$/,
                loader: "coffee-loader",
            },

            // Sass
            {
                test: /\.sass$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { url: false }, },
                    { loader: "postcss-loader", options: { postcssOptions: { plugins: [require("autoprefixer")({"overrideBrowserslist": ["> 1%", "last 10 versions"]})] }}},
                    { loader: "sass-loader", options: { implementation: require("sass-embedded") }}
                ],
            },
        ],
    },

    // ==================================================
    // > PLUGINS
    // ==================================================
    plugins: [

        // Makes jQuery Available everywhere
        new webpack.ProvidePlugin({
            $:      "jquery",
            jQuery: "jquery"
        }),

        // Extract CSS to their own files
        new MiniCssExtractPlugin({
            chunkFilename: "[name].css",
            filename: "css/bundle.css"
        }),

        // Allow SASS live reload
        new LiveReloadPlugin({
            appendScriptTag: true,
            ignore: /\.js$|\.map$|\.html$/
        }),

        // Allow brower auto-reload on php/pug file changes
        new BrowserSyncPlugin({
            proxy: "http://localhost/" + project.name + "/build/",
            files: [
                "**/*.php",
                "**/*.pug"
            ]
        }, {reload: false}),

        new FriendlyErrorsWebpackPlugin(),
    ]
}