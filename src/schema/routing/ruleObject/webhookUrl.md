The URL to which the notification will be sent. Both standard web addresses and local Unix socket paths are supported.

- `https://api.example.com/alert` — a standard URL for sending notifications via HTTP(S). Used for integration with external web services or APIs.
- `/var/run/webhook.sock` — sends the notification via a Unix socket, with the POST request directed to the root path `/` of the socket.
- `/var/run/webhook.sock:/alert` — sends the notification via a Unix socket to a specific endpoint `/alert`. This allows direct integration with local services without using a network interface.
- `@abstract:/webhook` — abstract socket (lock-free, Linux/Android only).
- `@@padded:/webhook` — abstract socket with padding for HAProxy compatibility.
