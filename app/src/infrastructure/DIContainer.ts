import { AnswerHandler } from "@/features/user-context/AnswerHandler";
import { Repository } from "./Repository";
import { TaskQueue } from "./TaskQueue";
import { WebSocketManager } from "./WebSocketManager";
import { GetUserTripsHandler } from "@/features/trips/GetUserTrips";
import { AttractionSearchService } from "@/features/rag";

// Typ dla konstruktora klasy
type Constructor<T = any> = new (...args: any[]) => T;

// Typ dla tokena - może być konstruktor lub symbol
type InjectionToken<T = any> = Constructor<T> | symbol;

// Mapa tokenów do instancji - obsługuje zarówno klasy jak i symbole
const providerMap = new Map<InjectionToken, unknown>();

// Inicjalizacja providerów w odpowiedniej kolejności
// Najpierw usługi bez zależności
providerMap.set(Repository, new Repository());

const taskQueue = new TaskQueue();
const wsManager = new WebSocketManager();

// Wire up TaskQueue and WebSocketManager
taskQueue.setWebSocketManager(wsManager);

providerMap.set(TaskQueue, taskQueue);
providerMap.set(WebSocketManager, wsManager);

// Potem AnswerHandler (zależy od Repository)
providerMap.set(AnswerHandler, new AnswerHandler());
providerMap.set(AttractionSearchService, new AttractionSearchService());

// GetUserTripsHandler needs lazy initialization to avoid circular dependency
// It will be created on first access in the inject function

/**
 * Funkcja inject podobna do tej z Angulara
 * Umożliwia wstrzykiwanie zależności za pomocą klas lub symboli
 *
 * @example
 * // Używając klasy jako tokena
 * const repository = inject(Repository);
 * const answerHandler = inject(AnswerHandler);
 */
export function inject<T>(token: Constructor<T>): T;
export function inject<T>(token: symbol): T;
export function inject<T>(token: InjectionToken<T>): T {
  let instance = providerMap.get(token);

  // Lazy initialization for classes that have circular dependencies
  if (instance === undefined && typeof token === 'function') {
    // Check if this is GetUserTripsHandler
    if (token === GetUserTripsHandler) {
      instance = new GetUserTripsHandler();
      providerMap.set(token, instance);
    }
  }

  if (instance === undefined) {
    const tokenName = typeof token === 'function' ? token.name : token.toString();
    throw new Error(`No provider found for: ${tokenName}`);
  }

  return instance as T;
}