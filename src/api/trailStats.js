import Axios from "axios"
export function getTrailStatus() {
    return Axios.get("/data").then(res => {
        console.log(res.data)
        return res.data
    })
}
