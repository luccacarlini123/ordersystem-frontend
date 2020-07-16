import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { ClienteDTO } from '../../models/cliente.dto';
import { CartItem } from '../../models/cart-item';
import { ClienteService } from '../../services/dto/cliente.service';
import { CartService } from '../../services/dto/cart.service';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoService } from '../../services/dto/pedido.service';

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
  codpedido: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public clienteService: ClienteService,
    public cartService: CartService,
    public pedidoService: PedidoService) {
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

  back() {
    this.navCtrl.setRoot('CartPage');
  }

  home(){
    this.navCtrl.setRoot('CategoriasPage');
  }

  checkout(){
    this.pedidoService.insert(this.pedido)
      .subscribe(response =>{
        this.cartService.createOrClearCart();
        this.codpedido = this.extractId(response.headers.get('location'));      
      }, 
      error => {
        if(error.status == 403){
          this.navCtrl.setRoot('HomePage');
        }
      })
  }

  private extractId(location: string) : string {
    let position = location.lastIndexOf('/');
    return location.substring(position+1, location.length);
  }

  total(){
    return this.cartService.total();
  }

}
