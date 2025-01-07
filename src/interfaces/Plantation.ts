import type User from "./User";
import type Plant from "./Plant";

export default interface Plantation {
    plantationId: number;
    name: string;
    startDate: string;
    endDate: string;
    city: string;
    user: User;
    plant: Plant;
} 