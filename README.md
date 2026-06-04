# xray-schema

The core idea of this project is to make some typescript utilities for xray-core

Ideas:

- [x] Runtime config validation (using zod)
- [x] JSON schema + docs + default snippets
- [ ] V2ray link generator
- [ ] V2ray link parser

### Details

- To include docs in JSON schema, the [official doc](https://xtls.github.io) is chunked and is imported to the schema. During build it generates 3 different bundles
  - `@gozargah/xray-schema` - the main package, which includes the zod schema without any docs or snippets
  - `@gozargah/with-docs` - the documentation bundle, which includes markdown description for each field in the schema, extracted from the official docs
  - `@gozargah/full` - the full bundle, which includes both the schema and the docs, and also includes default snippets for some protocols/transports. Its JSON schema is compatible with Monaco editor, which allows for autocompletion and validation in the editor.

- Using a scheduled GitHub action, the schema and docs are automatically updated whenever there is a change in the official docs. The action uses a custom Gemini prompt to extract the relevant information from the official docs and update the schema accordingly. (currently experimental)

## Usage

Install the package:

```sh
pnpm i @gozargah/xray-schema
```

## License

Published under the [LGPL3](https://github.com/gozargah/xray-schema/blob/main/LICENSE) license.
