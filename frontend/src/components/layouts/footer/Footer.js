import React from "react";
import "./Footer.css";

const Footer = () => {
	const playStore="https://res.cloudinary.com/do3egmobd/image/upload/v1677797050/E-commerse/asets/playstore_gbam4x.png";
	const appStore="https://res.cloudinary.com/do3egmobd/image/upload/v1677797050/E-commerse/asets/Appstore_zqh5yk.png";

	return (
		<footer id="footer">
			<div className="leftFooter">
				<h4>DOWNLOAD OUR APP</h4>
				<p>Download App for Android and IOS mobile phone</p>
				<img src={playStore} alt="playstore" />
				<img src={appStore} alt="Appstore" />
			</div>

			<div className="midFooter">
				<h1>ECOMMERCE.</h1>
				<p>High Quality is our first priority</p>

				<p>Copyrights 2023 &copy; MeKrishnaKolapte</p>
			</div>

			<div className="rightFooter">
				<h4>Follow Us</h4>
				<a href="http://instagram.com/meabhisingh">Instagram</a>
				<a href="http://youtube.com/6packprogramemr">Youtube</a>
				<a href="http://instagram.com/meabhisingh">Facebook</a>
			</div>
		</footer>
	);
};

export default Footer;
