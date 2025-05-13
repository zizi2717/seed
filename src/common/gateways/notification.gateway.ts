import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { AuthService } from 'src/services/auth.service'
import { Injectable } from '@nestjs/common'

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
@Injectable()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private clients = new Map<string, Socket>() // userId ↔ socket 저장

    constructor(private readonly authService: AuthService) {}

    handleConnection(client: Socket) {
        const token = client.handshake.auth?.token
        const payload = this.authService.verifyToken(token)

        if (!payload) {
            console.log('Invalid token. Disconnecting socket...')
            client.disconnect()

            return
        }

        const userId = payload.userId
        console.log(`User connected: ${userId}`)

        this.clients.set(userId, client)

        client.on('disconnect', () => {
            this.clients.delete(userId)
        })
    }

    handleDisconnect(client: Socket) {
        // 정리 로직은 handleConnection에서 처리
    }

    // 외부에서 호출하여 알림 전송
    sendNotification(userId: string, message: string) {
        const client = this.clients.get(userId)

        if (client) {
            client.emit('notification', { message })
        }
    }
}