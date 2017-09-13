This is a test to see how quickly (by message count and bandwidth) I can push and process JSON payloads between node applications. Benchmarks are with node v8.5.0 on a 4 year old Mac Book Pro with lots of other applications running at the same time. Each test hand-tuned the number of messages to send in a block and how many clients are sending messages in order to just barely avoid overworking the host script. Nothing here is scientific, but is informative.

| Method | messages (small payload) | bandwidth (small payload) | messages (large payload) | bandwidth (large payload)
| --- | --- | --- | --- | --- |
| TCP | 186K / second | 125Mb / second | 38k / second | 128Mb / second |
| sock | 125k / second | 84Mb / second | 30k / second |102Mb / second |
| UDP | 46k / second | 31Mb / second | 24k / second | 82Mb / second |
| IPC | 56k / second | 38Mb / second | 12k / second | 39Mb / second |

I don't understand why UDP performance is so terrible. Conceptually it should be better than TCP but it performed far worse. This may be because of how the udp "connections" are managed / looked up in the host.