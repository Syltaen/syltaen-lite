// =============================================================================
// > ASSETS
// =============================================================================

// Config
baseurl = {
    "development": "http://localhost/_/syltaen/syltaen-lite/",
    "production": "https://www.example.com/",
};

// Utils
const webpack              = require("webpack");
const path                 = require("path")
const glob                 = require("glob");

// Plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const LiveReloadPlugin     = require("webpack-livereload-plugin")
const BrowserSyncPlugin    = require("browser-sync-webpack-plugin")
const TerserPlugin         = require("terser-webpack-plugin");
const CssMinimizerPlugin   = require("css-minimizer-webpack-plugin")
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const HtmlWebpackPlugin    = require('html-webpack-plugin');

module.exports = (env, argv) => ({
    cache: true,
    stats: "errors-only",
    devtool: false,

    // IN
    entry: [
        "./scripts/builder.coffee",
        "./styles/builder.sass",
    ].concat(glob.sync("./views/**/[^_]*.pug")),

    // OUT
    output: {
        path: path.resolve(__dirname, "public"),
        publicPath: "/",
        filename: 'js/bundle.js?[hash]',
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
                test: /\.pug$/,
                use: [
                    "html-loader",
                    {
                        loader: "pug-html-loader",
                        options: {data: {baseurl: baseurl[argv.mode]}}
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
                    "sass-loader"
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
            filename: "css/bundle.css?[hash]",
        }),

        // Extract each Pug file to their own HTML file
        ...glob.sync("./views/**/[^_]*.pug").map((file) => {
            return new HtmlWebpackPlugin({
                template: file,
                filename: 'html/' + file.replace('./views/', '').replace('.pug', '.html'),
                publicPath: './public/',
            })
        }),

        // Allow SASS live reload
        new LiveReloadPlugin({
            appendScriptTag: true,
            ignore: /\.js$|\.map$|\.html$/
        }),

        // Allow brower auto-reload on php/pug file changes
        new BrowserSyncPlugin({
            proxy: baseurl[argv.mode],
            files: [
                "**/*.php",
                "**/*.pug"
            ]
        }, {reload: false}),

        new FriendlyErrorsWebpackPlugin(),
    ]
});