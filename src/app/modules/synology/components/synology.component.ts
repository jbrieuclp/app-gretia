import { Component, ContentChild, TemplateRef } from '@angular/core';

import { SynologyService} from '@synology/synology.service';
import { SynologyDirective } from './synology.directive';

@Component({
  selector: 'app-synology',
  templateUrl: './synology.component.html',
  styleUrls: ['./synology.component.scss'],
})
export class SynologyComponent {

  get sid() { return this.synologyS.sid; };

  @ContentChild(SynologyDirective, { read: TemplateRef, static: false })
  synologyContentRef: TemplateRef<unknown>;

  constructor(
    private synologyS: SynologyService,
  ) { }
}
