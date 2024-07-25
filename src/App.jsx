import { BrowserRouter, Routes, Route } from "react-router-dom";
import  AuthProvider  from "./Authentication/AuthProvider";
import Sales from "./pages/Sales";
import Shipping from "./pages/Shipping";
import Homepage from "./pages/Homepage";
import AppLayout from "./pages/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import ProductInventory from "./pages/ProductInventory";
import SalesOrderDetails from "./pages/SalesOrderDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales-order-details/:id" element={<SalesOrderDetails />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/inventory" element={<ProductInventory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/app" element={<AppLayout />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
