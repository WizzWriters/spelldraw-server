import { Socket } from 'socket.io'
import ShapeIoController from '../controllers/ShapeIoController'

function registerShapeEvents(socket: Socket) {
  socket.on('shape_create', (data) => ShapeIoController.create(socket, data))
  socket.on('shape_delete', (data) => ShapeIoController.delete(socket, data))
  socket.on('shape_list_share_resp', (data) =>
    ShapeIoController.listResponse(socket, data)
  )
}

export { registerShapeEvents }
