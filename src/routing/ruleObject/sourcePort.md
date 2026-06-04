Source port. Three forms:

- `"a-b"`: a and b are positive integers less than 65536. This is a closed interval. The rule takes effect when the source port falls within this range.
- `a`: a is a positive integer less than 65536. The rule takes effect when the source port is a.
- A mixture of the above two forms, separated by commas ",". For example: `"53,443,1000-2000"`.
