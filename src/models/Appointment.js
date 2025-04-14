export class Appointment{
    constructor(id, businessId, clientId, serviceId, name, date, start_time, end_time, status){
        this.id = id,
        this.businessId = businessId,
        this.clientId = clientId,
        this.serviceId = serviceId,
        this.name = name,
        this.date = date,
        this.start_time = start_time,
        this.end_time = end_time,
        this.status = status
    }   
}