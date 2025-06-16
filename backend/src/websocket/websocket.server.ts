import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { JwtService } from "@shared/utils";
import { AppDataSource } from "@config/data-source";
import { userRepository, userService } from "src/user";

// Map to store connected clients: userId -> WebSocket[]
const connectedClients = new Map<string, WebSocket[]>();

// Notification interface
export interface Notification {
  type: "TASK_UPDATE" | "NEW_COMMENT" | "TASK_SHARED";
  message: string;
  taskId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  timestamp: Date;
}

export const setupWebSocketServer = (server: any) => {
  const socketServer = new WebSocketServer({ server, path: "/ws" });

  socketServer.on("connection", async (ws, req) => {
    console.log("new client");
    const token = new URL(
      req.url || "",
      `http://${req.headers.host}`
    ).searchParams.get("token");

    if (!token) {
      ws.close(1008, "Authentication token missing");
      return;
    }

    try {
      const decoded = JwtService.verifyToken(token) as any;
      const userId = decoded?.userId;
      const user = await userService.findOneById(userId);

      if (!user) {
        ws.close(1008, "User not found");
        return;
      }

      if (!connectedClients.has(userId)) {
        connectedClients.set(userId, []);
      }
      connectedClients.get(userId)?.push(ws);

      ws.send(
        JSON.stringify({
          type: "CONNECTED",
          message: `WebSocket connected for ${user.firstName} ${user.lastName}`,
        })
      );

      ws.on("close", () => {
        const userClients = connectedClients.get(userId) || [];
        const index = userClients.indexOf(ws);
        if (index !== -1) {
          userClients.splice(index, 1);
        }
        if (userClients.length === 0) {
          connectedClients.delete(userId);
        }
      });
    } catch (err) {
      ws.close(1008, "Invalid token");
    }
  });
};

export const sendNotification = (
  userId: string,
  notification: Notification
) => {
  const clients = connectedClients.get(userId) || [];

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  });
};

export const broadcastNotification = (
  userIds: string[],
  notification: Notification
) => {
  userIds.forEach((userId) => sendNotification(userId, notification));
};
