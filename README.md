# xray-schema

The main idea of this project is to make some typescript utilities for xray-core json config

Ideas:

- [x] Runtime config validation (using zod)
- [-] JSON schema + docs + default snippets
  - [ ] More default snippets need to be added for different properties (inbounds, outbounds, dns, routing, etc)
  - [-] More elegant Monaco editor integration
    - [x] Improve JSON schema to provider better auto complete for discriminated unions
    - [ ] Higher priority for required fields
- [ ] Link generator -> inbound to link
- [ ] Link parser -> link to outbound
- [ ] Wasm of xray-core to validate config in browser

### Details

- To include docs in JSON schema, the [official doc](https://xtls.github.io) is chunked and is imported to the schema. During build it generates 3 different bundles
  - `@gozargah/xray-schema` - the main package, which includes the zod schema without any docs or snippets
  - `@gozargah/with-docs` - the documentation bundle, which includes markdown description for each field in the schema, extracted from the official docs
  - `@gozargah/full` - the full bundle, which includes both the schema and the docs, and also includes default snippets for some protocols/transports. Its JSON schema is compatible with Monaco editor, which allows for autocompletion and validation in the editor.

## Usage

Install the package:

```sh
pnpm i @gozargah/xray-schema
```

## License

Published under the [LGPL3](https://github.com/gozargah/xray-schema/blob/main/LICENSE) license.
