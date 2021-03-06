import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../../../objects/user';
import { Order } from '../../../objects/order';
import { OrderItem } from '../../../objects/order-item';
import { OrderService } from '../../../services/order/order.service';
import { ProductService } from '../../../services/product/product.service';


@Component({
  selector: 'app-complete-order',
  templateUrl: './complete-order.component.html',
  styleUrls: ['./complete-order.component.css'],
  providers: [OrderService, ProductService]
})
export class CompleteOrderComponent implements OnInit {

  orderId: number;
  customer: User;
  orderItems: OrderItem[];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.orderId = +params['id'];

      this.orderService.getUserByOrderId(this.orderId)
        .then((customer: User) => this.customer = customer);

      this.orderService.getOrderItemsByOrderId(this.orderId)
        .then((orderItems: OrderItem[]) => this.orderItems = orderItems);
    });
  }

  getTotalPrice() {

    let totalPrice = 0;

    if (this.orderItems) {
      for (const orderItem of this.orderItems) {
        totalPrice += (orderItem.quantity * orderItem.product.price);
      }
    }

    return totalPrice;
  }

  getSummaryTitle(title: string): string {
    return title.length > 20 ? title.substring(0, 20) + '...' : title;
  }

  completeTheOrder() {
    this.orderService.completeTheOrder(this.orderId)
      .then(() => this.router.navigate(['/admin/orders/sent']));
  }

}
