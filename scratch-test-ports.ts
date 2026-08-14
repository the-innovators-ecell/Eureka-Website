import net from 'net';

const hosts = ['aws-0-ap-northeast-1.pooler.supabase.com', 'db.wqonwdwcdohrxrcceezm.supabase.co'];
const ports = [6543, 5432];

for (const host of hosts) {
  for (const port of ports) {
    const socket = new net.Socket();
    socket.setTimeout(4000);
    socket.on('connect', () => {
      console.log(`SUCCESS: Connected to ${host}:${port}`);
      socket.destroy();
    });
    socket.on('error', (err) => {
      console.log(`FAILED: ${host}:${port} - ${err.message}`);
    });
    socket.on('timeout', () => {
      console.log(`TIMEOUT: ${host}:${port}`);
      socket.destroy();
    });
    socket.connect(port, host);
  }
}
