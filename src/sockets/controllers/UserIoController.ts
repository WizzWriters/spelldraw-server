import { Socket } from 'socket.io'

export default class UserIoController {
  public static updatePosition(socket: Socket, data: any) {
    socket.to(data.board_id).emit('position_update', data)
  }
}
