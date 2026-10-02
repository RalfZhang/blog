---
title: Starting from a Problem on Euler's Totient Function
date: 2019-01-14 23:47:47
slug: euler-s-totient-function
---
Today someone in a group chat shared [Problem 69](https://projecteuler.net/problem=69) from Project Euler, saying their algorithm ran for 40 minutes before it found the answer. That made me curious about what kind of problem it was. Here it is:

> Euler's Totient function, φ(n) [sometimes called the phi function], is used to determine the number of numbers less than n which are relatively prime to n. For example, as 1, 2, 4, 5, 7, and 8, are all less than nine and relatively prime to nine, φ(9)=6.

| n | Relatively Prime | φ(n) | n/φ(n) |
| ----- | ---- | ---- | ---- |
| 2 | 1 | 1 | 2 |
| 3 | 1,2 | 2 | 1.5 |
| 4 | 1,3 | 2 | 2 |
| 5 | 1,2,3,4 | 4 | 1.25 |
| 6 | 1,5 | 2 | 3 |
| 7 | 1,2,3,4,5,6 | 6 | 1.1666... |
| 8 | 1,3,5,7 | 4 | 2 |
| 9 | 1,2,4,5,7,8 | 6 | 1.5 |
| 10 | 1,3,7,9 | 4 | 2.5 |

> It can be seen that n=6 produces a maximum n/φ(n) for n ≤ 10.
> Find the value of n ≤ 1,000,000 for which n/φ(n) is a maximum.

The problem itself is easy to understand. But a pure brute-force solution would probably take those 40 minutes, so we need something more elegant.

After reading the problem, my intuition said the answer should be the product of the primes taken from the smallest up (`2 * 3 * 5…`), stopping at the largest product below the 1,000,000 limit.

So I came up with this:

{{< codetabs >}}
```js
function isPrime(n) {
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return n >= 2;
}

const LIMIT = 1000000;
let n = 1;
for (let p = 2; n * p <= LIMIT; p++) {
  if (isPrime(p)) n *= p;
}
console.log(n); // 510510
```

```python
from math import isqrt

def is_prime(n):
    return n >= 2 and all(n % i for i in range(2, isqrt(n) + 1))

LIMIT = 1_000_000
n, p = 1, 2
while n * p <= LIMIT:
    if is_prime(p):
        n *= p
    p += 1
print(n)  # 510510
```
{{< /codetabs >}}

The answer is 510510. I submitted it, and it was correct!
It is simply the product of the primes from 2 to 17, also known as the primorial of 17 (written 17#).

Now let's go back and look at the reasoning behind it.

The problem asks for the maximum of n/φ(n).
So we want φ(n) to be as small as possible while n is as large as possible.
That means n should share a common factor with as many of the numbers below it as possible.
So we might as well build n by multiplying primes smaller than it, from the smallest up (a common factor of 2 covers far more numbers than 7 does). That covers the most numbers without wasting any of n's size (multiplying by 2 a second time doesn't help at all).

OK, the intuition turns out to be right. So how do we prove it mathematically?

The [Wikipedia article](https://en.wikipedia.org/wiki/Euler%27s_totient_function) on Euler's totient function has everything we need.
Following the derivation there, we have:

$$\varphi(n) = \prod_{i=1}^{r} p_i^{k_i-1}(p_i-1) = \prod_{p \mid n} p^{\alpha_p-1}(p-1) = n \prod_{p \mid n} \left(1-\frac{1}{p}\right)$$

So what the problem ultimately asks us to maximize is:

$$\frac{n}{\varphi(n)} = \frac{1}{\prod_{p \mid n} \left(1-\frac{1}{p}\right)}$$

To make the right-hand side as large as possible, we make the denominator as small as possible.
Every factor in the denominator's product is less than 1, so we want as many primes p as possible, and the smaller the better.
Hence n should be built by multiplying primes, starting from the smallest one (2).

So the answer is `2 * 3 * 5 * 7 * 11 * 13 * 17 = 510510`.
