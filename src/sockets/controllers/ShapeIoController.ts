import { Socket } from 'socket.io'

export default class ShapeIoController {
  public static create(socket: Socket, data: any) {
    socket.to(data.board_id).emit('shape_create', data)
  }

  public static delete(socket: Socket, data: any) {
    socket.to(data.board_id).emit('shape_delete', data)
  }

  public static listResponse(socket: Socket, data: any) {
    socket.to(data.socket).emit('shape_list', data)
  }
}
