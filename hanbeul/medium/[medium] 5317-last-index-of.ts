/*
  5317 - LastIndexOf
  -------
  by jiangshan (@jiangshanmeta) #medium #array

  ### Question

  Implement the type version of ```Array.lastIndexOf```, ```LastIndexOf<T, U>```  takes an Array ```T```, any ```U``` and returns the index of the last ```U``` in Array ```T```

  For example:

  ```typescript
  type Res1 = LastIndexOf<[1, 2, 3, 2, 1], 2> // 3
  type Res2 = LastIndexOf<[0, 0, 0], 2> // -1
  ```

  > View on GitHub: https://tsch.js.org/5317
*/

/* _____________ Your Code Here _____________ */

// indexof를 끝까지 돌리면 되지 않을까
// index는 만날때마다 어딘가 기록하자
// 마지막 다 돌았을때 해당 값을 보내주면 될듯

type MyEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type LastIndexOf<
  T extends any[],
  U,
  IndexArr extends unknown[] = [],
  Result = -1
> = T extends [infer First, ...infer Rest]
  ? MyEqual<First, U> extends true
    ? LastIndexOf<Rest, U, [...IndexArr, unknown], IndexArr["length"]>
    : LastIndexOf<Rest, U, [...IndexArr, unknown], Result>
  : Result;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<LastIndexOf<[1, 2, 3, 2, 1], 2>, 3>>,
  Expect<Equal<LastIndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3>, 7>>,
  Expect<Equal<LastIndexOf<[0, 0, 0], 2>, -1>>,
  Expect<Equal<LastIndexOf<[string, 2, number, "a", number, 1], number>, 4>>,
  Expect<Equal<LastIndexOf<[string, any, 1, number, "a", any, 1], any>, 5>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/5317/answer
  > View solutions: https://tsch.js.org/5317/solutions
  > More Challenges: https://tsch.js.org
*/
