import { Food } from './../../shared/models/foods/Food';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from './../../shared/models/carts/Cart';
import { Injectable, OnInit } from '@angular/core';
import { CartItem } from 'src/app/shared/models/cartItems/CartItem';

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnInit {
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);
  constructor() {}
  addToCart(food: Food): void {
    let cartItem = this.cart.items.find((item) => item.food.id === food.id);
    if (cartItem) {
      return;
    }
    this.cart.items.push(new CartItem(food));
    this.setCartToLocalStorage();
  }
  removeFromCart(id: String): void {
    this.cart.items = this.cart.items.filter((item) => item.food.id !== id);
  }
  changeQuantity(id: string, quantity: number): void {
    let cartItem = this.cart.items.find((item) => item.food.id === id);
    if (!cartItem) {
      return;
    }
    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;
    this.setCartToLocalStorage();
  }
  clearCart() {
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }
  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }
  getCart(): Cart {
    return this.cartSubject.value;
  }

  private setCartToLocalStorage(): void {
    this.cart.total = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.price,
      0
    );
    this.cart.totalCount = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.quantity,
      0
    );

    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('cart', cartJson);
    this.cartSubject.next(this.cart);
  }
  private getCartFromLocalStorage(): Cart {
    const cartJson = localStorage.getItem('cart');
    return cartJson ? JSON.parse(cartJson) : new Cart();
  }
  ngOnInit(): void {}
}
