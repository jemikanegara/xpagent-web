export const packageQuery = `{
    getOwnPackage {
    _id,
    packageName,
    packagePrice,
    packageImages,
    packageDuration,
    packageCustomer  
    }
}`;

export const singlePackageQuery = `
    query ($id : String!) {
    getSinglePackage(id: $id){
        packageName,
        packagePrice,
        packageDescription,
        packageImages,
        packageDuration,
        packageCustomer
    }
}`

export const createPackageQuery = `
    mutation (
        $packageName: String!,
        $packagePrice: Int!,
        $packageDescription: String!,
        $packageImages: [Upload!]!,
        $packageDuration: Int!,
        $packageCustomer: Int!
        ) {
            createPackage(
            tourPackage:
            {packageName : $packageName, 
            packagePrice: $packagePrice, 
            packageDescription: $packageDescription, 
            packageImages: $packageImages, 
            packageDuration: $packageDuration, 
            packageCustomer: $packageCustomer}){
                packageName
            }
}`

export const updatePackageQuery = `
    mutation (
    $_id: ID!,
    $packageName: String,
    $packagePrice: Int,
    $packageDescription: String,
    $packageImages: [Upload],
    $packageDuration: Int,
    $packageCustomer: Int
    ) {
        updatePackage(tourPackage: {
            _id: $_id,
            packageName: $packageName, 
            packagePrice: $packagePrice, 
            packageDescription: $packageDescription, 
            packageImages: $packageImages, 
            packageDuration: $packageDuration, 
            packageCustomer: $packageCustomer}) {
                _id
            }
}`

export const deletePackageImgQuery = `
    mutation ($_id : ID!, $imageKey : String!){
        deletePackageImage(_id: $_id, imageKey: $imageKey) {
            _id
        }
    }
`

export const deletePackageQuery = `
    mutation ($_id : ID!){
        deletePackage(tourPackage: {_id: $_id}){
            _id
        }
    }
`

export const deleteMultiPackageQuery = `
    mutation ($_id : [deletePackageInput!]!){
        deleteMultiPackages(tourPackages: $_id){
            n,
            ok,
            deletedCount
        }
    }
`