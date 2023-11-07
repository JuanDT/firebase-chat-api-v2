import { Mensaje } from "./mensaje";

export interface ChatGpt{
    id: string,
    mensajes: Mensaje[]
}