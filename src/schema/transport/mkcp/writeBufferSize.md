The write buffer size for a single connection, in MB.

Default value is `2`.

**TIP:**

`readBufferSize` and `writeBufferSize` specify the memory size used by a single connection. When high-speed transmission is required, specifying larger `readBufferSize` and `writeBufferSize` will improve speed to a certain extent, but it will also use more memory.

When the network speed does not exceed 20MB/s, the default value of 1MB can meet the demand; beyond that, you can appropriately increase the values of `readBufferSize` and `writeBufferSize`, and then manually balance the relationship between speed and memory.
