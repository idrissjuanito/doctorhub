export interface DoctorType {
	doctor_id: string
	first_name: string
	last_name: string
	speciality: string
	address: string
	city: string
	hospital_name: string
	picture: string
}


export interface UserJWTInfo {
	email: string;
	account_id: string;
	profile_id: string;
	user_id: string;
	account_type: string;
	exp: number;
}

export interface BookingModel {
	datetime: string
	reason: string
	doctor: string
	notes?: string
}

export interface BookingConfirmationModel {
	userData: UserJWTInfo
	bookingData: BookingModel
}
