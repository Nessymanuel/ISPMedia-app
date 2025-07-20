// lib/signalr.ts
import * as SignalR from "@microsoft/signalr";

let connection: SignalR.HubConnection | null = null;

export const connectToNotificationHub = (userId: number, onReceive: (msg: string) => void) => {
  connection = new SignalR.HubConnectionBuilder()
    .withUrl(`${process.env.API_BASE_URL}/notificationHub?userId=${userId}`)
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveNotification", onReceive);

  connection
    .start()
    .then(() => console.log("✅ SignalR conectado"))
    .catch((err) => console.error("❌ SignalR erro:", err));
};

export const disconnectFromNotificationHub = () => {
  connection?.stop();
};