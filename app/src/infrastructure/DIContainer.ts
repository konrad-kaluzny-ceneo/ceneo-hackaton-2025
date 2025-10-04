import { AnswerHandler } from "@/features/user-context/AnswerHandler";
import { Repository } from "./Repository";

// Typ dla konstruktora klasy
type Constructor<T = any> = new (...args: any[]) => T;

// Typ dla tokena - może być konstruktor lub symbol
type InjectionToken<T = any> = Constructor<T> | symbol;

// Mapa tokenów do instancji - obsługuje zarówno klasy jak i symbole
const providerMap = new Map<InjectionToken, unknown>();

// Inicjalizacja providerów w odpowiedniej kolejności
// Najpierw Repository (bez zależności)
providerMap.set(Repository, new Repository());

// Potem AnswerHandler (zależy od Repository)
providerMap.set(AnswerHandler, new AnswerHandler());

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
  const instance = providerMap.get(token);

  if (instance === undefined) {
    const tokenName = typeof token === 'function' ? token.name : token.toString();
    throw new Error(`No provider found for: ${tokenName}`);
  }

  return instance as T;
}