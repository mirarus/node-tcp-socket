const net = require('net');

const host = '127.0.0.1'; 
const port = 6000;

class Server {

	constructor(_port, _host) { 
		this.socket = net.createServer();
		this.address = _host || host; 
		this.port = _port || port; 
		this.sockets = []; 
		this.init();
	} 

	init() { 
		this.socket.listen(this.port, this.address, () => console.log(`TCP server listening on ${this.address}:${this.port}`)); 

		this.socket.on('connection', (socket) => {
			var clientAddress = `${socket.remoteAddress}:${socket.remotePort}`; 
			console.log(`new client connected: ${clientAddress}`); 
			this.sockets.push(socket); 

			socket.on('data', (data) => {
				console.log(`Client ${clientAddress}: ${data}`); 
				this.sockets.forEach((sock) => sock.write(socket.remoteAddress + ':' + socket.remotePort + " said " + data + '\n')); 
			}); 

			socket.on('close', (data) => {
				let index = this.sockets.findIndex((o) => { 
					return o.remoteAddress === socket.remoteAddress && o.remotePort === socket.remotePort; 
				});
				if (index !== -1) this.sockets.splice(index, 1); 
				this.sockets.forEach((sock) => sock.write(`${clientAddress} disconnected\n`));
				console.log(`connection closed: ${clientAddress}`); 
			}); 

			socket.on('error', (err) => console.log(`Error occurred in ${clientAddress}: ${err.message}`)); 
		});
 	}
}
module.exports = Server;