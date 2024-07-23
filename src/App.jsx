import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sales from "./pages/Sales";
import Shipping from "./pages/Shipping";
import Homepage from "./pages/Homepage";
import AppLayout from "./pages/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import ProductInventory from "./pages/ProductInventory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/inventory" element={<ProductInventory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/app" element={<AppLayout />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
