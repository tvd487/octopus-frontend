import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { TopBarComponent } from '../../widgets/top-bar/top-bar.component';
import { MenuComponent } from '../../widgets/menu/menu.component';
import { SettingsComponent } from '../widgets/settings/settings.component';
import { CartComponent } from '../widgets/cart/cart.component';
import { SearchComponent } from '../widgets/search/search.component';
import { Option } from '../../../interface/theme-option.interface';
import { HeaderLogoComponent } from '../widgets/header-logo/header-logo.component';
import { Router, RouterModule } from '@angular/router';
import { UserProfileComponent } from '../widgets/user-profile/user-profile.component';
// import { LoginModalComponent } from '../../widgets/modal/login-modal/login-modal.component';
import { Store } from '@ngxs/store';
import { AuthService } from '../../../services/auth.service';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-header-one',
  standalone: true,
  imports: [CommonModule, RouterModule,HeaderLogoComponent,TopBarComponent,
            MenuComponent, SettingsComponent, CartComponent,
            SearchComponent, UserProfileComponent],
  templateUrl: './header-one.component.html',
  styleUrl: './header-one.component.scss'
})
export class HeaderOneComponent {

  @Input() data: Option | null;
  @Input() logo: string | null | undefined;
  @Input() class: string;
  @Input() sticky: boolean | number | undefined; // Default false

  public stick: boolean = false;

  constructor(private menuService:MenuService, private router: Router, private store: Store, private authService: AuthService){}
  // @HostListener Decorator
  @HostListener("window:scroll", [])
  onWindowScroll() {
    const number = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
     if (number >= 50 && window.innerWidth > 400) {
      this.stick = true;
    } else {
      this.stick = false;
    }
  }

  mainMenuOpen(){
    this.menuService.mainMenuToggle = true;
  }

  reDirectWishlist(){
    if(!this.store.selectSnapshot(state => state.auth && state.auth.access_token))
      this.authService.isLogin = true;
    else this.router.navigate(['/wishlist'])
  }
}
