When the `method` in `InboundConfigurationObject` is not an SS2022 option, you can specify `method` for each user here (only non-SS2022 options are supported) together with `password`. In that case, the `password` set in `InboundConfigurationObject` will be ignored.

When the `method` in `InboundConfigurationObject` is an SS2022 option, setting `method` for individual users is not supported; it is unified to the method specified in `InboundConfigurationObject`.
