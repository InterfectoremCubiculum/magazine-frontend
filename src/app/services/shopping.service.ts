import { Injectable } from '@angular/core';
import { ShoppingList } from '../interfaces/ShoppingList';

const STORAGE_KEY = 'shoppingList';

@Injectable({
  providedIn: 'root'
})

export class ShoppingService {
  private shoppingList: ShoppingList[] = [];

  constructor() {
    this.loadFromStorage();
  }

  setList(list: ShoppingList[]) {
    this.shoppingList = list;
    this.saveToStorage();
  }

  getList(): ShoppingList[] {
    return this.shoppingList;
  }

  addToStorage(item: ShoppingList) {
    this.shoppingList.push(item);
    this.saveToStorage();
  }

  removeFromStorage(id: number) {
    this.shoppingList = this.shoppingList.filter(i => i.product.id !== id);
    this.saveToStorage();;
  }
  private saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.shoppingList));
  }

  private loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      this.shoppingList = JSON.parse(data);
    }
  }

  clearList() {
    this.shoppingList = [];
    localStorage.removeItem(STORAGE_KEY);
  }
}
