import { afterEach } from "@jest/globals";
import { getApps, deleteApp } from "firebase/app";

afterEach(async () => {
  for (const app of getApps()) {
    try {
      await deleteApp(app);
    } catch {
      // ignore — already deleted
    }
  }
});