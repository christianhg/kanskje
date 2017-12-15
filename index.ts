export interface Chain<A> {
  chain<B>(f: (a: A) => Chain<B>): Chain<B>
}

export interface Foldable<A> {
  fold<B>(f: (a: A) => B, g: () => B): B
}

export interface Functor<A> {
  map<B>(f: (a: A) => B): Functor<B>
}

export interface Maybe<A> extends Chain<A>, Foldable<A>, Functor<A> {
  chain<B>(f: (a: A) => Maybe<B>): Maybe<B>
  filter(f: (a: A) => boolean): Maybe<A>
  getOrElse(a: A): A
  guard<B extends A>(f: (a: A) => a is B): Maybe<B>
  isJust(): boolean
  isNothing(): boolean
  map<B>(f: (a: A) => B): Maybe<B>
  orElse(a: Maybe<A>): Maybe<A>
  unsafeGet(): A | void
}

class Just<A> implements Maybe<A> {
  private readonly value: A

  constructor(a: A) {
    this.value = a
  }

  chain<B>(f: (a: A) => Maybe<B>) {
    return f(this.value)
  }

  filter(f: (a: A) => boolean): Maybe<A> {
    return f(this.value) ? of(this.value) : new Nothing<A>()
  }

  fold<B>(f: (a: A) => B, g: () => B) {
    return f(this.value)
  }

  getOrElse(a: A) {
    return this.value
  }

  guard<B extends A>(f: (a: A) => a is B): Maybe<B> {
    return f(this.value) ? of(this.value) : new Nothing<B>()
  }

  isJust() {
    return true
  }

  isNothing() {
    return false
  }

  map<B>(f: (a: A) => B) {
    return of(f(this.value))
  }

  orElse(a: Maybe<A>) {
    return of(this.value)
  }

  unsafeGet() {
    return this.value
  }
}

class Nothing<A> implements Maybe<A> {
  chain<B>(f: (a: A) => Maybe<B>) {
    return new Nothing<B>()
  }

  filter(f: (a: A) => boolean) {
    return new Nothing<A>()
  }

  fold<B>(f: (a: A) => B, g: () => B) {
    return g()
  }

  getOrElse(a: A) {
    return a
  }

  guard<B extends A>(f: (a: A) => a is B) {
    return new Nothing<B>()
  }

  isJust() {
    return false
  }

  isNothing() {
    return true
  }

  map<B>(f: (a: A) => B) {
    return new Nothing<B>()
  }

  orElse(a: Maybe<A>) {
    return a
  }

  unsafeGet() {
    throw new TypeError('A Nothing holds no value.')
  }
}

export type Nullable<A> = A | undefined | null

export function all<A>(maybes: Maybe<A>[]): Maybe<A[]>
export function all<A, B>(maybes: [Maybe<A>, Maybe<B>]): Maybe<[A, B]>
export function all<A, B, C>(
  maybes: [Maybe<A>, Maybe<B>, Maybe<C>]
): Maybe<[A, B, C]>
export function all<A, B, C, D>(
  maybes: [Maybe<A>, Maybe<B>, Maybe<C>, Maybe<D>]
): Maybe<[A, B, C, D]>
export function all<A, B, C, D, E>(
  maybes: [Maybe<A>, Maybe<B>, Maybe<C>, Maybe<D>, Maybe<E>]
): Maybe<[A, B, C, D, E]>
export function all(maybes: Maybe<any>[]): Maybe<any[]> {
  return maybes.every(maybe => maybe.isJust())
    ? of(maybes.map(maybe => maybe.unsafeGet()))
    : new Nothing<any>()
}

export function fromNullable<A>(a: Nullable<A>): Maybe<A> {
  return a !== undefined && a !== null ? new Just(a) : new Nothing<A>()
}

export function of<A>(a: A): Maybe<A> {
  return new Just(a)
}
