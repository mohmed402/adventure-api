import CustomerDashboard from "../components/CustomerDashboard"
import Navigation from "../components/Navigation"

function Admin({setIsProfile}) {
    return (
        <>
            <CustomerDashboard setIsProfile={setIsProfile} />
        </>
    )
}

export default Admin
