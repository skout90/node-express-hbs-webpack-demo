module.exports = function (api) {
    api.assertVersion('^7.4');
    api.cache(true);
    return {
        'presets': [
            ['@babel/preset-env', {
                'modules': false,
                'targets': {
                    'browsers': ['> 1%', 'last 10 versions', 'not ie <= 9']
                },
                'useBuiltIns': 'usage',
                'corejs': { 'version': 3, proposals: true }
            }]
        ],
        'plugins': [
            ['@babel/plugin-proposal-decorators', { "legacy": true }],
            ['@babel/plugin-proposal-class-properties', { "loose": true }],
            '@babel/plugin-proposal-export-default-from',
            ['@babel/plugin-transform-runtime', { 'corejs': 3, "helpers": true, "regenerator": false, "useESModules": true, }]
        ]
    };
};