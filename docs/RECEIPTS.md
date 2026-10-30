# Receipts

`receipt()` prints a line in the exact format:

```text
N items, total $X.YY
```

`N` counts every unit bought: it is the sum of all item quantities.

The total comes from `total()`, includes discount and shipping, and is formatted as dollars with exactly two digits after the decimal point.
