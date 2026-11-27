The GUID of the Wintun adapter on Windows, as `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` in any letter case. It must not be another adapter's GUID. Default is derived from `name` with MD5.

It only applies when Xray creates the adapter: an existing one with that name keeps its own GUID. An invalid value is an error on every system, though only Windows uses it.
