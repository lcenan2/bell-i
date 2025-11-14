import { afterAll } from "@jest/globals";
import { getApps, deleteApp } from "firebase/app";

afterAll(async () => {
  for (const app of getApps()) {
    try {
      await deleteApp(app);
    } catch {}
  }
});