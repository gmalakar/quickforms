const path = require('path');

module.exports = {
    entry: './src/quickforms.js',
    mode: "development",
    output: {
        filename: 'quickforms.js',
        path: path.resolve(__dirname, './dist'),
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '/'),
        },
        compress: true,
        port: 9000,
    },
};