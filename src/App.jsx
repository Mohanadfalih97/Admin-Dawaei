import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import CreateVote from "./pages/CreateVote";
import VoteDetails from "./pages/VoteDetails";
import Reports from "./pages/Reports";
import Members from "./pages/Members";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import UsersInfo from "./pages/UsersInfo";
import VotePageMain from "./pages/VotePageMain";
import EditVote from "./pages/EditVote";
import VoteUsers from "./pages/VoteUsers";
import Department from "./pages/Department";
import InstitutionDetails from "./pages/InstitutionForm";
import AssignMembersToElection  from "./pages/AssignMembersToElection ";


import LoginAsMember from "./pages/loginAsMember";
import RestAccesscode from "./pages/RestAccesscode";
import Agenda from "./pages/Agenda";
import AddAgenda from "./components/Agenda/AddAgenda";
import EditAgenda from "./components/Agenda/EditAgenda";
import EditUser from "./components/users/EditUser";
import OtpPassowrdAdmin from "./pages/OtpPassowrdAdmin";
import RestAccesscodeByAdmin from "./pages/RestAccesscodeByAdmin";
import ResetPassword from "./pages/ResetPassword";
import AddMember from "./pages/AddmemberPage";
import UserEditDialog from "./pages/UserEditDialog";
import Electoralcycles from "./pages/Electoralcycles";
import Candidates from "./pages/Candidates";
import AddElectoralcycles from "./components/Electoralcycles/AddElectoralcycles";
import Notifacation from "./components/notifacation/notifacation";
import AddCandidates from "./components/Candidates/AddCandidates";
import EditCandidates from "./components/Candidates/EditCandidates";
import ElectionCycleDetails from "./components/Electoralcycles/ElectionCycleDetails";
import AddDepartment from "./components/Department/AddDepartment";
import ProfileEditPanel from "./components/profile/profilepanel";
import Addinstitution from "./components/institution/Addinstitution";
import InstitutionForm from "./pages/InstitutionForm"; 
import AddUser from "./components/users/AddUser"; 


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/* import { AuthProvider } from "./AuthContext";
 */

const App = () => {
  return (

    <Router>
{/*       <AuthProvider>
 */}        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="votes/create" element={<CreateVote />} />
            <Route path="votes/:id" element={<VoteDetails />} />
            <Route path="user/:id" element={<UserEditDialog />} />
            <Route path="reports" element={<Reports />} />
            <Route path="members" element={<Members />} />
            <Route path="UsersInfo" element={<UsersInfo />} />
            <Route path="EditUser" element={<EditUser />} />
            <Route path="notifacation" element={<Notifacation />} />
            <Route path="EditCandidates/:id" element={<EditCandidates />} />
            <Route path="ProfileEditPanel" element={<ProfileEditPanel />} />
            <Route path="AddElectoralcycles" element={<AddElectoralcycles />} />
            <Route path="AddCandidates" element={<AddCandidates />} />
            <Route path="Candidates" element={<Candidates />} />
            <Route path="ElectionCycleDetails" element={<ElectionCycleDetails />} />
            <Route path="Department" element={<Department />} />
            <Route path="InstitutionDetails" element={<InstitutionDetails />} />
            <Route path="/assign-members" element={<AssignMembersToElection />} />
                  <Route path="/institution/create" element={<InstitutionForm />} />
            <Route path="/institution/edit/:id" element={<InstitutionForm />} /> 
            <Route path="Add-Department" element={<AddDepartment />} />
            <Route path="Add-institution" element={<Addinstitution/>} />
            <Route path="Agenda" element={<Agenda/>} />
                  <Route path="AddUser" element={<AddUser/>} />

            <Route path="Add-Agenda" element={<AddAgenda/>} />

            <Route path="EditAgenda" element={<EditAgenda/>} />







          </Route>

          {/* صفحات بدون MainLayout */}
          <Route path="/login" element={<Login />} />
          <Route path="/LoginAsMember" element={<LoginAsMember />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/AddMember" element={<AddMember />} />
          <Route path="/VoteUsers" element={<VoteUsers />} />
          <Route path="/Otp-password" element={<OtpPassowrdAdmin />} />
          <Route path="/RestAccesscode" element={<RestAccesscode />} />
<Route path="RestAccesscodeByAdmin/:id" element={<RestAccesscodeByAdmin />} />


          {/* صفحة 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer position="top-center" rtl />
{/*       </AuthProvider>
 */}    </Router>
  );
};

export default App;
