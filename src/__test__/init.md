-   install deps

`pnpm i -D vitest`

-   initial test setup

```
import { describe, it, expect } from "vitest"

describe("health-check", () => {
    describe("check root route", () => {
        describe("env variable are not loaded", () => {
            it("should return text", () => {
                expect(true).toBe(true)
            })
        })
    })
})

```

-   run test with package.json script

```json
{ "test": "vitest" }
```
