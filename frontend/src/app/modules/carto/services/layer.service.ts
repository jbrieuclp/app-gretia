import { Injectable, ElementRef } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogConfig } from '@angular/material';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import { AppConfig } from '../../../shared/app.config';
import { Layer } from '../layers/layer';
import { RepartitionLayer } from '../layers/repartition-layer';
import { PressionLayer } from '../layers/pression-layer';
import { RichesseLayer } from '../layers/richesse-layer';
import { CartoService } from './carto.service';
import { TooltipDialog } from '../components/tooltip/tooltip.dialog'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

export interface PARAMS {
  scale: number,
  feature?: string
};

@Injectable()
export class LayerService {

  httpUrlBase: string;
  layers: Array<RepartitionLayer> = [];
  //parametres par defaut
  params: PARAMS = {
    scale: 32 //maille 5km
  };
  $this = this;

  constructor( 
  	private cartoS: CartoService,
  	private http: HttpClient,
    public dialog: MatDialog 
  ) {
  	this.httpUrlBase = AppConfig.URL_API_CARTO;

    this.cartoS.addClickFunction = {fct: this.displayFeatureInfo, this: this};
  }

  /***********************
  *
  *  Accesseurs
  *
  ************************/
  get scale() { return this.params.scale; }
  set scale(scale: number) { 
    this.params.scale = scale;
    this.reloadLayers();
  }


  /***********************
  *
  *  Fonctions publiques
  *
  ************************/
  public addRepartitionLayer(taxon): void {
    let ID = taxon.cd_ref;
    if ( this.layerExist(ID) ) {
      this.reloadLayer(ID, true);
      return;
    }
    let layer = new RepartitionLayer(taxon);
    this.addLayer(layer);
  }

  public addIndicateurLayer(ID): void {
    if ( this.layerExist(ID) ) {
      this.reloadLayer(ID, true);
      return;
    }

    if ( ID == 'PRESSION_LAYER') {
      let layer = new PressionLayer();
      this.addLayer(layer);
      return;
    } else if ( ID == 'RICHESSE_LAYER') {
      let layer = new RichesseLayer();
      this.addLayer(layer);
      return;
    }
  }

  public getLegende(layer): void {
    return layer.getLegende();
  }

  public removeLayer(ID) {
    let layer = this.getLayer(ID);
    this.cartoS.map.removeLayer(layer.olLayer);
    this.layers = this.layers.filter((layer) => {layer.ID !== ID});
  }


  /***********************
  *
  *  Fonctions de service
  *
  ************************/
  public layerExist(ID): boolean {
    let bool = false;
    this.layers.forEach((e) => {
      if ( e.ID == ID ) {
        bool = true;
      }
    })
    return bool;
  }

  public isVisible(ID): boolean {
    let bool = false;
    this.layers.forEach((e) => {
      if ( e.ID == ID && e.olLayer.getVisible()) {
        bool = true;
      }
    })
    return bool;
  }

  public getLayer(ID) {
    let layer = null;
    this.layers.forEach((e) => {
      if ( e.ID == ID ) {
        layer = e;
      }
    })
    return layer;
  }

  protected addLayer(layer): void {
    let olLayer = new VectorLayer({
                        ID: layer.ID, 
                        title: layer.title, 
                        queryable: layer.queryable,
                        displayInLegend: layer.displayInLegend,
                        source: new VectorSource({format:this.cartoS.formatGeoJSON}), 
                        style: layer.style,
                        visible: layer.visible
                  });

    this.cartoS.map.addLayer(olLayer);
    layer.olLayer = olLayer;

    this.layers.push(layer);
    this.loadLayer(layer);
  }

  protected loadLayer(layer: Layer) {
    let source = layer.olLayer.getSource();
    layer.state = "load";
    this.getGeoJSON(layer)
          .subscribe((geosjon: Response) => {
            layer.state = "done";
            source.clear();
            source.addFeatures(this.cartoS.formatGeoJSON.readFeatures(geosjon));
          });
  }

  protected reloadLayer(ID, visibility:boolean = null) {
    let layer:Layer = this.getLayer(ID);
    this.loadLayer(layer);
    if (visibility !== null) {
      layer.olLayer.setVisible(visibility);
    }
  }

  protected reloadLayers() {
    this.layers.forEach((e) => {
      if ( e.olLayer.getVisible() ) {
        this.loadLayer(e);
      }
    })
  }


  //fonction d'ouverture de l'infobulle d'information de carte
  displayFeatureInfo = function($this, evt) {
    let pixel = evt.pixel;
    let coordinate = evt.coordinate;
    let items = {};
    $this.cartoS.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
      if ( layer !== null && layer.get('queryable') ) {
        console.log(layer);
        console.log(feature);
        let id = layer.get('ID');
        if( !(id in items) ){ 
          items[id] = {
            'title': layer.get('title'),
            'ID': id,
            'features': []
          };
        }
        items[id]['features'].push(feature)
      }
    });


    if (Object.keys(items).length !== 0) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.data = Object.values(items); //on casse l'objet en tableau, on a plus besoin des idx
      dialogConfig.width = '1000px';
      dialogConfig.height = '500px';
      dialogConfig.hasBackdrop = true;
      dialogConfig.closeOnNavigation = true;

      const dialogRef = $this.dialog.open(TooltipDialog, dialogConfig);
    }

  }

  /**************
  *
  *  Lien API
  *
  ***************/

  /** GET taxon par ID (cd_nom) **/
  private getGeoJSON(layer, params: any = this.params): Observable<any> {
    const url = `${this.httpUrlBase}${layer.url}`;
    const sources = params;
    return this.http
      .post(url, sources, httpOptions);
  }

  /** GET taxon par ID (cd_nom) **/
  public getFeatureInfo(layer, feature_id: string, params: any = this.params): Observable<any> {
    const url = `${this.httpUrlBase}${layer.url_info}/${feature_id}`;
    const sources = params;
    return this.http
      .post(url, sources, httpOptions);
  }

  /** GET AvailablesScales **/
  public getAvailablesScales(): Observable<any> {
    const url = `${this.httpUrlBase}/scales`;
    return this.http
      .get(url, httpOptions);
  }

}
