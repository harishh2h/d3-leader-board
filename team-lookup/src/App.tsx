import MilestonesPage from "@/pages/MilestonesPage";
import TeamLookupPage from "@/pages/TeamLookupPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function routerBasename(): string | undefined {
  const baseUrl: string = import.meta.env.BASE_URL;
  const trimmed: string = baseUrl.replace(/\/$/, "");
  return trimmed === "" ? undefined : trimmed;
}

export default function App(): JSX.Element {
  return (
    <BrowserRouter basename={routerBasename()}>
      <Routes>
        <Route path="/" element={<TeamLookupPage />} />
        <Route path="/milestones" element={<MilestonesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
