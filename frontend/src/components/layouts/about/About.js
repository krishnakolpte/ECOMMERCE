import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
	const visitInstagram = () => {
		window.location = "https://www.instagram.com/its_krishnavk";
	};
	return (
		<div className="aboutSection">
			<div></div>
			<div className="aboutSectionGradient"></div>
			<div className="aboutSectionContainer">
				<Typography component="h1">About Us</Typography>

				<div>
					<div>
						<Avatar
							style={{
								width: "10vmax",
								height: "10vmax",
								margin: "2vmax 0",
							}}
							src="https://res.cloudinary.com/do3egmobd/image/upload/v1677740617/its_krishna/IMG_20220920_213818_lixiem.jpg"
							alt="Founder"
						/>
						<Typography>krishna kolapte</Typography>
						<Button onClick={visitInstagram} color="primary">
							Visit Instagram
						</Button>
						<span>
							This is a sample wesbite made by @its_krishna. Only
							with the purpose to learn MERN Stack web
							devolopment.
						</span>
						<span style={{ marginTop: "20px" }}>
							and learn MERN Stack web devolopment from
							@meabhisingh on youtube 6 pack programmer.
						</span>
					</div>
					<div className="aboutSectionContainer2">
						<Typography component="h2">Active On</Typography>

						<a
							href="https://www.instagram.com/its_krishnavk"
							target="blank"
						>
							<InstagramIcon className="instagramSvgIcon" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
