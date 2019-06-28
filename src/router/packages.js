import AllPackage from '../components/content/package/AllPackage'
import EditPackage from '../components/content/package/EditPackage'

export const packages = {
    path: "/packages",
    name: 'packages',
    component: AllPackage,
    exact: true
}

export const singlePackage = { path: "/package/:id", name: 'package', component: EditPackage }



