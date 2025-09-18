// src/iot/iot.gateway.ts
this.server.to(device.owner.id).emit('deviceUpdated', device); // Resident-only
this.server.to('managers').emit('estateDeviceUpdated', device); // Estate-wide
