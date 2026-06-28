Format is the same as other IPs. Used to specify the IP used by the local inbound (when using 0.0.0.0 to listen on all IPs, different actual incoming IPs will produce different localIPs).

Ineffective for UDP (due to UDP being message-oriented, tracking is not possible); it always sees the listening IP.
