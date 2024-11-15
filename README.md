# True Binary Clock

[View Live Demo](https://goluxas.github.io/true-binary-clock)

## What is this?

This project displays a stopwatch type timer that mimics the one used by Awesome Games Done Quick (AGDQ) in their event streams.

The AGDQ timer shows text in the foreground displaying the current run time in Arabic numerals, and the background is a series of columns of light-up pips that show the corresponding time in binary.

But that is not entirely true! Their timer uses a Binary Coded Digital (or BCD) display, in which each column of pips corresponds directly to one of the digits of the foreground timer. This leads to the
unfortunate result that the maximum value displayable by any column is the digit 9, in binary 1001.

I found this immensely unsatisfying as that meant no column would ever be fully lit. And so this pet project was born.

In this timer, the background pips are a true binary representation of the total deciseconds since the timer began. The least significant bit is the bottom pip in the rightmost column. The next least is above that,
and the next above that, until the column fills. The next bit is the bottom pip of the column to the left. Repeat this process to fill all 24 columns.

The maximum displayable time for this timer is 2^25 - 1 deciseconds, which is about 39 days, or a little over 932 hours.
