export interface Action {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "study"?: Study;
  "objective"?: any;
  "label"?: string;
  "description"?: string;
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
  "study"?: any;
  "chargeType"?: ChargeType;
  "actions"?: Action[];
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
}

export interface ChargeType {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "label"?: string;
  "description"?: string;
  "unitCost"?: number;
  "orderBy"?: number;
  "charges"?: any;
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
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
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
};

export interface DeadlineType {
  "@id"?: string;
  "@type"?: string;
  "label"?: string;
  "description"?: string;
  "order"?: number;
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
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
  "holidays"?: any[];
}

export interface EmployeeParameter {
  "@id"?: string;
  "@type"?: string;
  "employee"?: any;
  "parameter"?: any;
  "value"?: any;
}

export interface Expense {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "study"?: any;
  "chargeType"?: ChargeType|string;
  "provider"?: string;
  "details"?: string;
  "amountExclTax"?: number;
  "vat"?: number;
  "amountInclTax"?: number;
  "travel"?: string;
  "proofs"?: any[];
  "expenseDate"?: Date;
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
  "removable"?: boolean;
}

export interface ExpenseProof {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "expense"?: any;
  "fileName"?: string;
  "filePath"?: string;
  "originalFileName"?: string;
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
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
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
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

export interface Holiday {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "employee"?: any;
  "holidayDate"?: Date;
  "morning"?: boolean;
  "evening"?: boolean;
  "quantity"?: number;
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
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
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
}

export interface Objective {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "code"?: string;
  "label"?: string;
  "actions"?: any[];
  "study"?: any;
};

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
  "deadlines"?: ProjectDeadline[];
  "studiesFundings"?: StudyFunding[];
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
}

export interface ProjectDeadline {
  "@id"?: string;
  "@type"?: string;
  "project"?: Project;
  "deadlineType"?: any;
  "date"?: Date;
  "comment"?: string;
  "isReported"?: boolean;
  "isObsolete"?: boolean;
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
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

export interface RefDay {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "date"?: Date;
  "weekend"?: boolean;
  "notWorked"?: boolean;
}

export interface Signatory {
  "@id"?: string;
  "@type"?: string;
  "project"?: Project;
  "organism"?: Organism;
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
}

export interface StudyFunding {
  "@id"?: string;
  "@type"?: string;
  "study"?: any;
  "project"?: Project|string;
  "label"?: string;
  "eligibleFunding"?: number;
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
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
  "objectives"?: any[];
  "childrens"?: Study[];
  "type"?: string;
  "cost"?: number;
  "dailyCost"?: number;
  "funding"?: number;
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
}

export interface StudyDeadline {
  "@id"?: string;
  "@type"?: string;
  "study"?: any;
  "deadlineType"?: any;
  "date"?: Date;
  "comment"?: string;
  "isReported"?: boolean;
  "isObsolete"?: boolean;
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
}

export interface Travel {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "study"?: any;
  "travel"?: string;
  "travelDate"?: Date;
  "employee"?: any;
  "duration"?: number;
  "distance"?: number;
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
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
  "study"?: any;
  "action"?: any;
  "category"?: any;
  "employee"?: any;
  "workingDate"?: Date;
  "duration"?: number;
  "detail"?: string;
  "isNight"?: boolean;
  "isWe"?: boolean;
  "timeCoeff"?: number;
  "travels"?: any[];
  "expenses"?: any[];
  "createdAt"?: Date;
  "createdBy"?: string;
  "updatedAt"?: Date;
  "updatedBy"?: string;
}

export interface WorkCategory {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "label"?: Study|string;
  "description"?: string;
  "orderBy"?: number;
}