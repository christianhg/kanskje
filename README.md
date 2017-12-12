# kanskje

> Simplistic Maybe monad written in TypeScript

[![npm module](https://badge.fury.io/js/kanskje.svg)](https://www.npmjs.org/package/kanskje)
[![Coverage status](https://codecov.io/gh/christianhg/kanskje/branch/master/graph/badge.svg)](https://codecov.io/gh/christianhg/kanskje)
[![Build status](https://travis-ci.org/christianhg/kanskje.svg?branch=master)](https://travis-ci.org/christianhg/kanskje)
[![dependencies status](https://david-dm.org/christianhg/kanskje.svg)](https://david-dm.org/christianhg/kanskje)
[![devDependencies status](https://david-dm.org/christianhg/kanskje/dev-status.svg)](https://david-dm.org/christianhg/kanskje?type=dev)

## Introduction

A Maybe represents a wrapper around any value - most commonly values that might be nullable. Having this wrapper is useful because it guards against `null` and `undefined` when doing computations on the value. The idea is that the Maybe deals with nullables internally, thus omitting the need for conditionals like `if`s. Not until the very end when it's needed to unwrap the value again, is it necessary to deal with the fact that it was or somehow became nullable.

Even though they can't be constructed individually, the `Maybe` consists of two classes: `Just` and `Nothing`. The `Maybe` is a `Just` if it holds a value and a `Nothing` if it doesn't.

```js
Maybe.fromNullable(['foo', 'bar', 'baz'][2]) // Just('baz')
  .map(x => x.toUpperCase()) // Just('BAZ')

Maybe.fromNullable(['foo', 'bar', 'baz'][3]) // Nothing()
  .map(x => x.toUpperCase()) // Nothing()
```

There exists a number of great resources on Maybe monads - including
[The Marvellously Mysterious JavaScript Maybe Monad](https://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/) by [@jrsinclair](https://twitter.com/jrsinclair) and [Professor Frisby's Mostly Adequate Guide to Function Programming](https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch8.md#schr%C3%B6dingers-maybe) by [@drboolean](https://twitter.com/drboolean) - that one might want to get familiar with. If you are used to Promises, you are essentially already familiar with monads.

## Usage

```js
import * as Maybe from 'kanskje'

const persons = [
  {
    name: 'Alice'
  },
  {
    age: 30
  },
  {
    age: 42,
    name: 'Carl'
  }
]

const compose = g => f => a => g(f(a))
const isEven = a => a % 2 === 0
const length = a => a.length
const safeProp = b => a => Maybe.fromNullable(a[b])

Maybe.fromNullable(persons[2])
  .chain(safeProp('name'))
  .filter(compose(isEven, length))
// => Just('Carl')

Maybe.fromNullable(persons[3])
  .chain(safeProp('name'))
  .filter(compose(isEven, length))
// => Nothing()
```

## Why kanskje?

Kanskje stems from the need of a simple Maybe monad with type declarations making it usable for both JavaScript and TypeScript. The source code is purposely kept simple with one-line methods and no method aliases. Unlike some Maybe monads, kanskje doesn't perform behind the scenes conversions from `Just` to `Nothing`. As an example you can pass any `f: (a: A) => B` function to `.map()` and be sure that the return type of `f` isn't checked. A `Just` is kept a `Just` even if `f` returns a nullable:

```js
Maybe.of({ name: 'Alice' }) // Just({ name: 'Alice' })
  .map(person => person.age) // Just(undefined)
```

Simplicity over convenience.

## API

### Core API

#### `of()`

* **Signature:**

  ```ts
  of<A>(a: A): Maybe<A>
  ```

* **Example:**

  ```js
  Maybe.of('foo')
  // => Just('foo')
  ```

  ```js
  Maybe.of(['foo', 'bar', 'baz'][3])
  // => Just(undefined)
  ```

#### `fromNullable()`

* **Signature:**

  ```ts
  fromNullable<A>(a: Nullable<A>): Maybe<A>
  ```

* **Example:**

  ```js
  Maybe.fromNullable('foo')
  // => Just('foo')
  ```

  ```js
  Maybe.fromNullable(['foo', 'bar', 'baz'][3])
  // => Nothing()
  ```

#### `.all()`

* **Signature:**

  ```ts
  .all<A>(maybes: Maybe<A>[]): Maybe<A[]>

  .all<A, B>(maybes: [Maybe<A>, Maybe<B>]): Maybe<[A, B]>

  .all<A, B, C>(maybes: [Maybe<A>, Maybe<B>, Maybe<C>]): Maybe<[A, B, C]>

  .all<A, B, C, D>(
    maybes: [Maybe<A>, Maybe<B>, Maybe<C, Maybe<D>]
  ): Maybe<[A, B, C, D]>

  .all<A, B, C, D, E>(
    maybes: [Maybe<A>, Maybe<B>, Maybe<C>, Maybe<D>, Maybe<E>]
  ): Maybe<[A, B, C, D, E]>
  ```

* **Example:**

  ```js
  Maybe.all([Maybe.of('foo'), Maybe.of('bar'), Maybe.of('baz')])
  // => Just(['foo', 'bar', 'baz'])
  ```

  ```js
  Maybe.all([Maybe.of('foo'[1]), Maybe.of('bar'[3]), Maybe.of('baz'[2])])
  // => Just(['o', undefined, 'z'])
  ```

  ```js
  Maybe.all([
    Maybe.of('foo'[1]),
    Maybe.fromNullable('bar'[3]),
    Maybe.of('baz'[2])
  ])
  // => Nothing()
  ```

### `Maybe` methods

#### `.chain()`

* **Signature:**

  ```ts
  chain<B>(f: (a: A) => Maybe<B>): Maybe<B>
  ```

#### `.filter()`

* **Signature:**

  ```ts
  filter(f: (a: A) => boolean): Maybe<A>
  ```

#### `.getOrElse()`

* **Signature:**

  ```ts
  getOrElse(a: A): A
  ```

#### `.guard()`

* **Signature:**

  ```ts
  guard<B extends A>(f: (a: A) => a is B): Maybe<B>
  ```

#### `.isJust()`

* **Signature:**

  ```ts
  isJust(): boolean
  ```

#### `.isNothing()`

* **Signature:**

  ```ts
  isNothing(): boolean
  ```

#### `.map()`

* **Signature:**

  ```ts
  map<B>(f: (a: A) => B): Maybe<B>
  ```

#### `.orElse()`

* **Signature:**

  ```ts
  orElse(a: Maybe<A>): Maybe<A>
  ```

#### `.unsafeGet()`

* **Signature:**

  ```ts
  unsafeGet(): A | void
  ```
