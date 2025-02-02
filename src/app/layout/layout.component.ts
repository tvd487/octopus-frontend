import {CommonModule, isPlatformBrowser} from '@angular/common';
import {Component, HostListener, Inject, PLATFORM_ID, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router, RouterModule} from '@angular/router';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {Select, Store} from '@ngxs/store';
import {Observable, forkJoin} from 'rxjs';
import {FooterComponent} from '../shared/components/footer/footer.component';
import {HeaderComponent} from '../shared/components/header/header.component';
import {BackToTopComponent} from '../shared/components/widgets/back-to-top/back-to-top.component';
import {LoaderComponent} from '../shared/components/widgets/loader/loader.component';
import {ThemeOptionService} from '../shared/services/theme-option.service';
import {GetMenu} from '../shared/store/action/menu.action';
import {ThemeOptions} from '../shared/store/action/theme-option.action';
import {ThemeOptionState} from '../shared/store/state/theme-option.state';
import {NewsletterModalComponent} from '../shared/components/widgets/modal/newsletter-modal/newsletter-modal.component';
import {ExitModalComponent} from '../shared/components/widgets/modal/exit-modal/exit-modal.component';
import {SaleModalComponent} from '../shared/components/widgets/modal/sale-modal/sale-modal.component';
import {GetProductBySearch, GetProductBySearchList} from '../shared/store/action/product.action';
import {LoginModalComponent} from '../shared/components/widgets/modal/login-modal/login-modal.component';
import {AuthService} from '../shared/services/auth.service';
import {
  RecentPurchasePopupComponent
} from '../shared/components/widgets/recent-purchase-popup/recent-purchase-popup.component';
import {StickyCompareComponent} from '../shared/components/widgets/sticky-compare/sticky-compare.component';
import {Option} from '../shared/interface/theme-option.interface';
import {ThemeCustomizerComponent} from '../shared/components/widgets/theme-customizer/theme-customizer.component';
import {GetCategories} from '../shared/store/action/category.action';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, LoaderComponent, FooterComponent, ThemeCustomizerComponent, RouterModule, LoadingBarRouterModule,
    HeaderComponent, BackToTopComponent, StickyCompareComponent, NewsletterModalComponent,
    RecentPurchasePopupComponent, ExitModalComponent, LoginModalComponent, SaleModalComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  @Select(ThemeOptionState.themeOptions) themeOption$: Observable<Option>;
  @Select(ThemeOptionState.cookies) cookies$: Observable<boolean>;
  @Select(ThemeOptionState.exit) exit$: Observable<boolean>;

  @ViewChild("newsletterModal") NewsletterModal: NewsletterModalComponent;
  @ViewChild("exitModal") ExitModal: ExitModalComponent;
  @ViewChild("loginModal") LoginModal: LoginModalComponent;

  public cookies: boolean;
  public exit: boolean;
  public theme: string;
  public show: boolean;
  public isBrowser: boolean;

  constructor(private store: Store,
              private route: ActivatedRoute,
              private router: Router,
              public themeOptionService: ThemeOptionService,
              public authService: AuthService,
              @Inject(PLATFORM_ID) private platformId: Object,) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.store.dispatch(new ThemeOptions())
    this.cookies$.subscribe(res => this.cookies = res);
    this.exit$.subscribe(res => this.exit = res);

    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.router.url
        }
      }
    );

    this.route.queryParams.subscribe(params => this.theme = params['theme']);
    this.router.events.subscribe(
      (event: Params) => {
        if (this.isBrowser) {
          if (event instanceof NavigationEnd) {
            if (this.theme) {
              document.body.classList.add('home');
              if (this.theme == 'fashion_three') {
                themeOptionService.theme_color = '#96796d'
              }
            } else {
              // document.body.classList.remove('home');

              this.themeOption$.subscribe((value) => {
                if (value) {
                  themeOptionService.theme_color = value?.general?.primary_color;
                  themeOptionService.theme_color_2 = value?.general?.secondary_color;

                  document.body.style.setProperty('--theme-color', themeOptionService.theme_color);
                }
              })
            }

            document.body.style.setProperty('--theme-color', themeOptionService.theme_color);

            if (themeOptionService.theme_color_2 && (this.theme == 'marketplace_two' || this.theme == 'marketplace_four' || this.theme == 'marijuana' || this.theme == 'vegetables_four' || this.theme == 'gym' || this.theme == 'gradient' || this.theme == 'single_product')) {
              document.body.style.setProperty('--theme-color2', themeOptionService.theme_color_2);
            } else {
              document.body.style.removeProperty('--theme-color2');
              themeOptionService.theme_color_2 = ''
            }
          }

        }
      }
    );

    this.themeOptionService.preloader = true;
    const getProductBySearch$ = this.store.dispatch(new GetProductBySearchList());
    // const getCategories$ = this.store.dispatch(new GetCategories({ status: 1 }));
    const getMenu$ = this.store.dispatch(new GetMenu());

    // getCategories$,
    forkJoin([getMenu$, getProductBySearch$]).subscribe({
      complete: () => {
        this.themeOptionService.preloader = false;
      }
    });
  }

  openLoginModal(event: any) {
    if (event) {
      this.LoginModal.openModal();
    }
  }

  setLogo() {
    var headerLogo;
    var footerLogo;
    if (this.theme) {
      if (this.theme == 'fashion_three') {
        headerLogo = "assets/images/icon/logo/39.png";
        footerLogo = "assets/images/icon/logo/39.png";
      }
    } else {
      this.themeOption$.subscribe(theme => {
        headerLogo = theme?.logo?.header_logo?.original_url;
        footerLogo = theme?.logo?.footer_logo?.original_url;
      });
    }
    return {header_logo: headerLogo, footer_logo: footerLogo}
  }


  // @HostListener Decorator
  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (this.isBrowser) {
      let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (number > 600) {
        this.show = true;
      } else {
        this.show = false;
      }
    }
  }
}
