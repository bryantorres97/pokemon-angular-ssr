import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ContactPage implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);

  ngOnInit(): void {
    this.title.setTitle('Contacto');

    this.meta.updateTag({
      name: 'description',
      content: 'Esta es la página de contacto',
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
