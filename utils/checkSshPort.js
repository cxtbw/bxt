const net = require('net');

function checkSshPort(host, port = 22, timeout = 4000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(timeout);

    socket.once('connect', () => {
      socket.destroy();
      resolve(true); // ONLINE
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

module.exports = { checkSshPort };
