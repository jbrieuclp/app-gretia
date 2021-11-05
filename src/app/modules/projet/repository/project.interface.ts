export interface Action {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "study"?: Study;
  "category"?: any;
  "charge"?: any;
  "label"?: string;
  "objectif"?: string;
  "nbOfDays"?: number;
  "numberDaysDone"?: number;
  "isClose"?: boolean;
  "periods"?: any[];
  "attributions"?: ActionAttribution[];
  "works"?: any[];
}

export interface ActionAttribution {
  "@id"?: string;
  "@type"?: string;
  "action"?: Action|string;
  "employee"?: Employee;
  "nbOfDays"?: number;
}

export interface ActionCategory {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "label"?: Study|string;
  "description"?: string;
  "orderBy"?: number;
  "actions"?: Action[]|string[];
}

export interface Antenne {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "name"?: string;
  "employees"?: Employee[]|number[];
}

export interface Category {
  id?: number,
  libelle?: string,
  ordre?: string
}

export interface Charge {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "label"?: string;
  "description"?: string;
  "unitCostApplied"?: number;
  "quantity"?: number;
  "quantityUsed"?: number;
  "cost"?: number;
  "autofunding"?: boolean;
  "study"?: Study;
  "chargeType"?: ChargeType;
  "actions"?: Action[];
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}

export interface ChargeType {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "chargeTypeRef"?: ChargeTypeRef;
  "applicationStart"?: Date;
  "applicationEnd"?: Date;
  "unitCost"?: number;
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
};

export interface ChargeTypeRef {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "label"?: string;
  "description"?: string;
  "orderBy"?: number;
  "isPerDay"?: boolean;
  "chargeTypes"?: ChargeType[];
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
};

export interface Deadline {
  "@id"?: string;
  "@type"?: string;
  "project"?: Project;
  "deadlineType"?: any;
  "date"?: Date;
  "comment"?: string;
  "isReported"?: boolean;
  "isObsolete"?: boolean;
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}

export interface DeadlineType {
  "@id"?: string;
  "@type"?: string;
  "label"?: string;
  "description"?: string;
  "order"?: number;
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}

export interface Employee {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "person"?: Person|any;
  "function"?: Function|number;
  "antenne"?: Antenne|number;
  "contractStart"?: string;
  "contractEnd"?: string;
  "rate"?: number;
  "removable"?: boolean;
}

export interface EmployeeParameter {
  "@id"?: string;
  "@type"?: string;
  "employee"?: any;
  "parameter"?: any;
  "value"?: any;
}

export interface Function {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "label"?: string;
  "employees"?: Employee[]|number[];
}

export interface Funder {
  "@id"?: string;
  "@type"?: string;
  "project"?: any;
  "organism"?: Organism;
  "funding"?: number;
  "fundingType"?: FundingType;
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}

export interface FundingType {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "fundingTypeRef"?: FundingTypeRef;
  "label"?: string;
  "applicationStart"?: string;
  "applicationEnd"?: string;
  "dailyCost"?: number[];
};

export interface FundingTypeRef {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "label"?: string;
  "description"?: string;
  "orderBy"?: number;
  "fundingTypes"?: FundingType[];
};

export interface LoadPlan {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "person"?: Person|string;
  "action"?: Action|any;
  "week"?: Week|any;
  "nbOfDays"?: number;
}

export interface Localisation {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "name"?: string;
  "studies"?: Study[];
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}

export interface Organism {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "name"?: string;
  "isPublic"?: string;
  "projetsFinances"?: any;
  "projetsTechniques"?: any;
};

export interface Person {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "name"?: string;
  "firstname"?: string;
  "alias"?: string;
  "compteId"?: number;
  "recup"?: number;
  "employees"?: Employee[]|number[];
  "workIn"?: Employee|number;
}

export interface Project {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "code"?: string;
  "label"?: string;
  "description"?: string;
  "dailyCost"?: number;
  "dateStart"?: Date;
  "dateEnd"?: Date;
  "localAttachment"?: any;
  "projectType"?: any;
  "funders"?: Funder[];
  "signatories"?: Signatory[];
  "deadlines"?: Deadline[];
  "studiesFundings"?: StudyFunding[];
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}

export interface ProjectType {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "code"?: string;
  "label"?: string;
  "isActive"?: boolean;
}

export interface Recup {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "employee"?: any;
  "dateRecup"?: Date;
  "quantity"?: number;
}

export interface Signatory {
  "@id"?: string;
  "@type"?: string;
  "project"?: Project;
  "organism"?: Organism;
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}

export interface StudyFunding {
  "@id"?: string;
  "@type"?: string;
  "study"?: any;
  "project"?: Project|string;
  "label"?: string;
  "eligibleFunding"?: number;
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}

export interface Study {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "code"?: string;
  "label"?: string;
  "objectif"?: string;
  "dateStart"?: string;
  "dateEnd"?: string;
  "groupeTaxo"?: string;
  "milieu"?: string;
  "localisations"?: any[];
  "managers"?: any[];
  "actions"?: Action[];
  "fundings"?: StudyFunding[];
  "parent"?: Study;
  "charges"?: Charge[];
  "childrens"?: Study[];
  "type"?: string;
  "cost"?: number;
  "dailyCost"?: number;
  "funding"?: number;
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}

export interface Travel {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "travel"?: string;
  "duration"?: number;
  "distance"?: number;
  "carpool"?: boolean;
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}

export interface Week {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "year"?: number;
  "month"?: number; 
  "weekNumber"?: number; 
  "monday"?: Date;
  "sunday"?: Date;
}

export interface Work {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "action"?: any;
  "employee"?: any;
  "workingDate"?: Date;
  "duration"?: number;
  "detail"?: string;
  "isNight"?: boolean;
  "isWe"?: boolean;
  "travels"?: any[];
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}