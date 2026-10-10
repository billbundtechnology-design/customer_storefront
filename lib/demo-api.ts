import axios from "axios";
import { catalog } from "./catalog";

// The in-memory adapter keeps the storefront demo entirely offline.
export const demoApi = axios.create({
  adapter: async (config) => ({
    data: config.url === "/catalog" ? catalog : [],
    status: 200,
    statusText: "OK",
    headers: {},
    config
  })
});
