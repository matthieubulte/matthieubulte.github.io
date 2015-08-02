---
layout: post
title:  "Coq Learning Changelog"
date:   2014-12-26 01:00:00
description: Coq learning change log
categories:
- blog
permalink: learning-coq
comments: true
---

I'm still reading [http://www.cis.upenn.edu/~bcpierce/sf/current/](http://www.cis.upenn.edu/~bcpierce/sf/current/) finished chapter one on the basics and just started chapter two on induction proofs.

It seems that the version of coq used in the book is a bit older than the current coq version, but i'll stick to the style and approaches presented in the book, i'm not trying to learn coq, it's more about the theory the book, contains.
rewrite -> / <-

{% highlight coq %}
given a theorem A:
Theorem plus_n_Sm : forall n m : nat, n + (S m) = S (m + n).
Proof. Admitted.
{% endhighlight %}

It's then possible to rewrite expressions in a proof in both directions, using the rewrite tactic:
if the current expression is: `n + (S m)`
then the step `rewrite -> A` will rewrite the current expression to `S (n + m)`

If the current expression is: `S (n + m)`
then the step `rewrite <- A` will rewrite the expression to `n + (S m)`

It seems stupid but when when i was playing with coq before knowing how to properly use rewrite, it was very frustrating...
typical induction tactic.

An example says more than anything else:

{% highlight coq %}
Theorem plus_n_Sm : forall n m,
  S (n + m) = n + (S m).
Proof.
  intros n m. induction n as [| n'].
  Case "n = 0". reflexivity.
  Case "n = S n'".
    simpl.
    rewrite -> IHn'. reflexivity.
  Qed.
{% endhighlight %}

Assertions, a.k.a. sub theorems

For theorems too specific to be extracted in it's own theorem, it can
be defined and prooved within the proof of another theorem using the
assert tactic.

{% highlight coq %}
Theorem mult_0_plus' : ∀n m : nat,
  (0 + n) × m = n × m.
  Proof.
    intros n m.
    assert (H: 0 + n = n).
      Case "Proof of assertion". reflexivity.
    rewrite → H.
    reflexivity. Qed.
{% endhighlight %}
