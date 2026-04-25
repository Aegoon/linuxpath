import Docker from 'dockerode';

const docker = new Docker(); // Connects via /var/run/docker.sock by default

const IMAGE_NAME = 'ubuntu:latest';
const CONTAINER_TTL = 30 * 60 * 1000; // 30 minutes

interface Session {
  containerId: string;
  lastSeen: number;
}

const activeSessions: Map<string, Session> = new Map();

export async function createContainer(userId: string): Promise<string> {
  // Check if session exists
  if (activeSessions.has(userId)) {
    const session = activeSessions.get(userId)!;
    try {
      const container = docker.getContainer(session.containerId);
      const data = await container.inspect();
      if (data.State.Running) {
        session.lastSeen = Date.now();
        return session.containerId;
      }
    } catch (e) {
      activeSessions.delete(userId);
    }
  }

  // Create new container
  const container = await docker.createContainer({
    Image: IMAGE_NAME,
    Tty: true,
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    OpenStdin: true,
    User: 'student',
    HostConfig: {
      Memory: 256 * 1024 * 1024,
      NanoCpus: 500000000, // 0.5 CPU
      NetworkMode: 'none',
      ReadonlyRootfs: true,
      CapDrop: ['ALL'],
      SecurityOpt: ['no-new-privileges'],
      PidsLimit: 50,
      Tmpfs: {
        '/home/student': 'rw,nosuid,nodev,size=50m',
        '/tmp': 'rw,nosuid,nodev,size=10m'
      }
    },
    Env: ['TERM=xterm-256color'],
  });

  await container.start();
  
  activeSessions.set(userId, {
    containerId: container.id,
    lastSeen: Date.now(),
  });

  return container.id;
}

export function getContainerId(userId: string): string | null {
  const session = activeSessions.get(userId);
  return session ? session.containerId : null;
}

export async function killContainer(userId: string) {
  const session = activeSessions.get(userId);
  if (session) {
    try {
      const container = docker.getContainer(session.containerId);
      await container.stop();
      await container.remove();
    } catch (e) {
      console.error(`Error removing container for ${userId}:`, e);
    }
    activeSessions.delete(userId);
  }
}

// Cleanup idle containers
setInterval(async () => {
  const now = Date.now();
  for (const [userId, session] of activeSessions.entries()) {
    if (now - session.lastSeen > CONTAINER_TTL) {
      console.log(`Cleaning up idle container for ${userId}`);
      await killContainer(userId);
    }
  }
}, 60 * 1000);
