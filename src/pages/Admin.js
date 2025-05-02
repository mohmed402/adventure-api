import { useState } from "react"
import CityData from "../components/CityData"
import CustomerDashboard from "../components/CustomerDashboard"
import Navigation from "../components/Navigation"

function Admin({setIsProfile}) {
    const [pageNumber, setPageNumber] = useState(1);
    return (
        <>
        {pageNumber === 1 && 
           <CustomerDashboard setIsProfile={setIsProfile} pageNumber={pageNumber} setPageNumber={setPageNumber} /> }
               {pageNumber === 0 && 
            <CityData setIsProfile={setIsProfile}  pageNumber={pageNumber} setPageNumber={setPageNumber} />}
        </>
    )
}

export default Admin
