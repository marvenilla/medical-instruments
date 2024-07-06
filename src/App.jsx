import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sales from "./pages/Sales";
import Shipping from "./pages/Shipping";
import Homepage from "./pages/Homepage";
import AppLayout from "./pages/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="sales" element={<Sales />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="/login" element={<Login />} />
        <Route path="app" element={<AppLayout />}></Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
