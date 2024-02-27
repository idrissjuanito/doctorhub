interface IPerson {
	first_name: string
	last_name: string
	gender: string
}

export interface IUserProfile extends IPerson {
	address: string
	city: string
	state: string
	email?: string
	contact_one: string
	contact_two: string
}

export interface DoctorType extends IUserProfile {
	doctor_id: string
	speciality: string
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

export interface IPatient extends IUserProfile {
	patient_id?: string
}

export interface BookingModel {
	datetime: string
	reason: string
	doctor: DoctorType
	patient?: IPatient
	notes?: string
}

export interface IAppointment {
	reason: string
	notes: string
	datetime: string
	doctor_id: string
	patient_id: string
}
