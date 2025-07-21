import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutPage implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Acerca de la aplicación');

    this.meta.updateTag({
      name: 'description',
      content: 'Esta es la página de acerca de la aplicación',
    });

    this.meta.updateTag({
      name: 'keywords',
      content: 'angular, ssr, seo, angular universal',
    });

    this.meta.updateTag({
      name: 'robots',
      content: 'index, follow',
    });

    this.meta.updateTag({
      name: 'author',
      content: 'Bryan Torres',
    });
  }
}
