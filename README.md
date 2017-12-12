# kanskje

> Simplistic Maybe monad written in TypeScript

[![npm module](https://badge.fury.io/js/kanskje.svg)](https://www.npmjs.org/package/kanskje)
[![Coverage status](https://codecov.io/gh/christianhg/kanskje/branch/master/graph/badge.svg)](https://codecov.io/gh/christianhg/kanskje)
[![Build status](https://travis-ci.org/christianhg/kanskje.svg?branch=master)](https://travis-ci.org/christianhg/kanskje)
[![dependencies status](https://david-dm.org/christianhg/kanskje.svg)](https://david-dm.org/christianhg/kanskje)
[![devDependencies status](https://david-dm.org/christianhg/kanskje/dev-status.svg)](https://david-dm.org/christianhg/kanskje?type=dev)

### Usage

The Maybe represents a wrapper around any value - most commonly values that might be nullable. The wrapper is useful because it guards against `null` and `undefined` when doing computations on the value. The idea is that the Maybe deals with nullables internally omitting the need for conditionals like `if`s. Not until the very end when it's needed to unwrap the value again, is it necessary to deal with the fact that it was or somehow became nullable.

Even though they can't be constructed individually, the `Maybe` consists of two classes: `Just` and `Nothing`. The `Maybe` is a `Just` if it holds a value and a `Nothing` if it doesn't.

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

### API

## `.of(..)`

* **Arguments:**

  * `a: A`

* **Returns:** `Maybe<A>`

* **Examples:**

  ```js
  Maybe.of('foo')
  // => Just('foo')
  ```

  ```js
  Maybe.of(['foo', 'bar', 'baz'][3])
  // => Just(undefined)
  ```

## `.fromNullable(..)`

* **Arguments:**

  * `a: A`

* **Returns:** `Maybe<A>`

* **Examples:**

  ```js
  Maybe.fromNullable('foo')
  // => Just('foo')
  ```

  ```js
  Maybe.fromNullable(['foo', 'bar', 'baz'][3])
  // => Nothing()
  ```

## `.all(..)`

* **Arguments:**

  * `mas: Maybe<A>[]`

* **Returns:** `Maybe<A[]>`

* **Examples:**

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
