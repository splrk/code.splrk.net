---
title: Why you should avoid using null
excerpt: Null is a concept supported in a lot of languages, however there is a case to be made that using null can actually make your software worse.
tags: ["clean code"]
---
Null is a concept supported by many programming languages.  

**List examples of what null is in various languages**

The main reason you want to eliminate using and checking for null is to simplify your code

Take this code for example:

```javascript
	function concatStrings(...strings) {
	    return strings.reduce((concattenated, str) => {
	        if (!isNull(str)) {
                return concatenated + str;
	        } else {
	           // What to do here?  Throw an error or skip it?
	        }
	     }, '');
    }
```
	
This leaves a weird and arbitrary decision to the programmer and if the user of the function is using this as an API method, they have to go look up what happens if they don't pass a string into the function.  It complicates our code by adding a branching statement for every item in the array and forces us to add at least one more test case to verify the function is working Properly.

Secondly if an error is thrown, this is a side effect that has to be checked for later:

```javascript
	try {
		concatStrings('one', null, 'two');
	} catch (e) {
	    //handle Error
    }
```

Now, for a fairly simple function there are side effects to be dealt with.

A better way to write this is to acknowledge that null is not a valid input, and stop checking for it.  Let the programmer who calls the function ensure that the data passed is valid rather than leaving the burden on this function.

To that we would rewrite our function as this

```javascript
	function concatStrings(...strings) {
	    return strings.reduce((concatenated, str) => concatenated + str, '');
    }
```

The function is extremely simplified, although no error checking is done.  At this  point all we've done is offload the checking for nulls to someone else.  I.e. we've been a lazy programmer and said "It's not my problem".  So why is this approach better?

First, if your using a typed language such as Typescript or Java, we can have checks done at compile time.  This means we use the constructs of the language to provide feedback rather than define our own type of feedback to the system.

Example in Typescript

```typescript
    function concatStrings(...strings: string[]): string {
        return strings.reduce((concattenated, str) => concatenated + str, '');
    }
```

Now if we st `strictNullChecks` to `true`, Typescript spits out this error if a null or undefined value is passed in:

    [eval].ts:4:25 - error TS2345: Argument of type 'null' is not assignable to parameter of type 'string'

We allow Typescript to define the error for us in a more generic way instead of having to come up with our own message.  If another developer is using our function, they know the function only takes strings by its definition and therefore they should know that they can only pass strings to the function and they should expect an error if somehting other than a string is passed in.

What about user input?  What if this is a form and a user leaves and empty input box, or never initializes

First, this is not the responsibility of the function.  `concatenateStrings` does what it says and nothing more.  It is the responsibility of the form to sanitize user input and use `concatenateStrings` properly.

The form can handle this two ways:

1. Initialze all input fields to blank strings.  That way `concatenateStrings` is called, at least empyt inputs are valid strings.
2. Display an error to the user before calling `concatenateStrings`

This is good practice for security as well as you should never trust random input from the user. Trusting input leads to vulnerabilites like SQL Injection or DOS attacks. Instead of having the low level code try to verify inputs and check for invalid values, The error checking should be done as close to the user as possible.  If invalid input is able to find its way to `concatenateStrings` we have other problems.  Besides if `concatenateStrings` sends an error, that error will have to somehow propigate back up to the user, otherwise the app just fails silently.
