import { ReactNavbar } from "overlay-navbar";
import { MdPermContactCalendar } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { FiShoppingBag } from "react-icons/fi";

function Header() {
	const option = {
		burgerColor: "crimson",
		logo: "https://res.cloudinary.com/do3egmobd/image/upload/v1677797050/E-commerse/asets/logo_hldp5t.png",
		logoWidth: "20vmax",
		navColor1: "white",
		logoHoverSize: "10px",
		logoHoverColor: "#eb4034",
		link1Text: "Home",
		link2Text: "Products",
		link3Text: "Contact",
		link4Text: "About",
		link1Url: "/",
		link2Url: "/products",
		link3Url: "/contact",
		link4Url: "/about",
		link1Size: "1.3vmax",
		link1Color: "black",
		nav1justifyContent: "flex-end",
		nav2justifyContent: "flex-end",
		nav3justifyContent: "flex-start",
		nav4justifyContent: "flex-start",
		link1ColorHover: "#eb4034",
		link1Margin: "1vmax",
		profileIconUrl: "/login",
		searchIconUrl:"/search",
		cartIconUrl:"/cart",
		profileIconColor: "black",
		searchIconColor: "black",
		cartIconColor: "black",
		profileIconColorHover: "#eb4034",
		searchIconColorHover: "#eb4034",
		cartIconColorHover: "#eb4034",
		cartIconMargin: "1vmax",
		searchIcon: "true",
		cartIcon: "true",
		profileIcon: "true",
		SearchIconElement: AiOutlineSearch,
		CartIconElement: FiShoppingBag,
		ProfileIconElement: MdPermContactCalendar,
	};
	return <ReactNavbar {...option} />;
}

export default Header;
