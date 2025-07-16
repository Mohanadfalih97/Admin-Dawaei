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
import InstitutionDetails from "./pages/InstitutionDetails";
import AssignMembersToElection  from "./pages/AssignMembersToElection ";


import LoginAsMember from "./pages/loginAsMember";
import RestAccesscode from "./pages/RestAccesscode";
import OtpPassowrdAdmin from "./pages/OtpPassowrdAdmin";
import RestAccesscodeByAdmin from "./pages/RestAccesscodeByAdmin";
import ResetPassword from "./pages/ResetPassword";
import AddMember from "./pages/AddmemberPage";
import UserEditDialog from "./pages/UserEditDialog";
import Electoralcycles from "./pages/Electoralcycles";
import Candidates from "./pages/Candidates";
import AddElectoralcycles from "./components/AddElectoralcycles";
import EditElectoralcycles from "./components/EditElectoralcycles";
import AddCandidates from "./components/AddCandidates";
import EditCandidates from "./components/EditCandidates";
import ElectionCycleDetails from "./components/ElectionCycleDetails";
import AddDepartment from "./components/AddDepartment";
import EditDepartment from "./components/EditDepartment";
import Addinstitution from "./components/Addinstitution";
 import Editinstitution from "./components/Editinstitution";
 

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./AuthContext";


const App = () => {
  return (

    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="votes/create" element={<CreateVote />} />
            <Route path="votes/:id" element={<VoteDetails />} />
            <Route path="user/:id" element={<UserEditDialog />} />
            <Route path="reports" element={<Reports />} />
            <Route path="members" element={<Members />} />
            <Route path="UsersInfo" element={<UsersInfo />} />
            <Route path="VotePageMain" element={<VotePageMain />} />
            <Route path="EditVote/:id" element={<EditVote />} />
            <Route path="EditElectoralcycles/:id" element={<EditElectoralcycles />} />
            <Route path="EditCandidates/:id" element={<EditCandidates />} />
            <Route path="Electoralcycles" element={<Electoralcycles />} />
            <Route path="AddElectoralcycles" element={<AddElectoralcycles />} />
            <Route path="AddCandidates" element={<AddCandidates />} />
            <Route path="Candidates" element={<Candidates />} />
            <Route path="ElectionCycleDetails" element={<ElectionCycleDetails />} />
            <Route path="Department" element={<Department />} />
            <Route path="InstitutionDetails" element={<InstitutionDetails />} />
            <Route path="/assign-members" element={<AssignMembersToElection />} />
            <Route path="EditDepartment/:id" element={<EditDepartment />} />
            <Route path="/Editinstitution/:id" element={<Editinstitution />} />
 
            <Route path="Add-Department" element={<AddDepartment />} />
            <Route path="Add-institution" element={<Addinstitution/>} />






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
      </AuthProvider>
    </Router>
  );
};

export default App;
