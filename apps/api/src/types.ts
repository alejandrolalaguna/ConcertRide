import type { Env } from "./env";
import type { StoreAdapter } from "./store/adapter";

export interface HonoEnv {
  Bindings: Env;
  Variables: {
    store: StoreAdapter;
  };
}
