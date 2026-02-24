import { asyncLocalStorageInstance } from "@/utils/context/correlationStore";
import winston from "winston";

export const correlationIdFormat = winston.format((info) => {
    const correlationId = asyncLocalStorageInstance.getStore() as string;

    if (!correlationId) {
      info.correlationId = 'N/A';
    } else {
      info.correlationId = correlationId
    }
    return info;
}); 