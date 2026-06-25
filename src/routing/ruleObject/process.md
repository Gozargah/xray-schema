If the connection originates from the local machine, match its process. If not from local, it is directly regarded as a match failure. Only supports Windows and Linux.

In particular, on Android the client app needs to call `github.com/xtls/xray-core/common/net.RegisterAndroidProcessFinder()` to inject the finder provided by the Android API. This hook can customize the string returned to the core, enabling features such as app matching.

This option is an array, where each item has three matching modes.

1. **No slash**: Matches process name.
2. **Contains slash, does not end with slash**: Matches absolute path.
3. **Contains slash, ends with slash**: Matches folder; all processes under this folder are considered a match.

Note:

- All options are case-sensitive.
- On Windows, use backslash `\` for paths. Here it is uniformly required to use forward slash `/`, e.g., `C:/Windows/System32/curl.exe`, because backslashes are treated as escape characters in JSON, which is inconvenient (unless you choose to double the backslashes, which also works).
- When matching by process name, the core automatically removes the `.exe` suffix. Similarly, `["curl"]` can match curl on both Linux and Windows. When using absolute paths, the `.exe` suffix cannot be ignored.

Special syntax sugar:

- `self/`: Matches the current core process, very useful for avoiding routing loops.
- `xray/`: Will be replaced by the absolute path where the current core resides, matching all Xray processes started from this binary.
