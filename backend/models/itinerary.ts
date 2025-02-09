import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
	},
	travellers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
	}],
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	destination: {
		type: String,
		required: true,
	},
	startDate: {
		type: Date,
		required: true,
	},
	endDate: {
		type: Date,
		required: true,
	},
	events: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "events",
		},
	],
	picture: Buffer,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Itinerary = mongoose.model("itineraries", itinerarySchema);

export default Itinerary;