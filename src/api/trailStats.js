import Axios from "axios"
export function getTrailStatus() {
    return Axios.get("https://interactive-ski-maps.nyc3.digitaloceanspaces.com/output2.json").then(res => {
        console.log(res)
        return res.data
    })
}
