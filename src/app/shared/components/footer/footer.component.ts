import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {FooterOneComponent} from './footer-one/footer-one.component';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Select} from '@ngxs/store';
import {ThemeOptionState} from '../../store/state/theme-option.state';
import {Observable} from 'rxjs';
import {FooterTwoComponent} from './footer-two/footer-two.component';
import {FooterThreeComponent} from './footer-three/footer-three.component';
import {FooterFourComponent} from './footer-four/footer-four.component';
import {Option} from '../../../shared/interface/theme-option.interface';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FooterOneComponent, FooterTwoComponent,
    FooterThreeComponent, FooterFourComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  @Input() logo: string | undefined;

  @Select(ThemeOptionState.themeOptions) themeOption$: Observable<Option>;

  public type: string;
  public path: string;
  public newsLetterStyle: string;
  public themeOptions: Option;

  constructor(private router: Router, public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.path = params['theme'];
      this.setFooter();
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setFooter();
      }
    });
  }

  setFooter() {
    this.themeOption$.subscribe(option => {
      if (this.path) {
        if (this.path == 'fashion_three') {
          this.type = "footer_one";
        }
      } else {
        this.themeOptions = option;
        this.type = option?.footer ? option?.footer.footer_style : 'footer_one ' || 'footer_one ';
      }
    })
  }
}
