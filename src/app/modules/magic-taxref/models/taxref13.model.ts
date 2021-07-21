import { Deserializable } from "../../../shared/models/deserializable.model";
export class Taxref13 {
  
  cdNom: number;  
  nomComplet: string;  
  nomCompletHtml: string;  
  regne: string;  
  phylum: string;  
  classe: string;  
  ordre: string;  
  famille: string;	
	group1Inpn: string;	
	group2Inpn: string;  
  lbNom: string;  
  lbAuteur: string;  
  cdRef: number;  
  nomValide: string;  
  cdTaxsup: number;  
  cdSup: number;  
  rang: string;  
  nomVern: string;  
  nomVernEng: string;  
  habitat: string;  
  fr: string;  
  mar: string;  
  gua: string;  
  sm: string;  
  sb: string;  
  gf: string;  
  spm: string;  
  reu: string;  
  may: string;  
  epa: string;  
  sa: string;  
  ta: string;  
  taaf: string;  
  nc: string;  
  wf: string;  
  pf: string;  
  cli: string;  
  url: string;
  childrens: any;
  parent: any;

	deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
  
}