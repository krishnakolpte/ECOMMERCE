import React from "react";
import "./ReviewCard.css";
import { Rating } from "@material-ui/lab";

const ReviewCard = ({ review }) => {
	const profilePng="https://res.cloudinary.com/do3egmobd/image/upload/v1677797050/E-commerse/asets/Profile_sxns2x.png";
	const options = {
		size: "large",
		readOnly: true,
		precision: 0.5,
		value: review.rating,
	};
	return (
		<div className="reviewCard">
			<img src={profilePng} alt="User" />
			<p>{review?.name}</p>
			<Rating {...options} />
			<span className="reviewCardComment">{review?.comment}</span>
		</div>
	);
};

export default ReviewCard;
