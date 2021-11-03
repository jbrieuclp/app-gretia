import { Component, OnInit } from '@angular/core';

import { ProjectService } from '../project.service';

@Component({
  selector: 'app-projet-project-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class ProjectDisplayComponent implements OnInit {

  get project() { return this.projectS.project.getValue(); }
  get loading(): boolean { return this.projectS.loadingProject; }

  constructor(
    private projectS: ProjectService,
  ) { }

  ngOnInit() {
  }

}
