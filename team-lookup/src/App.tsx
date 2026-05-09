import MilestonesPage from "@/pages/MilestonesPage";
import TeamLookupPage from "@/pages/TeamLookupPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TeamLookupPage />} />
        <Route path="/milestones" element={<MilestonesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
