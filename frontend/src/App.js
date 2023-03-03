import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/layouts/header/Header";
import { useEffect, useState } from "react";
import WebFont from "webfontloader";
import Footer from "./components/layouts/footer/Footer";
import Home from "./components/home/Home";
import ProductDetails from "./components/product/ProductDetails";
import Products from "./components/product/Products";
import Serarch from "./components/product/Serarch.js";
import LoginSignup from "./components/user/LoginSignup";
import Store from "./Store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./components/layouts/header/UserOptions";
import { useSelector } from "react-redux";
import Profile from "./components/user/Profile";
import ProtectedRoute from "./components/route/ProtectedRoute";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgoutPassword from "./components/user/ForgoutPassword";
import ResetPassword from "./components/user/ResetPassword";
import Cart from "./components/cart/Cart";
import Shipping from "./components/shipping/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import axios from "axios";
import Payment from "./components/cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/cart/OrderSuccess";
import MyOrders from "./components/order/MyOrders";
import OrderDetails from "./components/order/OrderDetails";
import DashBoard from "./components/admin/DashBoard";
import ProductList from "./components/admin/ProductList";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrderList from "./components/admin/OrderList";
import ProcessOrder from "./components/admin/ProcessOrder";
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";
import Contact from "./components/layouts/contact/Contact";
import About from "./components/layouts/about/About";
import NotFound from "./components/layouts/not found/NotFound";

function App() {
	const { isAuthenticated, user } = useSelector((state) => state.user);

	const [stripeApiKey, setStripeApiKey] = useState("");

	async function getStripeApiKey() {
		const { data } = await axios.get("/api/v1/stripeapikey");

		setStripeApiKey(data.stripeApiKey);
	}

	useEffect(() => {
		WebFont.load({
			google: {
				families: ["Roboto", "Droid Sans", "Chilanka"],
			},
		});
		Store.dispatch(loadUser());

		getStripeApiKey();
	}, []);

	window.addEventListener("contextmenu", (e) => e.preventDefault());

	return (
		<div>
			<Header />
			{isAuthenticated && <UserOptions user={user} />}
			{stripeApiKey && (
				<Elements stripe={loadStripe(stripeApiKey)}>
					<Routes>
						<Route
							exact
							path="/process/payment"
							element={<Payment />}
						/>
					</Routes>
				</Elements>
			)}

			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route exact path="/*" element={<NotFound />} />
				<Route exact path="/product/:id" element={<ProductDetails />} />
				<Route exact path="/products" element={<Products />} />
				<Route path="/products/:keyword" element={<Products />} />
				<Route exact path="/search" element={<Serarch />} />

				<Route exact path="/contact" element={<Contact />} />
				<Route exact path="/about" element={<About />} />
				{/* ProtectedRoutes */}

				<Route component={<ProtectedRoute />}>
					<Route exact path="/account" element={<Profile />} />
					<Route
						exact
						path="/me/update"
						element={<UpdateProfile />}
					/>
					<Route
						exact
						path="/password/update"
						element={<UpdatePassword />}
					/>
					<Route exact path="/shipping" element={<Shipping />} />
					<Route exact path="/success" element={<OrderSuccess />} />
					<Route exact path="/orders" element={<MyOrders />} />
					<Route exact path="/order/:id" element={<OrderDetails />} />
					<Route
						exact
						path="/order/confirm"
						element={<ConfirmOrder />}
					/>
					<Route
						exact
						isAdmin={true}
						path="/admin/dashboard"
						element={<DashBoard />}
					/>
					<Route
						exact
						isAdmin={true}
						path="/admin/products"
						element={<ProductList />}
					/>
					<Route
						exact
						isAdmin={true}
						path="/admin/product"
						element={<NewProduct />}
					/>
					<Route
						exact
						isAdmin={true}
						path="/admin/product/:id"
						element={<UpdateProduct />}
					/>
					<Route
						exact
						isAdmin={true}
						path="/admin/orders"
						element={<OrderList />}
					/>
					<Route
						exact
						isAdmin={true}
						path="/admin/users"
						element={<UsersList />}
					/>

					<Route
						exact
						isAdmin={true}
						path="/admin/user/:id"
						element={<UpdateUser />}
					/>

					<Route
						exact
						isAdmin={true}
						path="/admin/reviews"
						element={<ProductReviews />}
					/>

					<Route
						exact
						isAdmin={true}
						path="/admin/order/:id"
						element={<ProcessOrder />}
					/>
				</Route>

				<Route
					exact
					path="/password/forgot"
					element={<ForgoutPassword />}
				/>
				<Route
					exact
					path="/password/reset/:token"
					element={<ResetPassword />}
				/>
				<Route exact path="/login" element={<LoginSignup />} />
				<Route exact path="/cart" element={<Cart />} />
				<Route
					element={
						window.location.pathname ===
						"/process/payment" ? null : (
							<NotFound />
						)
					}
				/>
			</Routes>
			<Footer />
		</div>
	);
}

export default App;
