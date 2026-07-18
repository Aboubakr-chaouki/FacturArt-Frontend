export interface Client {
    id:              number
    lastName:        string
    firstName:       string
    email:           string
    phone:           string
    addressLine1:    string
    addressLine2?:   string
    postalCode:      string
    city:            string
    companyName?:    string
    isProfessionnel: boolean
    siret?:          string
    notes?:          string
    createdAt:       string
}
