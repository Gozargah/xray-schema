Additional HTTP headers sent with the request. They can be used for authentication methods other than `user` / `pass`, for example `"Authorization": "Bearer ..."`.

They cannot contain `Host` or `Capsule-Protocol`, and when `user` or `pass` is set they cannot contain `Authorization` either. `User-Agent` is not sent by default; it can also be set to one of the special values `chrome`, `firefox`, `safari`, `edge`, `curl`, or `golang`.
