UDP noise, used to send some random data as "noise" before sending a UDP connection. Presence of this structure implies enablement. It might deceive sniffers, or it might disrupt normal connections. _Use at your own risk._ For this reason, it bypasses port 53 because that breaks DNS.

An array that can define multiple noise packets to send. Each element is a [NoiseObject](https://xtls.github.io/en/config/outbounds/freedom.html#noiseobject).
