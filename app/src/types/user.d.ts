import { ContextItem } from "./context-item";

export interface User {
    id: string;
    name: string;
    email: string;
    image: string;

    historyOfTripSetIds: string[];
    userFeelingIds: string[];
}