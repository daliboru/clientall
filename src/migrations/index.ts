import * as migration_20250116_093442_update from './20250116_093442_update';
import * as migration_20250116_140126_update1 from './20250116_140126_update1';
import * as migration_20250116_141816_update2 from './20250116_141816_update2';
import * as migration_20250116_142046_update_roles from './20250116_142046_update_roles';

export const migrations = [
  {
    up: migration_20250116_093442_update.up,
    down: migration_20250116_093442_update.down,
    name: '20250116_093442_update',
  },
  {
    up: migration_20250116_140126_update1.up,
    down: migration_20250116_140126_update1.down,
    name: '20250116_140126_update1',
  },
  {
    up: migration_20250116_141816_update2.up,
    down: migration_20250116_141816_update2.down,
    name: '20250116_141816_update2',
  },
  {
    up: migration_20250116_142046_update_roles.up,
    down: migration_20250116_142046_update_roles.down,
    name: '20250116_142046_update_roles'
  },
];
