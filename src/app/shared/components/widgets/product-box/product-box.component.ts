import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {Product} from '../../../interface/product.interface';
import {Option} from '../../../interface/theme-option.interface';
import {ThemeOptionService} from '../../../services/theme-option.service';
import {UpdateProductBox} from '../../../store/action/theme-option.action';
import {ThemeOptionState} from '../../../store/state/theme-option.state';
import {ProductBoxOneComponent} from './product-box-one/product-box-one.component';
import {ProductBoxTwoComponent} from "./product-box-two/product-box-two.component";

@Component({
  selector: 'app-product-box',
  standalone: true,
  templateUrl: './product-box.component.html',
  styleUrl: './product-box.component.scss',
  imports: [CommonModule, ProductBoxOneComponent]
})
export class ProductBoxComponent {

  @Input() product: Product;
  @Input() style: string;
  @Input() product_box_style: string;

  @Select(ThemeOptionState.themeOptions) themeOption$: Observable<Option>;
  @Select(ThemeOptionState.productBox) productBox$: Observable<string>;

  public path: string;
  public variant: string;


  constructor(public route: ActivatedRoute, private store: Store, public themeOptionService: ThemeOptionService) {
    this.route.queryParams.subscribe(params => this.path = params['theme'])
    this.setVariant();
    this.productBox$.subscribe(res => this.variant = res)
  }

  setVariant() {
    if (this.path == 'fashion_three') {
      this.variant = 'product_box_one';
    } else {
      this.themeOption$.subscribe(theme => {
        this.variant = theme?.product ? theme?.product?.product_box_variant : 'product_box_one';
      });
    }
    this.store.dispatch(new UpdateProductBox(this.variant))
  }
}
