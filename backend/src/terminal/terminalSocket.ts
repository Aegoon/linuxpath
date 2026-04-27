import { Server } from 'socket.io';

export function initTerminalSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log('Terminal client connected:', socket.id);

    socket.on('terminal:input', (data: string) => {
      socket.emit('terminal:output', data);
    });

    socket.on('disconnect', () => {
      console.log('Terminal client disconnected:', socket.id);
    });
  });
}
