# Configuration

Edmunds is equipped with an instance of
[node-config](https://github.com/lorenwest/node-config) used for
configuring the application.

```typescript
import * as appRootPath from 'app-root-path'
import { Edmunds } from 'edmunds'

const edmunds = new Edmunds(appRootPath.path)
const appName = edmunds.config.get('app.name')
```

Documentation can be found on the
[node-config-wiki](https://github.com/lorenwest/node-config/wiki).
