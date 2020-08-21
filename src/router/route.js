
import licenseInfo from '@/components/page/licenseInfo'

let route = [
    {
        path: '/licenseinfo',
        component: licenseInfo,
        name: 'licenseInfo',
        
    },
    {
        path: '*',
        redirect:'/licenseinfo'
    }
    
]

export default route