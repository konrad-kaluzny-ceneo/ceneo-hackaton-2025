import { AnswerHandler } from "@/features/user-context/AnswerHandler";
import { Repository } from "./Repository";

// Typ dla konstruktora klasy
type Constructor<T = any> = new (...args: any[]) => T;

// Typ dla tokena - może być konstruktor lub symbol
type InjectionToken<T = any> = Constructor<T> | symbol;

// Mapa tokenów do instancji - obsługuje zarówno klasy jak i symbole
const providerMap = new Map<InjectionToken, unknown>([
  [Repository, new Repository()],
  [AnswerHandler, new AnswerHandler()],
]);

/**
 * Funkcja inject podobna do tej z Angulara
 * Umożliwia wstrzykiwanie zależności za pomocą klas lub symboli
 *
 * @example
 * // Używając klasy jako tokena
 * const repository = inject(InMemoryRepository);
 * const answerHandler = inject(AnswerHandler);
 */
export function inject<T>(token: Constructor<T>): T;
export function inject<T>(token: symbol): T;
export function inject<T>(token: InjectionToken<T>): T {
  const instance = providerMap.get(token);

  if (instance === undefined) {
    const tokenName = typeof token === 'function' ? token.name : token.toString();
    throw new Error(`No provider found for: ${tokenName}`);
  }

  return instance as T;
}