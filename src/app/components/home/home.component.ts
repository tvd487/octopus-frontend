import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';

import {ThemeOptionService} from '../../shared/services/theme-option.service';

import {GetHomePage} from '../../shared/store/action/theme.action';

import {ThemeState} from '../../shared/store/state/theme.state';

import {Fashion3Component} from './fashion/fashion-3/fashion-3.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Fashion3Component],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  @Select(ThemeState.homePage) homePage$: Observable<string>;
  @Select(ThemeState.activeTheme) activeTheme$: Observable<string>;

  public theme: string;
  public homePage: any

  constructor(private store: Store,
              private route: ActivatedRoute,
              private themeOptionService: ThemeOptionService) {
    this.route.queryParams.subscribe(params => {
      this.themeOptionService.preloader = true;
      this.activeTheme$.subscribe(theme => {
        this.theme = params['theme'] ? params['theme'] : theme;
        if (this.theme) {
          this.store.dispatch(new GetHomePage(params['theme'] ? params['theme'] : theme)).subscribe(data => {
            this.homePage = data.theme.homePage;
            this.themeOptionService.preloader = false;
          })
        }
      })
    });
  }
}
