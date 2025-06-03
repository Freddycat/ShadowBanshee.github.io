import { ref, watch, computed } from "vue";
import { useUser } from "@/store/user";

export function useAmount() {
  const user = useUser();
  const free_selected = ref(false);
  const free = computed(() => user.subscription === "free");
  const input = ref(3);
  const amount = ref(300);
  const amount_error = ref(false);
  const amount_message = ref(null);

  function doAmount() {
    if (free_selected.value) {
      amount_message.value = null;
      amount_error.value = false;
      return;

    } else {
      amount_message.value = null;
      amount_error.value = false;
      if (input.value < 3) {
        input.value = 3;
        amount_error.value = true;
        amount_message.value = "The price for snail-mail is at least $3.00!";
      } else if (input.value > 10) {
        input.value = 10;
        amount_error.value = true;
        amount_message.value = "The max price is $10.00! For now ;)";
      } else {
        amount.value = parseFloat(input.value) * 100; // Convert to cents
        console.log("Amount updated on blur:", amount.value);
      }
    }
  }

  watch(input, function () {
    let filtered = String(input.value).replace(/[^0-9]/g, "");
    if (filtered === "10") {
      input.value = "10";
    } else if (filtered.length >= 1) {
      input.value = filtered.slice(-1);
    }
    amount.value = parseFloat(input.value) * 100; // Convert to cents
    console.log("Amount updated:", amount.value);
  });

  return {
    input,
    amount,
    amount_error,
    amount_message,
    free_selected,
    doAmount,
  };
}
