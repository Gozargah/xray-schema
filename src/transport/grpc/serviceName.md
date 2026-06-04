A string. Specifies the service name, similar to Path in HTTP/2. The client uses this name for communication, and the server verifies if the service name matches.

### TIP

When `serviceName` starts with a slash, you can customize the path. It requires at least two slashes. For example, fill in `"serviceName": "/my/sample/path1|path2"` on the server side, and the client can fill in `"serviceName": "/my/sample/path1"` or `"/my/sample/path2"`.
