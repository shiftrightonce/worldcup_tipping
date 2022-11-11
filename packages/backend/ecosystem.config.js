module.exports = {
  apps: [
    {
      name: 'backend',
      // cwd: './backend',
      script: 'npm',
      args: 'run start'
    },
    {
      name: 'queue',
      // cwd: './backend',
      script: 'npm',
      args: 'run queue:start'
    }
  ]
};
