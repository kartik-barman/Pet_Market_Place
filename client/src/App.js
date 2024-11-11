import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home";
import PetDetails from "./pages/PetDetails/PetDetails";
import PopularPets from "./pages/PopularPets/PopularPets";
import Cart from "./pages/Cart/Cart";
import PaymentPage from "./pages/PaymentPage/PaymentPage";
import UserProfile from "./pages/UserProfile/UserProfile";
import AboutUs from "./pages/AboutUs/AboutUs";
import ContactUs from "./pages/ContactUs/ContactUs";
import SellPetPage from "./pages/SellPetPage/SellPetPage";
import SignUp from "./pages/Auth/Signup/SignUp";
import SignIn from "./pages/Auth/SignIn/SignIn";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderForm from "./pages/OrderCheckOut/OrderForm";
import GlobalProfile from "./pages/GlobalProfile/GlobalProfile";
import ProductOrderDetails from "./pages/ProductOrderDetails/ProductOrderDetails";

const App = () => {
  const userType = localStorage.getItem("role");
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/pet/:petId" element={<PetDetails />} />
          <Route path="/popular-pets" element={<PopularPets />} />
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <SellPetPage />  
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/profile/:userId" element={<GlobalProfile />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ckeckout"
            element={
              <ProtectedRoute>
                <OrderForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
           <Route
          path="/all/orders/:productId"
          element={
            <ProtectedRoute>
              <ProductOrderDetails />
            </ProtectedRoute>
          }
        />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
