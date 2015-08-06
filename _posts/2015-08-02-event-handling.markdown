---
layout: post
title:  "Two approaches to event handling in Haskell"
date:   2015-08-02 01:00:00
description: Comparison of ADT-based and Type Classes based event handling in Haskell
categories:
- blog
permalink: two-approaches-to-event-handling
comments: true
---

This blog post is the result of discussions (thanks to [tel](https://twitter.com/sdbo) for making his brain available!) I had in the last weeks on how one can setup a
practical, maintainable and type safe event handling system in Haskell. We will
review two solutions to this problem, both with different advantages and drawbacks,
thus adapted to different situations.

Both solutions will implement a very simple situation in which event handlers will
update a number in a `State` context. Three events will be available: `Set`,
`Increment`, `Decrement` and `Square`. Here is the shared code for both examples:

{% highlight haskell %}
import Control.Monad.State (State, modify, put, runState)

set :: Integer -> State Integer ()
set = put

increment :: State Integer ()
increment = modify (+ 1)

decrement :: State Integer ()
decrement = modify (subtract 1)

square :: State Integer ()
square = modify (^ 2)
{% endhighlight %}

The shared code doesn't include the representation of the events as it will be
different in the two implementations.

#### First approach: Keep it simple with sum types

The most straightforward approach to event handling in Haskell is to represent all
the possible events as one big sum type, the event handling function is then
simply a case split over the incoming event.

Let's see what the implementation looks like:

{% highlight haskell %}
data Event = Set Integer
           | Increment
           | Decrement
           | Square


handle :: Event -> State Integer ()
handle (Set x)   = set x
handle Increment = increment
handle Decrement = decrement
handle Square    = square
{% endhighlight %}

Nothing fancy being done here, let's see how one could then use this implementation:

{% highlight haskell %}
-- Update the State from the list of events, the final state (144) is then printed
main = print . snd $ runState state 0
  where
    state = do
      handle (Set 10)
      handle Increment
      handle Increment
      handle Square
{% endhighlight %}

Here are what I find to be the good parts about such an implementation:

+ We can check for the pattern matching exhaustiveness in the handling function,
ensuring that every event type is handled.

+ It's straightforward to get a list of possible events, making it easier to
work with the system.

+ There is no magic, the implementation is very simple.

Now of course, this approach is not perfect and is less usable in bigger systems
for the following reasons:

+ In the last event based system I've worked on, we had more than 500 events. No
need to say that having this in one big data type is not practical. Solutions exist
to this problem - like having a tree of sum types in which the nodes represent parts
of the application and leaves represent concrete events - but these solutions are
not easy to put in place, use or maintain.

+ You can't extend this system without modifying the `Event` sum type, which is fine
if you can define all of the possible events in the code you use, but becomes a problem
as soon as your code is being used by other people wanting to extend it.

#### Second approach: Type classes for extensibility

With the second approach, we will try to create an extensible event system that
should enable us to add event and event handlers in an easy way, suited for
bigger applications.


This new system will have to have to be able to handle events having a shared interface
from a list of possible handlers. In order to be able to work with events of different
types, we need to create a type class instantiated for each event type we have. The
class we will use is the following:

{% highlight haskell %}
import Data.Typeable (Typeable)

class (Typeable e) => Event e
{% endhighlight %}

This is basically a wrapper around the `Typeable` class that will just allow us
to mark some `Typeable`s as being events. We do this in order to avoid throwing
just any `Typeable` to the system by accident. What the `Typeable` class brings us
(for free, instances of `Typeable` can be derived using `DeriveDataTypeable`) is
the `cast` function with the following signature:

{% highlight haskell %}
cast :: (Typeable a, Typeable b) => a -> Maybe b
{% endhighlight %}

This function will be very useful later to be able to say if an event can be handled
by some arbitrary handler.

Let's now implement our event types and handlers:

{% highlight haskell %}
{-# LANGUAGE DeriveDataTypeable #-}

-- Our event types, all instances of Event
data Set = Set Integer deriving (Typeable)
instance Event Set

data Increment = Increment deriving (Typeable)
instance Event Increment

data Decrement = Decrement deriving (Typeable)
instance Event Decrement

data Square = Square deriving (Typeable)
instance Event Square

-- And our handlers
handleSet :: Set -> State Integer ()
handleSet (Set x) = set x

handleIncrement :: Increment -> State Integer ()
handleIncrement _ = increment

handleDecrement :: Decrement -> State Integer ()
handleDecrement _ = decrement

handleSquare :: Square -> State Integer ()
handleSquare _ = square
{% endhighlight %}


It's now obvious here that all the handlers have a different type of the shape
`(Event a) => a -> State Integer ()`, but we can't just create a list of this type
because the type variable `a` will be instantiated for the whole list. In order
to be able to have a list consisting of handlers of different types, we can use
the following trick based on the `ExistentialQuantification` language extension:

{% highlight haskell %}
{-# LANGUAGE ExistentialQuantification #-}

-- We abstract here the Handler type to be usable for any monad and not just (State Integer)
data Handler m = forall e. (Monad m, Event e) => Handler (e -> m ())
{% endhighlight %}


We now have everything in place to create a function `mkHandle` that given a list
of handlers will give us a function capable of handling any `Event` within some
monadic context.

{% highlight haskell %}
{-# LANGUAGE RankNTypes #-}

import Data.Typeable (cast)

mkHandle :: (Monad m) => [Handler m] -> forall e. Event e => e -> m ()
mkHandle []             _ = return ()
mkHandle (Handler f:fs) x = maybe (return ()) f (cast x)
                         >> mkHandle fs x
{% endhighlight %}

Let's now see how we can implement the same situation as in the previous approach
using our new solution:

{% highlight haskell %}
handle :: (Event e) => e -> State Integer ()
handle = mkHandle [ Handler handleSet
                  , Handler handleIncrement
                  , Handler handleDecrement
                  , Handler handleSquare
                  ]

main = print . snd $ runState state 0
  where
    state = do
      handle (Set 10)
      handle Increment
      handle Increment
      handle Square
{% endhighlight %}

Great, we managed to achieve the same result but gained in modularity as it's now
very easy to add an event type or a handler!


#### Wrap-up

We had a look at two approaches to solving the same problem, each of them is to
be used in different situations and each has its advantages and drawbacks. One
focuses more on simplicity, the other on modularity. It was for me a good exercise in the design
of the solutions and the writing this article that I hope you found interesting!
