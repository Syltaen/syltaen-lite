// ==================================================
// > Assets
// ==================================================
const project                     = require("./package.json");
const webpack                     = require("webpack");
const autoprefixer                = require("autoprefixer");
const path                        = require("path");
const ExtractTextPlugin           = require("extract-text-webpack-plugin");
const UglifyJSPlugin              = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin     = require('optimize-css-assets-webpack-plugin');
const LiveReloadPlugin            = require('webpack-livereload-plugin');
const BrowserSyncPlugin           = require('browser-sync-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")
const glob                        = require("glob");

// ==================================================
// > Extracted outputs
// ==================================================
const bundle_css = new ExtractTextPlugin("css/bundle.css");


// ==================================================
// > CONFIG
// ==================================================
module.exports = env => {

    var config = {

        // ==================================================
        // > ENTRY
        // ==================================================
        entry: [

            "./scripts/builder.coffee",
            "./styles/builder.sass",

        ].concat(glob.sync('./views/**/[^_]*.pug')),

        devtool: "source-map",

        // ==================================================
        // > OUTPUT(S)
        // ==================================================
        output: {
            path: path.resolve(__dirname, "build"),
            filename: "js/bundle.js"
        },

        // ==================================================
        // > MODULES
        // ==================================================
        module: {
            rules: [

                // ========== PUG ========== //
                {
                    test: /\.pug$/,
                    use: [
                        "file-loader?name=../build/html/[name].html",
                        "extract-loader",
                        { loader : "html-loader", options: { attrs: false} },
                        { loader: "pug-html-loader", options: {data: {
                            version: Date.now(),
                            baseurl: env.prod
                                ? "https://www.urldeprod.com/"
                                : "http://localhost/_/syltaen/syltaen-lite/"
                        } } }
                    ]
                },


                // ========== COFFEESCRIPT ========== //
                {
                    test: /\.coffee$/,
                    use: ['coffee-loader?sourceMap']
                },

                // ========== SASS ========== //
                {
                    test: /\.sass$/,
                    use: bundle_css.extract({
                        fallback: "style-loader",
                        use: [
                            { loader: "css-loader", options: { url: false, sourceMap: true }, },
                            { loader: "postcss-loader", options: { plugins: () => [autoprefixer], sourceMap: true }},
                            "sass-loader?sourceMap"
                        ]
                    })
                },
            ]
        },

        // ==================================================
        // > PUGINS
        // ==================================================
        plugins: [

            // ========== DEV ========== //
            new LiveReloadPlugin({
                appendScriptTag: true,
                ignore: /\.js$|\.map$|\.html$/
            }),

            new BrowserSyncPlugin({
                proxy: "http://localhost/" + project.name, // Activate for livereload

                files: [
                    {
                        match: [
                            "**/*.pug"
                        ],
                        fn: function(event, file) {
                            if (event === "change") require("browser-sync").get("bs-webpack-plugin").reload();
                        }
                    }
                ]
            },
            {
                reload: false
            }),

            new FriendlyErrorsWebpackPlugin(),

            bundle_css,

            // ========== PROD ========== //
            // new UglifyJSPlugin(),
            // new OptimizeCssAssetsPlugin()
        ]
    };

    // ==================================================
    // > ENVIRONEMENTS PLUGINS
    // ==================================================
    if (env.prod) {
        config.plugins.push(new UglifyJSPlugin());
        config.plugins.push(new OptimizeCssAssetsPlugin());
    }


    // ========== RETURN ========== //
    return config;
};