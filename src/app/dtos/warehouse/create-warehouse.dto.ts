export class CreateWarehouseDto {
    name: string;
    location: string;
    
    constructor(name: string, location: string) {
        this.name = name;
        this.location = location;
    }
}