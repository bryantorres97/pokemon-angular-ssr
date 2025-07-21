import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pricing',
  imports: [],
  templateUrl: './pricing-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PricingPage implements OnInit{
  private title = inject(Title);
  private meta = inject(Meta);
  private platform = inject(PLATFORM_ID)

  ngOnInit(): void {

    this.title.setTitle('Precios');

    this.meta.updateTag({
      name: 'description',
      content: 'Esta es la página de precios',
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

    if (isPlatformServer(this.platform)) {
      console.log('Server');
    }

    if (isPlatformBrowser(this.platform)) {
      console.log('Client');
    }
  }
}
