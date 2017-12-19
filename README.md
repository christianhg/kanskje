# kanskje

> Simple Maybe monad written in TypeScript

[![npm module](https://img.shields.io/npm/v/kanskje.svg?style=flat-square)](https://www.npmjs.org/package/kanskje)
[![Coverage status](https://img.shields.io/codecov/c/github/christianhg/kanskje.svg?style=flat-square)](https://codecov.io/gh/christianhg/kanskje)
[![Build status](https://img.shields.io/travis/christianhg/kanskje.svg?style=flat-square)](https://travis-ci.org/christianhg/kanskje)
[![dependencies status](https://img.shields.io/david/christianhg/kanskje.svg?style=flat-square)](https://david-dm.org/christianhg/kanskje)
[![devDependencies status](https://img.shields.io/david/dev/christianhg/kanskje.svg?style=flat-square)](https://david-dm.org/christianhg/kanskje?type=dev)
[![Code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

![Set your code free](gaustatoppen.jpg)

## Table of Contents

* [Introduction](#introduction)
* [Why kanskje?](#why-kanskje)
* [Usage](#usage)
* [API](#api)
  * [Constructing `Maybe`s](#constructing-maybes)
  * [`Maybe` methods](#maybe-methods)

## Introduction

A Maybe represents a wrapper around any value - most commonly values that might be nullable. Having this wrapper is useful because it guards against `null` and `undefined` when doing computations on the value. The idea is that the Maybe deals with nullables internally, thus allowing one to write simpler code with fewer conditionals. Not until the very end when it's needed to unwrap the value again, is it necessary to deal with the fact that it was or somehow became nullable.

```js
Maybe.fromNullable(getValueThatMightNotBeThere())
  .map(doSomething)
  .map(doAnotherThing)
  .map(doFinalThing)
  .getOrElse(defaultValue)
```

Even though they can't be constructed individually, the `Maybe` consists of two classes: `Just` and `Nothing`. The `Maybe` is a `Just` if it holds a value and a `Nothing` if it doesn't.

```js
const toUpper = a => a.toUpperCase()

Maybe.fromNullable(['foo', 'bar', 'baz'][2]) // Just('baz')
  .map(toUpper) // Just('BAZ')
  .getOrElse('No value here')
// => 'BAZ'

Maybe.fromNullable(['foo', 'bar', 'baz'][3]) // Nothing
  .map(toUpper) // Nothing
  .getOrElse('No value here')
// => 'No value here'
```

There exists a number of great resources on Maybe monads - including
[The Marvellously Mysterious JavaScript Maybe Monad](https://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/) by [@jrsinclair](https://twitter.com/jrsinclair) and [Professor Frisby's Mostly Adequate Guide to Function Programming](https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch8.md#schr%C3%B6dingers-maybe) by [@drboolean](https://twitter.com/drboolean) - that one might want to get familiar with. If you are used to Promises, you are essentially already familiar with monads.

## Why kanskje?

kanskje stems from the need of a simple Maybe monad with type declarations making it usable for both JavaScript and TypeScript. The fact that the Maybe is written in TypeScript makes sure that it only contains methods that are actually possible to express using the TypeScript type system.

The source code is simple with one-line functions and no aliases, and yet the function declarations - using [Generic Types](https://www.typescriptlang.org/docs/handbook/generics.html) of TypeScript - should be self-documenting.

Unlike some Maybe monads, kanskje doesn't perform behind the scenes conversions from `Just` to `Nothing`. As an example you can pass any mapper function, `f: (a: A) => B`, to `map` and be sure that the return type of `f` isn't checked. A `Just` is kept a `Just` even if `f` returns a nullable:

```js
const unsafeProp = b => a => a[b]

Maybe.of({ name: 'Alice' }) // Just({ name: 'Alice' })
  .map(unsafeProp('age')) // Just(undefined)
  .getOrElse(25)
// => undefined
```

If `Just(undefined)` is not the desired outcome, the mapper function, `f`, needs to return a `Maybe` and be passed to `chain` instead:

```js
const safeProp = b => a => Maybe.fromNullable(a[b])

Maybe.of({ name: 'Alice' }) // Just({ name: 'Alice' })
  .chain(safeProp('age')) // Nothing
  .getOrElse(25)
// => 25
```

## Usage

This is a CommonJS module.

Import the exported functions as named imports:

```js
const { all, fromNullable, of } = require('kanskje')
```

Or namespace them all under e.g. `Maybe`:

```js
const Maybe = require('kanskje')
```

Or use ES2015 module syntax if your environment supports that:

```js
import { all, fromNullable, of } from 'kanskje'

import * as Maybe from 'kanskje'
```

## API

### Constructing `Maybe`s

To construct a `Maybe` one of the following functions can be used:

* [`all`](#all)
* [`empty`](#empty)
* [`fromNullable`](#fromNullable)
* [`of`](#of)

#### `all`

Accepts an array or a tuple of `Maybe`s and returns a single `Maybe`. If all the Maybes were `Just`s, the resulting `Maybe` will be a `Just` containing their values. If any of the `Maybe`s where a `Nothing`, the resulting `Maybe` will be a `Nothing`.

* **Signature:**

  ```ts
  all<A>(maybes: Maybe<A>[]): Maybe<A[]>

  all<A, B>(maybes: [Maybe<A>, Maybe<B>]): Maybe<[A, B]>

  all<A, B, C>(maybes: [Maybe<A>, Maybe<B>, Maybe<C>]): Maybe<[A, B, C]>

  all<A, B, C, D>(
    maybes: [Maybe<A>, Maybe<B>, Maybe<C>, Maybe<D>]
  ): Maybe<[A, B, C, D]>

  all<A, B, C, D, E>(
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
  // => Nothing
  ```

#### `empty`

Returns a `Nothing`.

* **Signature:**

  ```ts
  empty<A>(): Maybe<A>
  ```

* **Example:**

  ```js
  Maybe.empty()
  // => Nothing
  ```

#### `fromNullable`

Lifts a value into a `Maybe` but checks if the value is either `null` or `undefined`. If that is a case, a `Nothing` is returned. Otherwise a `Just` is returned.

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
  // => Nothing
  ```

#### `of`

Lifts a value into a `Maybe`, more specifically: a `Just`.

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

### `Maybe` methods

Once a `Maybe` is constructed, the following methods are accessible on the instance:

* [`chain`](#chain)
* [`filter`](#filter)
* [`fold`](#fold)
* [`getOrElse`](#getOrElse)
* [`guard`](#guard)
* [`isJust`](#isJust)
* [`isNothing`](#isNothing)
* [`map`](#map)
* [`orElse`](#orElse)
* [`unsafeGet`](#unsafeGet)

#### `chain`

Accepts a mapper function, `f`, that returns a `Maybe` and automatically unwraps the outer `Maybe` to not end up with a `Maybe<Maybe<B>>`.

* **Signature:**

  ```ts
  chain<B>(f: (a: A) => Maybe<B>): Maybe<B>
  ```

* **Example:**

  ```js
  const safeHead = xs => Maybe.fromNullable(xs[0])

  Maybe.of([1, 2, 3]).chain(safeHead)
  // => Just(1)

  Maybe.of([]).chain(safeHead)
  // => Nothing
  ```

#### `filter`

Accepts a predicate function, `f`, and converts the `Maybe` from a `Just` to a `Nothing` if its value does not adhere. If the `Maybe` is already a `Nothing` it remains a `Nothing`.

* **Signature:**

  ```ts
  filter(f: (a: A) => boolean): Maybe<A>
  ```

* **Example:**

  ```js
  const isEven = a => a % 2 === 0

  Maybe.of(4).filter(isEven)
  // => Just(4)

  Maybe.of(7).filter(isEven)
  // => Nothing
  ```

#### `fold`

Accepts two functions: a mapper function, `f`, and a function with the same return type, `g`. If the `Maybe` is a `Just` its value is mapped and returned using `f`. If it's a `Nothing` the result of `g` is returned.

* **Signature:**

  ```ts
  fold<B>(f: (a: A) => B, g: () => B): B
  ```

* **Example:**

  ```js
  const unsafeProp = b => a => a[b]

  const persons = [
    {
      name: 'Alice'
    },
    {
      name: 'Bob'
    }
  ]

  Maybe.fromNullable(persons[1]).fold(
    unsafeProp('name'),
    () => 'A person does not exist'
  )
  // => 'Bob'

  Maybe.fromNullable(persons[2]).fold(
    unsafeProp('name'),
    () => 'A person does not exist'
  )
  // => 'A person does not exist'
  ```

#### `getOrElse`

Accepts a default value, `a`, and returns that if the `Maybe` is a `Nothing`. Otherwise the value of the `Just` is returned.

* **Signature:**

  ```ts
  getOrElse(a: A): A
  ```

* **Example:**

  ```js
  Maybe.fromNullable(getPortFromProcess()).getOrElse(3000)
  ```

#### `guard`

Accepts a TypeScript [Type Guard](https://basarat.gitbooks.io/typescript/docs/types/typeGuard.html), `f`, and converts the `Maybe` from a `Just` to a `Nothing` if its value does not adhere. If the `Maybe` is already a `Nothing` it remains a `Nothing`.

Note: Using JavaScript this effectively does the same as `filter`.

* **Signature:**

  ```ts
  guard<B extends A>(f: (a: A) => a is B): Maybe<B>
  ```

* **Example:**

  ```ts
  interface Admin extends Person {
    password: string
  }

  interface Person {
    name: string
  }

  function isAdmin(a: Person): a is Admin {
    return a.hasOwnProperty('password')
  }

  const carl: Admin = {
    name: 'Carl',
    password: '1234'
  }

  const persons: Person[] = [
    {
      name: 'Alice'
    },
    carl
  ]

  Maybe.fromNullable(persons[0]).guard(isAdmin)
  // => Nothing

  Maybe.fromNullable(persons[1]).guard(isAdmin)
  // => Just({ name: 'Carl', password: '1234' })
  ```

#### `isJust`

Returns `true` if the `Maybe` is a `Just` and `false` if it's a `Nothing`.

* **Signature:**

  ```ts
  isJust(): boolean
  ```

#### `isNothing`

Returns `true` if the `Maybe` is a `Nothing` and `false` if it's a `Just`.

* **Signature:**

  ```ts
  isNothing(): boolean
  ```

#### `map`

Accepts any mapper function, `f`, and applies it to the value of the `Maybe`. If `f` returns a `Maybe`, the result will be a nested `Maybe`.

* **Signature:**

  ```ts
  map<B>(f: (a: A) => B): Maybe<B>
  ```

* **Example:**

  ```js
  const length = a => a.length

  Maybe.of('foo').map(length)
  // => Just(3)
  ```

  ```js
  const safeHead = xs => Maybe.fromNullable(xs[0])

  Maybe.of([1, 2, 3]).map(safeHead)
  // => Just(Just(1))

  Maybe.of([]).map(safeHead)
  // => Just(Nothing)
  ```

#### `orElse`

Accepts a `Maybe`, `a`. If the instance `Maybe` is a `Nothing` it is replaced with `a`. Otherwise it is left unchanged.

* **Signature:**

  ```ts
  orElse(a: Maybe<A>): Maybe<A>
  ```

* **Example:**

  ```js
  const persons = [
    {
      name: 'Alice'
    },
    {
      name: 'Bob'
    }
  ]

  Maybe.fromNullable(persons[1]).orElse(Maybe.of({ name: 'Carl' }))
  // => Just('Bob')

  Maybe.fromNullable(persons[2]).orElse(Maybe.of({ name: 'Carl' }))
  // => Just('Carl')
  ```

#### `unsafeGet`

Unsafely unwraps the value from the `Maybe`. Since `Nothing`s don't contain a value, the function will throw an error if the `Maybe` happened to be a `Nothing`.

* **Signature:**

  ```ts
  unsafeGet(): A | void
  ```

* **Example:**

  ```js
  Maybe.fromNullable(5).unsafeGet()
  // => 5

  Maybe.of(undefined).unsafeGet()
  // => undefined

  Maybe.fromNullable(undefined).unsafeGet()
  // => TypeError: A Nothing holds no value.
  ```
