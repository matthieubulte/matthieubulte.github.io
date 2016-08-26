---
layout: post
title:  "Short introduction to Parametric polymorphism"
date:   2016-03-20 01:00:00
description: An short and informal look at parametric polymorphism
categories:
- blog
permalink: para-poly
comments: true
---

This post is a write-up of an explanation of parametric polymorphism I gave on the #haskell channel of the functional programming
Slack group. The goal was to give an intuition on how the Haskell compiler looks at simple (ignoring type classes) polymorphic functions.

Let's start with the simplest polymorphic function one can think of, the identity function.

{% highlight haskell %}
id :: a -> a
id x = x
{% endhighlight %}

In the type signature of `id` the only type we see is the `a` type, but what is this type and what kind of value can I pass to the `id` function?

First, let's see where it comes from. In Haskell, you call these lower case types type variables. So the `a` type in the signature of `id` is a variable at the type level, meaning we don't force the user to pass values of any specific type to it.

What Haskell implicitly does to handle type variables is add a quantifier over the type variable `a` marking it to be totally unconstrained, meaning it could be anything, so our `id` function is:

{% highlight haskell %}
id :: forall a. a -> a
id x = x
{% endhighlight %}

So far we just added the keyword `forall`, which doesn't help much in the understanding of how Haskell will treat this function on call site and replace the `a` type variable by a concrete type.

One way that helps me to understand what is going on with implicit type arguments is to extend the Haskell language to be able to take Types as parameters
to functions themselves and then rewrite my function to have no implicit type parameters:

{% highlight haskell %}
id :: (a :: Type) -> a -> a
id _ x = x
{% endhighlight %}

So now our function takes an `a` of type `Type`, which could be any type such as `Int`, `Bool`, `String`, and then return a function from `a` to `a`. To then use
this new `id` function, you would have to tell it the value of the type `a` you're using. For instance:

{% highlight haskell %}
id Int 5            -- 5
id Int "Haskell"    -- doesn't compile as we have a = Int and "Haskell" :: [Char] but Int /= [Char]
id [Char] "Haskell" -- "Haskell"
{% endhighlight %}


This looks very unpractical, but this is actually what the Haskell compiler does for us, the compiler tries to figure out with which type it has to parameterize your
polymorphic function in order to have a consistent program.

The `id` function is a very simple polymorphic function, but it's already good enough to understand roughly how polymorphism works under the hood.
