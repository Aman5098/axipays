import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckoutForm from "./components/CheckoutForm";
import Dashboard from "./components/Dashboard";
import "./App.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/checkout" element={<CheckoutForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;