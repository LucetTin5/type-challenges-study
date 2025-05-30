/*
  26401 - JSON Schema to TypeScript
  -------
  by null (@aswinsvijay) #medium #JSON

  ### Question

  Implement the generic type JSONSchema2TS which will return the TypeScript type corresponding to the given JSON schema.

  Additional challenges to handle:
  * additionalProperties
  * oneOf, anyOf, allOf
  * minLength and maxLength

  > View on GitHub: https://tsch.js.org/26401
*/

/* _____________ Your Code Here _____________ */
type JSONSchema = {
    type: string
    properties?: Record<string, JSONSchema>
    items? : JSONSchema
    enum? : any[]
    required? : string[]
  }

type StringToType<T> = 
  T extends 'string' ? string :
  T extends 'number' ? number :
  T extends 'boolean' ? boolean :
  T extends 'bigint' ? bigint :
  T extends 'symbol' ? symbol :
  T extends 'undefined' ? undefined :
  T extends 'null' ? null :
  T extends 'object' ? Record<string, unknown> :
  T extends 'array' ? unknown[] :
  never;

type MyTupleToUnion<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First | MyTupleToUnion<Rest>
  : never

type MyInclude<T extends any[], U> = T extends [infer First, ...infer Rest]
  ? First extends U
    ? true
    : MyInclude<Rest, U>
  : false

type FlattenObject<T extends object> = {
  [P in keyof T] : T[P]
}

type JSONSchema2TS<T extends JSONSchema> = T extends {properties : object}
  ? T extends {required : any}
    ? FlattenObject<{
        [P in keyof T['properties'] as MyInclude<T['required'],P> extends true ? P : never] : JSONSchema2TS<T['properties'][P]>
      } & {
        [P in keyof T['properties'] as MyInclude<T['required'],P> extends true ? never : P]? : JSONSchema2TS<T['properties'][P]>
      }>
    : {
        [P in keyof T['properties']]? : JSONSchema2TS<T['properties'][P]>
      }
  : T extends {enum: any[]}
    ? MyTupleToUnion<T['enum']>
    : T extends {items: any}
      ? JSONSchema2TS<T['items']>[]
      : StringToType<T['type']>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

// + Primitive types
type Type1 = JSONSchema2TS<{
  type: 'string'
}>
type Expected1 = string
type Result1 = Expect<Equal<Type1, Expected1>>

type Type2 = JSONSchema2TS<{
  type: 'number'
}>
type Expected2 = number
type Result2 = Expect<Equal<Type2, Expected2>>

type Type3 = JSONSchema2TS<{
  type: 'boolean'
}>
type Expected3 = boolean
type Result3 = Expect<Equal<Type3, Expected3>>
// - Primitive types

// + Enums
type Type4 = JSONSchema2TS<{
  type: 'string'
  enum: ['a', 'b', 'c']
}>
type Expected4 = 'a' | 'b' | 'c'
type Result4 = Expect<Equal<Type4, Expected4>>

type Type5 = JSONSchema2TS<{
  type: 'number'
  enum: [1, 2, 3]
}>
type Expected5 = 1 | 2 | 3
type Result5 = Expect<Equal<Type5, Expected5>>
// - Enums

// + Object types
type Type6 = JSONSchema2TS<{
  type: 'object'
}>
type Expected6 = Record<string, unknown>
type Result6 = Expect<Equal<Type6, Expected6>>

type Type7 = JSONSchema2TS<{
  type: 'object'
  properties: {}
}>
type Expected7 = {}
type Result7 = Expect<Equal<Type7, Expected7>>

type Type8 = JSONSchema2TS<{
  type: 'object'
  properties: {
    a: {
      type: 'string'
    }
  }
}>
type Expected8 = {
  a?: string
}
type Result8 = Expect<Equal<Type8, Expected8>>
// - Object types

// + Arrays
type Type9 = JSONSchema2TS<{
  type: 'array'
}>
type Expected9 = unknown[]
type Result9 = Expect<Equal<Type9, Expected9>>

type Type10 = JSONSchema2TS<{
  type: 'array'
  items: {
    type: 'string'
  }
}>
type Expected10 = string[]
type Result10 = Expect<Equal<Type10, Expected10>>

type Type11 = JSONSchema2TS<{
  type: 'array'
  items: {
    type: 'object'
  }
}>
type Expected11 = Record<string, unknown>[]
type Result11 = Expect<Equal<Type11, Expected11>>
// - Arrays

// + Mixed types
type Type12 = JSONSchema2TS<{
  type: 'object'
  properties: {
    a: {
      type: 'string'
      enum: ['a', 'b', 'c']
    }
    b: {
      type: 'number'
    }
  }
}>
type Expected12 = {
  a?: 'a' | 'b' | 'c'
  b?: number
}
type Result12 = Expect<Equal<Type12, Expected12>>

type Type13 = JSONSchema2TS<{
  type: 'array'
  items: {
    type: 'object'
    properties: {
      a: {
        type: 'string'
      }
    }
  }
}>
type Expected13 = {
  a?: string
}[]
type Result13 = Expect<Equal<Type13, Expected13>>
// - Mixed types

// + Required fields
type Type14 = JSONSchema2TS<{
  type: 'object'
  properties: {
    req1: { type: 'string' }
    req2: {
      type: 'object'
      properties: {
        a: {
          type: 'number'
        }
      }
      required: ['a']
    }
    add1: { type: 'string' }
    add2: {
      type: 'array'
      items: {
        type: 'number'
      }
    }
  }
  required: ['req1', 'req2']
}>
type Expected14 = {
  req1: string
  req2: { a: number }
  add1?: string
  add2?: number[]
}
type Result14 = Expect<Equal<Type14, Expected14>>
// - Required fields

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/26401/answer
  > View solutions: https://tsch.js.org/26401/solutions
  > More Challenges: https://tsch.js.org
*/
