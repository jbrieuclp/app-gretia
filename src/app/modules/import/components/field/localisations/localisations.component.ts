import { Component, OnInit, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Circle, Fill, Stroke, Style} from 'ol/style';
import * as format from 'ol/format';
import * as proj from 'ol/proj';
import { Draw } from 'ol/interaction';

import { ImportService } from '@import/services/import.service';
import { FileService } from '@import/services/file.service';
import { LocalisationService } from './localisation.service';
import { CartoService } from '@carto/services/carto.service';

@Component({
  selector: 'app-import-field-localisations',
  templateUrl: './localisations.component.html',
  styleUrls: ['./localisations.component.scss'],
  providers: [FileService]
})
export class FieldLocalisationsComponent implements OnInit, AfterViewInit {

	fichier: Observable<any>;
	error: Observable<any>;
	raw_data: any;
	_localisations: any[];
  geojson = new VectorLayer({
    source: new VectorSource({format:new format.GeoJSON({projection: new proj.get('EPSG:3857')})}),
    style: [
      new Style({
        image: new Circle({
          fill: new Fill({color: 'rgba(255,255,255,0)'}),
          stroke: new Stroke({color: '#cd0000', width: 1.25}),
          radius: 5
        }),
        fill: new Fill({color: 'rgba(255,255,255,0)'}),
        stroke: new Stroke({color: '#cd0000', width: 1.25})
      })
    ]
  });
  searchOSMGeoJSON: VectorLayer;
  drawInteraction: Draw;

  click_on_map: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @HostListener('window:resize', ['$event']) 
    onResize(event) {
      this.resizeMap(); 
  }
  @ViewChild('map', { static: true }) mapView: ElementRef;

  map: Map;

  constructor(
  	private route: ActivatedRoute,
  	private router: Router,
  	private importS: ImportService,
    public fileS: FileService,
  	private localisationS: LocalisationService,
    private cartoS: CartoService
  ) { }

  ngOnInit() {
  	let id_fichier = this.route.snapshot.paramMap.get('fichier');

    if ( id_fichier !== null && Number.isInteger(Number(id_fichier)) ) {
	  	this.error = null;
    	this.localisationS.fichierId = Number(id_fichier);
    	this.error = this.localisationS.error;
    } else { 
    	this.router.navigate(['/import']); 
    }
    this.map = this.cartoS.initMap();
    this.cartoS.mapview = this.mapView;
    this.cartoS.map.addLayer(this.geojson);
    this.localisationS.features
                        .subscribe(features=>{
                          let source = this.geojson.getSource();
                          source.clear();
                          source.addFeatures(features);
                        });

    this.cartoS.map.addLayer(this.localisationS.drawLayer);
    this.searchOSMGeoJSON = new VectorLayer({
      source: this.localisationS.searchOSMGeoJSONSource,
      style: function (feature, resolution){
          return [new Style({
            image: new Circle({
              radius: this.localisationS.OSMDataHover.getValue() == feature.get('name') ? 15 : 7,
              fill: new Fill({color: '#666666'}),
              stroke: new Stroke({color: '#bada55', width: 1})
            })
          })]
        }.bind(this)
    })
    this.cartoS.map.addLayer(this.searchOSMGeoJSON);
    this.localisationS.OSMDataHover.asObservable().subscribe(value=>this.searchOSMGeoJSON.changed());

    this.drawInteraction = new Draw({
      source: this.localisationS.drawLayer.getSource(),
      type: 'Point'
    });

    this.localisationS.drawLayer.getSource().on('change', (e)=>{
      //pour n'avoir qu'un unique pointage
      if (this.localisationS.drawLayer.getSource().getFeatures().length > 1) {
        this.localisationS.drawLayer.getSource().removeFeature(
          this.localisationS.drawLayer.getSource().getFeatures()[0]
        );
      }
    })

    this.click_on_map.asObservable()
      .subscribe(state=>{
        this.resizeMap();
        if (state) {
          this.map.addInteraction(this.drawInteraction);
        } else {
          this.map.removeInteraction(this.drawInteraction);
          this.localisationS.drawLayer.getSource().clear();
        }
      });
  }

  ngAfterViewInit() {
    this.map.setTarget('map');
    this.resizeMap();
  }

  resizeMap(){
    let width = this.mapView.nativeElement.offsetWidth;
    let height = window.innerHeight - 66;
    this.cartoS.resizeMap(width, height);
  }

  switchLayer(switch_layer) {
    this.cartoS.map.getLayers().forEach((groupe) => {
      if ( groupe.get('id') == 'g_fdp' ) { //groupe de fonds de plans
        groupe.getLayers().forEach((layer)=>{
          layer.setVisible(false);
          if( layer.get('id') == switch_layer) {
            layer.setVisible(true);
          }
        })
      }
    })
  }

}
