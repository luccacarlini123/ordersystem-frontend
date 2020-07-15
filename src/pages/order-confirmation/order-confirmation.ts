import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { ClienteDTO } from '../../models/cliente.dto';
import { CartItem } from '../../models/cart-item';
import { ClienteService } from '../../services/dto/cliente.service';
import { CartService } from '../../services/dto/cart.service';
import { EnderecoDTO } from '../../models/endereco.dto';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  cartItems: CartItem[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public clienteService: ClienteService,
    public cartService: CartService) {
      this.pedido = this.navParams.get('pedido');
  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items;

    this.clienteService.findById(this.pedido.cliente.id)
      .subscribe(response => {
        this.cliente = response as ClienteDTO;
        this.endereco = this.findEndereco(this.cliente.id, response['enderecos']);
      },
      error => {
        this.navCtrl.setRoot('HomePage');
      })
  }

  private findEndereco(id: string, list: EnderecoDTO[]){
    let position = list.findIndex(x => x.id == id);
    return list[position];
  }

  total(){
    return this.cartService.total();
  }

}
