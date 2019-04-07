---
date: "2019-03-30"
title: "Why you should avoid using null"
description: "Most software languages support the concept of null, however in this article I make a case that using null actually makes your software worse."
tags: ["clean code"]
---
Java, python, JavaScript, C/C++.  These each support `null`. In fact, most
languages you learn in school or use in your day job there is way to represent
`null` - an empty value.  Essentially programmers needed a way to store an
optional or empty objects. (for a really good history and talk about null pointers and
where they came from checkout [this talk by Tony Hoare](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare)
For instance and object representing a person might look like this:

```javascript
const person = {
    firstName: 'John',
    middleName: 'Jacob',
    lastName: 'Smith',
    title: 'Mr.'
};
```

However, for child, the `title` field seems inappropriate, so it's given the
value of `null`:

```javascript
const child = {
    firstName: 'Jimmy',
    middleName: 'John',
    lastName: 'Smith',
    title: null
};
```

This seems fine until you need to do a little processing on the data:

```javascript
function getGreeting(person) {
    return `Dear ${person.title} ${person.firstName} ${person.lastName}`;
}
```

For John, `getGreeting` will output `Dear Mr. John Smith`, but for Jimmy we'll
get `Dear null Jimmy Smith`.  Not something you'll want to publish on a user
account page or send in a newsletter.  The most obvious solution is just to
check for null:

```javascript
function getGreeting(person) {
    return `Dear ${person.title ? `${person.title} ` : ''}`
        + `${person.firstName} ${person.lastName}`;
}
```

This gives us what we want, but what about the case when `firstName` and `lastName`
are null?

```javascript
function getGreeting(person) {
    return `Dear ${person.title ? `${person.title} ` : ''}`
        + `${person.firstName ? `${person.firstName} ` : ''}
        + `${person.lastName ? `${person.lastName}` : ''}`;
}
```

And now what about the case when the actual person object is null?

```javascript
function getGreeting(person) {
    if (person === null) {
        // Should I throw an error or return an empty string?
    }

    return ...
}
```

Quickly the code gets out of hand and what was meant to be a simple
function to produce a human consumable string turned into a series of
if else and ternary statements wreaking havoc on readability. Suddenly
a peer review becomes reading null checks and execution clutters up your
CPU cycles with branching statements.

## Simplify your code

Assuming that there will be no nulls in the person object and that the person
object is not null, the `getGreeting` function can be rewritten:

```javascript
function getGreeting(person) {
    const greeting =
        `Dear ${person.title} ${person.firstName} ${person.lastName};

    return person.replace(/\s+/g, ' ');
}
```

The function `getGreeting` simplifies down to two lines.  The first builds a
greeting and since null is not a valid value for any of our fields we can
assume they are strings and therefore we can just concatenate them together.
The second line handles empty strings by replacing all occurrences of one or
more space characters with a single space. The function's intent is clear.
Responsibility of safe type checking moves further up the chain relieving
`getGreeting` of unnecessary if-else clauses.

The verifying of correct values still needs to be done somewhere in our
software stack since that responsibility shifted away from `getGreeting`, but
hasn't landed anywhere else.

If `getGreeting` belongs to a library intended to be imported by other
developers, then clear documentation would suffice.  This shifts
responsibility to the outside developer to call your code correctly and
implement their own safety checks before using `getGreeting`.  This isn't bad
approach, albeit a lazy one.

Checking parameters on initialization is a bit more elegant:

```javascript
function checkIsString(value, name) {
    if (typeof value !== 'string') {
        throw new TypeError(
            `${name} should be a string, got ${value} instead`
        );
    }
}

function createPerson(attributes) {
    let { firstName, lastName, middleName, title } = attributes;
    checkIsString(firstName, 'firstName');
    checkIsString(lastName, 'lastName');
    checkIsString(middleName, 'middleName');
    checkIsString(title, 'title');

    return {
        getGreeting() {
            const greeting =
                `Dear ${title} ${firstName} ${lastName};

            return person.replace(/\s+/g, ' ');
        }
    };
}
```

Upon invocation, `createPerson` expects an object with four fields.  Rather
than checking for null or undefined each field is checked to be a string.  If
anyone is not, then an Error will be thrown that states which field was not a
string.

Now, `getGreeting` is a function of an object with private members.  Instead of
checking types itself, the function relies on the verification provided in the
constructor.  This creates safety with clear error messages and reduces
branching statements in the code.

JavaScript offers no intrinsic support for type checking therefore the four
calls to `checkIsString` were added.  However, Typescript offers an even
cleaner way to remove null checks with a statically-checked type
system.

```typescript
interface Person {
  firstName: string,
  lastName: string,
  middleName: string
  title: string
}

function greetPerson(p: Person) {
  const greeting = `Dear ${tile} ${firstName} ${p.lastName}`;

  return greeting.replace(/\s+/g, ' ');
}
```

As long as the `strictNullChecks` Typescript flag is set, this code:

```typescript
let p: Person = {
  firstName: 'John',
  lastName: 'Smith',
  middleName: 'Jacob',
  title: null
};
```

...results in the following error:

```
error TS2322: Type 'null' is not assignable to type 'string'.
```

Typescript does static analysis, meaning it looks at code instead of running it
to check for Errors.  This means these checks are done before node or a user's
browser ever runs them.  The final application doesn't take a performance hit.

### Caveat

Typescript comes with a type `any` which can be *anything* including `null` and
`undefined`.  Any other type in the system will allow a variable typed as `any`
to be assigned to it.  Consequently, the following code is valid:

```typescript
let x: any = null;
let p: Person = x;
```

This presents a problem if we are populating our Person object with data from
an outside source such as a database.  If our database allows `NULL` entries,
then any nulls from the database need conversion to empty strings.  If possible,
the database schema should be updated to have `NOT NULL` constraints.  When
updating the schema isn't feasible, make sure your code that reads the database
is typed to disallow `null`.

For and example:

```typescript
class Person {
  private firstName: string = '';
  private middleName: string = '';
  private lastName: string = '';
  private title: string = '';

  constructor(person) {
    Object.keys(person).forEach((property: string) => {
      if (typeof this[property] === 'string') {
        this[property] = typeof person[property] === 'string'
          ? person[property]
          : '';
    });
  }
}

db.each('SELECT firstName, lastName, middleName, title FROM person', (error, person: Person) => {
  console.log(greetPerson(new Person(person)));
});
```

Again, using variable sanitation in a constructor is used.  However, rather than
throwing a `TypeError` an empty string replaces invalid input.

## Reducing errors

Ultimately removing `null` is a mechanism for reducing errors.  By working
within constraints encourages creativity and helps reduce code complexity.  It
enables type checking at compile time and reduces branching statements. While
avoiding `null` and checks for `null` may not be feasible for every project,
it's  worth trying out next time you open your editor.
