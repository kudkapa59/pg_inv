import { Database } from "./Database";
import { User } from "./User";

interface InstanceBase {
    coba_coria: string,
    instance_name: string,
    project: string,
    lifecycle_status?: string,
    version: string,
    location: string,
    cpu: string,
    mem_mb: string,
    disk_size_gb: string,
}

export interface Instance extends InstanceBase {
    ip_address: string,
    status: string,
    type: string,
    create_time: string,
    backups: boolean,
    replicas: boolean,
    databases: Database[],
    dbusers: User[],
    labels?: { [key: string]: string }
}

export interface InstanceShort extends InstanceBase { }