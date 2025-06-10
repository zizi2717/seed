// @Entity()
// export class Order extends TypeormEntity {
//     @Column()
//     userId: number

//     @Column()
//     totalAmount: number

//     @Column()
//     status: 'PENDING' | 'PAID' | 'FAILED'
// }

// @Entity()
// export class Payment extends TypeormEntity {
//     @Column()
//     orderId: number

//     @Column()
//     amount: number

//     @Column()
//     paymentMethod: string

//     @Column()
//     status: 'SUCCESS' | 'FAILED'
// }

// @Entity()
// export class UserWallet extends TypeormEntity {
//     @Column()
//     userId: number

//     @Column()
//     balance: number
// }

// @Injectable()
// export class PaymentService {
//     constructor(
//         private transactionService: TypeormTransactionService,
//         private externalPaymentApi: ExternalPaymentApi
//     ) {}

//     async processPayment(userId: number, orderId: number, amount: number): Promise<Payment> {
//         return this.transactionService.execute(async (transaction) => {
//             // 1. 주문 정보 조회 및 상태 확인
//             const order = await transaction.queryRunner.manager.findOne(Order, { 
//                 where: { id: orderId, userId } 
//             })
            
//             if (!order || order.status !== 'PENDING') {
//                 transaction.rollback()
//                 throw new Error('Invalid order status')
//             }

//             // 2. 사용자 지갑 잔액 확인 (포인트 결제인 경우)
//             const wallet = await transaction.queryRunner.manager.findOne(UserWallet, {
//                 where: { userId }
//             })

//             if (wallet && wallet.balance < amount) {
//                 transaction.rollback()
//                 throw new Error('Insufficient balance')
//             }

//             // 3. 외부 결제 API 호출
//             let paymentResult
//             try {
//                 paymentResult = await this.externalPaymentApi.charge(amount)
//             } catch (error) {
//                 // 외부 API 실패 시 롤백
//                 transaction.rollback()
//                 throw new Error('Payment API failed')
//             }

//             // 4. 결제 기록 생성
//             const payment = await transaction.create(Payment, {
//                 orderId,
//                 amount,
//                 paymentMethod: 'CARD',
//                 status: paymentResult.success ? 'SUCCESS' : 'FAILED'
//             })

//             if (!paymentResult.success) {
//                 transaction.rollback()
//                 throw new Error('Payment processing failed')
//             }

//             // 5. 주문 상태 업데이트
//             order.status = 'PAID'
//             await transaction.update(order)

//             // 6. 포인트 차감 (포인트 결제인 경우)
//             if (wallet) {
//                 wallet.balance -= amount
//                 await transaction.update(wallet)
//             }

//             // 7. 모든 작업이 성공하면 자동 커밋됨
//             return payment
//         })
//     }

//     async refundPayment(paymentId: number): Promise<void> {
//         return this.transactionService.execute(async (transaction) => {
//             // 1. 결제 정보 조회
//             const payment = await transaction.queryRunner.manager.findOne(Payment, {
//                 where: { id: paymentId }
//             })

//             if (!payment || payment.status !== 'SUCCESS') {
//                 transaction.rollback()
//                 throw new Error('Cannot refund this payment')
//             }

//             // 2. 주문 정보 조회
//             const order = await transaction.queryRunner.manager.findOne(Order, {
//                 where: { id: payment.orderId }
//             })

//             // 3. 외부 환불 API 호출
//             try {
//                 await this.externalPaymentApi.refund(payment.id, payment.amount)
//             } catch (error) {
//                 transaction.rollback()
//                 throw new Error('Refund API failed')
//             }

//             // 4. 주문 상태 변경
//             if (order) {
//                 order.status = 'PENDING'
//                 await transaction.update(order)
//             }

//             // 5. 사용자 지갑 복구 (포인트 결제였던 경우)
//             const wallet = await transaction.queryRunner.manager.findOne(UserWallet, {
//                 where: { userId: order.userId }
//             })

//             if (wallet) {
//                 wallet.balance += payment.amount
//                 await transaction.update(wallet)
//             }

//             // 6. 결제 기록 삭제 (또는 상태 변경)
//             await transaction.delete(payment)
//         })
//     }
// }
