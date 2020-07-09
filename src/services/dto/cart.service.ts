import { Injectable } from "@angular/core";
import { StorageService } from "../storage.service";
import { Cart } from "../../models/cart";
import { ProdutoDTO } from "../../models/produto.dto";

@Injectable()
export class CartService{
  
    constructor(public service: StorageService){
    }
    
    createOrClearCart(){
        let cart: Cart = {items: []};
        this.service.setCart(cart);
        return cart;
    }

    getCart(){
        let cart: Cart = this.service.getCart();
        if(cart==null){
            cart = this.createOrClearCart();
        }
        return cart;
    }

    addProduto(produto: ProdutoDTO) : Cart{
        let cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if(position = -1){
            cart.items.push({quantidade: 1, produto});
        }
        this.service.setCart(cart);
        return cart;
    }
}