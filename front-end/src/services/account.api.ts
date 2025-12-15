import api from "./api";
import type { Account } from "../types/api.types";

export const accountApi = {
  getMyAccounts: () =>
    api.get<Account[]>("/accounts/me"),
};

