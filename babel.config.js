module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true },
        targets: '> 0.25%, not dead'
      }
    ],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
        helpers: true,
        regenerator: true,
        version: '^7.23.10'
      }
    ]
  ]
}; 