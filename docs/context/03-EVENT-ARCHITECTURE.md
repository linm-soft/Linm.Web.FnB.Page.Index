# Linm F&B — Event Architecture

## 1. Event Bus

Platform: **LINM.Platform.Eventing** (outbox + worker) hoặc RabbitMQ tùy triển khai phase 2.

Guest path ưu tiên **SignalR** cho latency thấp; events dùng cho audit, analytics, retry.

## 2. Event Schema (canonical envelope)

```json
{
  "eventId": "uuid",
  "eventType": "FnB.OrderLineAdded",
  "occurredAt": "2026-06-07T10:30:00Z",
  "tenantId": "FM06",
  "branchId": "BR-HN-01",
  "correlationId": "session-uuid",
  "payload": { }
}
```

## 3. Event Catalog

| Event | Producer | Consumers | Side effect |
|-------|----------|-----------|-------------|
| `FnB.SessionStarted` | Order | Notification | Push guest UI "session active" |
| `FnB.OrderLineAdded` | Order | Kitchen, Notification | Guest gửi order — chờ NV xác nhận |
| `FnB.OrderConfirmedByWaiter` | Order / Waiter | Kitchen, Notification, **Billing meter** | NV xác nhận → gửi bếp; **+1 lượt quota** (mô hình thuê A) |
| `FnB.KitchenTicketConfirmed` | Kitchen | Notification | Guest sees "đang chế biến" |
| `FnB.ServiceCallRequested` | Order | Notification | Waiter alert (khăn, nước, hoàn trả…) |
| `FnB.PaymentRequested` | Order | Payment | Lock bill total, start payment window |
| `FnB.PaymentProofUploaded` | Payment | Notification | Staff queue "chờ xác nhận CK" |
| `FnB.PaymentConfirmed` | Payment | Order, Notification | Close session → trigger feedback UI |
| `FnB.FeedbackSubmitted` | Order | Admin/Analytics | Store rating + comment |

## 4. Worker Logic

```
OrderLineAdded
  → KitchenService.UpsertTicket(sessionId, lines)
  → SignalR KitchenHub.Clients.Group(branchId).Send("ticketUpdated")

PaymentConfirmed
  → OrderService.CloseSession(sessionId)
  → SignalR TableSessionHub.Clients.Group(sessionId).Send("showFeedback")
```

## 5. Retry & Dead Letter

| Policy | Value |
|--------|-------|
| Max retries | 5 exponential backoff |
| Idempotency key | `eventId` + handler name |
| Dead letter | `fnb_event_dead_letter` table + admin replay UI (phase 2) |
| Out-of-order | Kitchen merges lines by `sessionId` + `lineVersion` |
