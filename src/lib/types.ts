// Core types for the earthquake monitoring app

export interface Earthquake {
	id: string;
	magnitude: number;
	place: string;
	time: number;
	coordinates: [longitude: number, latitude: number, depth: number];
	url: string;
}

export interface UserLocation {
	latitude: number;
	longitude: number;
	accuracy?: number;
}

export interface FeltIntensity {
	earthquake: Earthquake;
	distance: number;
	intensity: number;
	intensityLabel: 'Weak' | 'Light' | 'Moderate' | 'Strong' | 'Very Strong';
}

export type TimeWindow = '24h' | '7d' | '30d';

export interface USGSFeature {
	type: 'Feature';
	properties: {
		mag: number;
		place: string;
		time: number;
		url: string;
		[key: string]: any;
	};
	geometry: {
		type: 'Point';
		coordinates: [number, number, number];
	};
	id: string;
}

export interface USGSResponse {
	type: 'FeatureCollection';
	metadata: {
		generated: number;
		url: string;
		title: string;
		status: number;
		api: string;
		count: number;
	};
	features: USGSFeature[];
}
