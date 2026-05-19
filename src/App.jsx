import { HashRouter, Routes, Route } from "react-router-dom";
import CheckoutForm from "./components/CheckoutForm";
import Dashboard from "./components/Dashboard";
import "./App.css";


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/checkout" element={<CheckoutForm />} />
      </Routes>
    </HashRouter>
  );
}

export default App;