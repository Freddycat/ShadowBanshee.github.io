import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCart = defineStore('cart', () => {
  const cart = ref([]);

  const totalPrice = computed(() => {
    return cart.value.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  });

  function AddToCart(item) {
    const target = cart.value.find(i => i.title === item.title);
    if (target) {
      target.quantity++;
    } else {
      cart.value.push({ ...item, quantity: 1 });
    }
  }

  function UpdateQuantity(item, change) {
    const target = cart.value.find(i => i.title === item.title);
    if (target) {
      target.quantity += change;
    }
  }

  function RemoveFromCart(item) {
    cart.value = cart.value.filter(i => i.title !== item.title);
  }

  function ClearCart() {
    cart.value = [];
  }

  return {
    cart,
    totalPrice,
    AddToCart,
    UpdateQuantity,
    RemoveFromCart,
    ClearCart
  };
});
