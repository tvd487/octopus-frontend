import { Component, Input } from '@angular/core';
import { Video } from '../../../shared/interface/theme.interface';
import { environment } from '../../../../environments/environment';
import { ThemeHomeSliderComponent } from '../widgets/theme-home-slider/theme-home-slider.component';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [ThemeHomeSliderComponent],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {

  @Input() data?: Video;
  @Input() slug?: string;

  public StorageURL = environment.storageURL;

}
