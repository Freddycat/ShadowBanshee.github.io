// utils/alert.js
import { inject } from "vue";

export function useAlert() {
  const setAlert = inject("setAlert");
  if (!setAlert) throw new Error("setAlert not provided!");
  return setAlert;
}