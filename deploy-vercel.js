const { execSync } = require('child_process');

const vercelToken = process.env.VERCEL_TOKEN;
const vercelProjectName = process.env.VERCEL_PROJECT_NAME;
const cwd = process.env.CWD || './buildArtifact';

try {
  // Print the project name and other relevant information
  console.log(`Deploying to Vercel project: ${vercelProjectName}`);

  // Run the Vercel CLI command with the --debug flag
  const command = `npx vercel --token ${vercelToken} --yes --cwd ${cwd} --debug`;
  const output = execSync(command, { stdio: 'inherit' });

  console.log('Vercel deployment output:');
  console.log(output.toString());
} catch (error) {
  console.error('Error during Vercel deployment:');
  console.error(error.message);
  process.exit(1);
}
