import { Responsibility } from "./Responsibility";
import { InstanceShort } from "./Instance";

interface ApplicationBase {
    product_nr: string,
    product_name: string,
    bcm_klasse: string,
    availability_class: string,
}

export interface Application extends ApplicationBase{
    responsibilites: Responsibility[],
    instances: InstanceShort[],
}

export interface ApplicationShort extends ApplicationBase {
    bpo?: string,
    tpm?: string,
}