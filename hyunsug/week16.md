# Week 16

## [Medium-18220-Filter](./medium/18220-filter.ts)

```ts
type Filter<T extends any[], P> = T extends [infer F, ...infer R]
  ? F extends P
    ? [F, ...Filter<R, P>]
    : Filter<R, P>
  : [];
```

- 원시타입이거나 원시타입의 유니언인 P에 대해, 배열 T의 원소들을 필터링한다
- T를 순회하면서 `F extends P`를 만족할 경우 배열에 담고, 아니라면 `Filter<R, P>`를 호출하여 F를 제외한 나머지를 순회한다.
- 최종적으로 모든 원소를 순회했으나 만족값이 없는 경우 빈 배열을 반환한다.

## [Medium-21104-FindAll](./medium/21104-find-all.ts)

```ts
type FindAll<
  T extends string,
  P extends string,
  C extends unknown[] = [],
  Result extends number[] = []
> = T extends ""
  ? P extends ""
    ? []
    : Result
  : P extends ""
  ? []
  : T extends `${infer _}${infer R}`
  ? T extends `${P}${infer _}`
    ? FindAll<R, P, [...C, unknown], [...Result, C["length"]]>
    : FindAll<R, P, [...C, unknown], Result>
  : Result;
```

- 문자열 T에서 P가 등장하는 모든 '시작 인덱스'를 배열로 반환하는 문제
- 단순하게 템플릿 패턴 매칭을 이용하려 했으나, 패턴 매칭으로는 인덱스 값을 추출하기에는 애로사항이 있었음
- 패턴 매칭을 하고 나머지에 대해서만 검증하기에는 문제 요구사항이 `AAAA`, `A`와 같은 경우에서 `0, 1, 2, 3`을 반환해야 하는, 만족하는 모든 지점을 찾아야 하는 것이었음
- 따라서, 전체 순회를 하며 시작하는 그 지점에서 템플릿 리터럴 패턴 매칭을 이용하는 방식으로 진행함

- 먼저 T가 빈 문자열이라면 P를 검증하고, P도 빈 문자열이라면 빈 배열을, P가 찾고자하는 문자가 있었다면 순회를 종료하고 결과를 반환
- T가 빈 문자열이 아니지만 P가 빈 문자열이라면 빈 배열을 반환
- 둘다 빈 문자열이 아니라면 T를 하나씩 순회하며 패턴 매칭을 진행하고, C로 인덱스값을, Result로 결과값을 담도록 함

## [Medium-21106-CombinationKeyType](./medium/21106-combination-key-type.ts)

```ts
type Combs<T extends string[]> = T extends [
  infer F extends string,
  ...infer R extends string[]
]
  ? `${F} ${R[number]}` | Combs<R>
  : never;
```

- 배열 T의 원소들을 조합하여 반환하되, 앞선 원소들은 뒤의 원소들의 뒤로 배치되어서는 안됨
- 따라서, `${F} ${R[number]}`를 이용하여 먼저 앞선 문자를 기준으로 조합을 구성하고 남은 문자들을 기준으로 `Combs<R>`을 수행하면
- `F (분배된)R[number]`와 `남은 원소의 첫번째 - 남은 원소의 두번째부터 나머지`... 의 유니언이 반환됨

## [Medium-21220-PermutationsOfTuple](./medium/21220-permutations-of-tuple.ts)

```ts
type Insertion<T extends unknown[], U> = T extends [infer F, ...infer R]
  ? [F, U, ...R] | [F, ...Insertion<R, U>]
  : [U];

type PermutationsOfTuple<
  T extends unknown[],
  Result extends unknown[] = []
> = T extends [infer F, ...infer R]
  ? PermutationsOfTuple<R, [F, ...Result] | Insertion<Result, F>>
  : Result;
```

- 튜플 T의 모든 원소를 이용하여 가능한 모든 수열을 생성하고 유니언으로 반환한다
- 첫번째 원소부터 순회하며 `Result` 타입에 순열을 만들어 담는다.
- 헬퍼 타입 `Insertion`은 이용할 때, 나머지 원소들을 순회하며 현재 순서의 원소를 모든 위치에 넣는 역할을 한다.
- `[1, 2, 3]`을 기준으로 생각했을 때

1. `PermutationsOfTuple<[2, 3], [1] | Insertion<[], 1>>` => `PermutationsOfTuple<[2, 3], [1] | [1]>`
2. `PermutationsOfTuple<[3], [2, 1] | Insertion<[1], 2>>` => `PermutationsOfTuple<[3], [2, 1] | [2, 1]>`
3. `[2, 1] | [1, 2]` 유니언에 대해 분배가 일어나 Insertion에서는 `[2, 1, 3] | [2, 3, 1]`과 `[1, 3, 2] | [1, 2, 3]`이,
   `[F, ...Result]`를 통해 `[3, 1, 2] | [3, 2, 1]`이 생성된다.

## [Medium-25170-ReplaceFirst](./medium/25170-replace-first.ts)

```ts
type ReplaceFirst<
  T extends readonly unknown[],
  S,
  R,
  Pre extends unknown[] = []
> = T extends [infer F, ...infer Rest]
  ? F extends S
    ? [...Pre, R, ...Rest]
    : ReplaceFirst<Rest, S, R, [...Pre, F]>
  : Pre;
```

- T를 순회하며 Pre에는 순회하면서 S가 아니었던 것들을 담아나간다
- `F extends S`를 만족하면 Pre 다음에 R을 추가하고, 아니라면 현재 원소를 Pre에 담는다
- 모든 순회가 끝났는데 교체가 없다면 Pre(전체 복사본)을 반환하게 되고, 그 이전에 교체가 일어났다면 그 이전까지의 Pre + 교체된 값 + 나머지 형태가 된다

## [Medium-25270-Transpose](./medium/25270-transpose.ts)

```ts
type Transpose<M extends number[][], X = M["length"] extends 0 ? [] : M[0]> = {
  [K in keyof X]: {
    [Y in keyof M]: K extends keyof M[Y] ? M[Y][K] : never;
  };
};
```

- X는 columns 갯수를 기준으로 0이라면 빈 배열, 아니라면 first row
- first row의 각 인덱스 번호는 곧 변환된 행렬의 각 row 번호가 됨
- 이를 통해 순회를 진행하며 각 원소를 추출하고 이를 통해 행렬을 변환함
- `K extends keyof M[Y]`는 행/열 번호 교차 시 각 원소가 존재하는지 확인하는 역할을 함

- 이 타입의 특징은, 순회에 사용한 `keyof X`, `keyof M`이 배열의 인덱스 값이라는 점이다
- 최종 반환된 `MappedType` 역시 배열 인덱스 값을 key 로 가지는 객체가 된다
- TypeScript는 key가 연속된 숫자 인덱스라면 이를 배열/튜플로 인식한다고 한다

```ts
type Test2 = {
  0: 'a',
  1: 'b'
  2: 'c'
}

type tt = ['a','b','c'] extends Test2 ? true : false; // true
```

- 다만 `Equal<A, B>`로는 직접 부여한 구조가 다르기 때문에 이를 통해서는 2가 나온다.
