import Docker from 'dockerode';

const docker = new Docker();

export async function validateChallenge(containerId: string, checkScript: string): Promise<{ passed: boolean }> {
  try {
    const container = docker.getContainer(containerId);
    
    const exec = await container.exec({
      Cmd: ['/bin/bash', '-c', checkScript],
      AttachStdout: true,
      AttachStderr: true
    });

    const stream = await exec.start({});
    
    return new Promise((resolve, reject) => {
      let output = '';
      stream.on('data', (chunk) => {
        output += chunk.toString();
      });

      stream.on('end', () => {
        const passed = output.trim().includes('PASS');
        resolve({ passed });
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  } catch (err) {
    console.error('Validation error:', err);
    throw err;
  }
}
