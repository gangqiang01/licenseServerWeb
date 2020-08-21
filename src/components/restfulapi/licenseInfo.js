import {apiGet} from "../../assets/js/baseApi";

let licenseServerApi = "/deviceon-offline-authcode/";

let getAuthcodeApi = function({machineId, pn}){
    let data = {
        partnumber: pn,
        machineID: machineId
    }
    return new Promise((resolve, reject) => {
        apiGet(licenseServerApi, data).then((data) => {
            resolve(data)
        }).catch((err) => {
            resolve(err.response)
        })
    })
}
export {
    getAuthcodeApi,
}