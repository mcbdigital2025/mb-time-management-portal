# Landing Page Documentation

## Overview

This page is the main dashboard welcome section shown after a user logs into the system.

Its job is simple:

* Welcome the user back
* Show their basic account details
* Display their profile image
* Show the current work week
* Display a simple weekly calendar
* Allow the user to move between weeks using calendar arrows

This creates a clean “home page” feeling for the system.

The main code for this page is inside the `LandingOverview` and `AccountAndCalendar` components .

---

# File Purpose

This page helps users quickly understand:

* who is logged in
* what week they are viewing
* today’s date position inside the week
* simple week navigation

It is mostly a UI (frontend display) component.

It does not directly save data to the backend.

---

# Main Technologies Used

* Next.js
* React
* useState
* Props
* Tailwind CSS
* `lucide-react` icons
* `next/image`
* local image assets

---

# Main Components

There are 2 main components:

---

## 1. LandingOverview

This is the parent component.

Its job is to pass data into the account + calendar section.

### Example

```jsx id="t2m5k1"
<LandingOverview
  user={user}
  weekLabel={weekLabel}
  currentWeekStart={currentWeekStart}
  onPrevWeek={onPrevWeek}
  onNextWeek={onNextWeek}
/>
```

Think of this like the controller.

It sends information down to the real UI component.

---

## 2. AccountAndCalendar

This is the main UI component.

It builds:

* Left side → User account card
* Right side → Calendar card

This is where most of the actual page design happens .

---

# Left Side: My Account Card

This section shows the logged-in user's information.

It includes:

* profile image
* welcome message
* first name + last name
* email address
* current week label

Example:

```text id="c9y6e1"
Welcome Back, John Smith!
Email: john@email.com
Here’s your workforce overview for May 13 – May 19
```

This helps the user immediately know they are in the right account.

---

# How the Profile Image Works

This is important.

The system automatically chooses the default profile image based on gender.

## Code Logic

```javascript id="g7u2l4"
const defaultImage =
  user?.gender === "Male"
    ? maleImg.src
    : femaleimg.src;
```

This means:

### If gender is Male

Use:

```javascript id="x3v7r2"
maleImg
```

### Otherwise

Use:

```javascript id="m4p1z8"
femaleimg
```

This image is then shown here:

```jsx id="h8s5n0"
<img
  src={defaultImage}
  alt="Profile"
/>
```

---

# Where These Images Come From

The images are imported from:

```javascript id="r5f2q7"
import { femaleimg, maleImg } from "./assest/index";
```

This means inside your project there is probably a folder like:

```text id="u1k8v3"
/components/assest/
```

Inside that folder there are image files like:

```text id="q7n4w6"
male.png
female.png
```

These are fallback profile images.

They are used when users do not upload a personal profile picture.

This keeps the UI looking complete.

---

# Why `.src` Is Used

You may notice this:

```javascript id="j2v6p9"
maleImg.src
```

Why not just `maleImg`?

Because Next.js imports images as objects.

Example:

```javascript id="p6z3m1"
{
  src: "/_next/static/media/male.png",
  width: 500,
  height: 500
}
```

`.src` gets the actual image URL.

Without `.src`, the normal `<img>` tag may fail.

This confuses many beginner developers.

---

# Right Side: Calendar Card

This section shows a simple weekly calendar.

It is NOT Google Calendar.

It is a visual week tracker only.

It helps users quickly see:

* current week
* today's date
* previous week
* next week

---

# How the Calendar Works

The calendar starts from:

```javascript id="v4c8t2"
currentWeekStart
```

This is usually the Monday of the current week.

From that date, the system creates 7 days:

```javascript id="w9f3a7"
const weekDates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(currentWeekStart);
  d.setDate(currentWeekStart.getDate() + i);
  return d;
});
```

This creates:

```text id="z1m7k5"
Monday
Tuesday
Wednesday
Thursday
Friday
Saturday
Sunday
```

for that week.

---

# Example

If:

```text id="e3r8p2"
currentWeekStart = May 13
```

Then:

```text id="f6u2q1"
13 14 15 16 17 18 19
```

will appear inside the calendar.

---

# How Today Is Highlighted

The system compares each day to today’s real date.

This function handles that:

```javascript id="n5d1w8"
const isSameDay = (a, b) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear();
```

If the date matches today:

```javascript id="b2x7r4"
isToday === true
```

then special styling is added:

```javascript id="y8p3v6"
bg-white
text-emerald-700
font-semibold
```

This creates the highlighted “today” circle.

This is the most important part of the calendar UI.

---

# Calendar Navigation Buttons

These buttons move the calendar week backward or forward.

## Left Arrow

```jsx id="d4n9k7"
<ChevronLeft />
```

calls:

```javascript id="l7s2m5"
onPrevWeek()
```

This moves to the previous week.

---

## Right Arrow

```jsx id="p8r1v3"
<ChevronRight />
```

calls:

```javascript id="t3w6f9"
onNextWeek()
```

This moves to the next week.

---

# Important Note

This page does NOT calculate week changes by itself.

It receives these functions from the parent page.

That means:

```javascript id="x5c2q8"
onPrevWeek
onNextWeek
```

are controlled elsewhere.

This is good React design.

The child displays.

The parent controls logic.

---

# Mobile Behavior

Notice this class:

```jsx id="s9v4m2"
hidden md:block
```

This means:

## On small screens

Calendar is hidden

## On medium screens and bigger

Calendar is shown

This improves mobile responsiveness.

Without this, the page could become too crowded.

---

# Common Beginner Mistakes

---

## Mistake 1

Forgetting `.src` on imported images

Wrong:

```javascript id="f2q8m1"
maleImg
```

Correct:

```javascript id="k6w3r9"
maleImg.src
```

---

## Mistake 2

Assuming this is a real backend calendar

It is not.

This is only a frontend week display.

No database saving happens here.

---

## Mistake 3

Trying to use `type="select"` for dropdowns

This page does not use that issue directly, but it is a common bug in related pages.

Use:

```jsx id="v1n5x7"
as="select"
```

not

```jsx id="h4p9t2"
type="select"
```

---

## Mistake 4

Breaking date logic by mutating original Date objects incorrectly

Always create:

```javascript id="j8r4c6"
new Date()
```

instead of changing the original date directly.

---

# Final Result

When the page loads, the user sees:

* a welcome message
* their account details
* a profile image
* current work week
* a clean weekly calendar
* easy week navigation

This gives users a strong dashboard starting point.

It improves both usability and confidence in the system.

A good landing page should reduce confusion.

This page does exactly that.
