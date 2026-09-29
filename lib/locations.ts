export interface LocationEntry {
  id: string;
  name: string;
  district: string;
  state: 'Tamil Nadu' | 'Karnataka' | 'Kerala';
  pincode: string;
  latitude: number;
  longitude: number;
  popular?: boolean;
}

export const LOCATIONS_DATA: LocationEntry[] = [
  // Tamil Nadu - Western & Major Hubs (Starting from Erode)
  { id: 'tn-erd-1', name: 'Erode', district: 'Erode', state: 'Tamil Nadu', pincode: '638001', latitude: 11.3410, longitude: 77.7172, popular: true },
  { id: 'tn-erd-2', name: 'Bhavani', district: 'Erode', state: 'Tamil Nadu', pincode: '638301', latitude: 11.4485, longitude: 77.6826 },
  { id: 'tn-erd-3', name: 'Gobichettipalayam', district: 'Erode', state: 'Tamil Nadu', pincode: '638452', latitude: 11.4551, longitude: 77.4419 },
  { id: 'tn-erd-4', name: 'Perundurai', district: 'Erode', state: 'Tamil Nadu', pincode: '638052', latitude: 11.2764, longitude: 77.5852 },
  { id: 'tn-cbe-1', name: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', pincode: '641001', latitude: 11.0168, longitude: 76.9558, popular: true },
  { id: 'tn-tpr-1', name: 'Tirupur', district: 'Tirupur', state: 'Tamil Nadu', pincode: '641601', latitude: 11.1085, longitude: 77.3411, popular: true },
  { id: 'tn-slm-1', name: 'Salem', district: 'Salem', state: 'Tamil Nadu', pincode: '636001', latitude: 11.6643, longitude: 78.1460, popular: true },
  { id: 'tn-chn-1', name: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', pincode: '600001', latitude: 13.0827, longitude: 80.2707, popular: true },
  { id: 'tn-mdu-1', name: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', pincode: '625001', latitude: 9.9252, longitude: 78.1198, popular: true },
  { id: 'tn-trc-1', name: 'Tiruchirappalli (Trichy)', district: 'Tiruchirappalli', state: 'Tamil Nadu', pincode: '620001', latitude: 10.7905, longitude: 78.7047, popular: true },
  { id: 'tn-krk-1', name: 'Karur', district: 'Karur', state: 'Tamil Nadu', pincode: '639001', latitude: 10.9601, longitude: 78.0766 },
  { id: 'tn-dgl-1', name: 'Dindigul', district: 'Dindigul', state: 'Tamil Nadu', pincode: '624001', latitude: 10.3673, longitude: 77.9803 },
  { id: 'tn-nmk-1', name: 'Namakkal', district: 'Namakkal', state: 'Tamil Nadu', pincode: '637001', latitude: 11.2189, longitude: 78.1674 },
  { id: 'tn-tjn-1', name: 'Thanjavur', district: 'Thanjavur', state: 'Tamil Nadu', pincode: '613001', latitude: 10.7870, longitude: 79.1378 },
  { id: 'tn-tir-1', name: 'Tirunelveli', district: 'Tirunelveli', state: 'Tamil Nadu', pincode: '627001', latitude: 8.7139, longitude: 77.7567 },
  { id: 'tn-vel-1', name: 'Vellore', district: 'Vellore', state: 'Tamil Nadu', pincode: '632001', latitude: 12.9165, longitude: 79.1325 },
  { id: 'tn-hos-1', name: 'Hosur', district: 'Krishnagiri', state: 'Tamil Nadu', pincode: '635109', latitude: 12.7409, longitude: 77.8253, popular: true },
  { id: 'tn-kgi-1', name: 'Krishnagiri', district: 'Krishnagiri', state: 'Tamil Nadu', pincode: '635001', latitude: 12.5186, longitude: 78.2137 },
  { id: 'tn-dh-1', name: 'Dharmapuri', district: 'Dharmapuri', state: 'Tamil Nadu', pincode: '636701', latitude: 12.1211, longitude: 78.1582 },
  { id: 'tn-tut-1', name: 'Thoothukudi (Tuticorin)', district: 'Thoothukudi', state: 'Tamil Nadu', pincode: '628001', latitude: 8.7642, longitude: 78.1348 },
  { id: 'tn-oot-1', name: 'Udhagamandalam (Ooty)', district: 'Nilgiris', state: 'Tamil Nadu', pincode: '643001', latitude: 11.4102, longitude: 76.6950 },
  { id: 'tn-kny-1', name: 'Kanyakumari', district: 'Kanyakumari', state: 'Tamil Nadu', pincode: '629702', latitude: 8.0883, longitude: 77.5385 },

  // Karnataka - Major Hubs & Districts
  { id: 'ka-blr-1', name: 'Bengaluru (Bangalore)', district: 'Bengaluru Urban', state: 'Karnataka', pincode: '560001', latitude: 12.9716, longitude: 77.5946, popular: true },
  { id: 'ka-blr-2', name: 'Electronic City, Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', pincode: '560100', latitude: 12.8452, longitude: 77.6602 },
  { id: 'ka-blr-3', name: 'Whitefield, Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', pincode: '560066', latitude: 12.9698, longitude: 77.7500 },
  { id: 'ka-mys-1', name: 'Mysuru (Mysore)', district: 'Mysuru', state: 'Karnataka', pincode: '570001', latitude: 12.2958, longitude: 76.6394, popular: true },
  { id: 'ka-mng-1', name: 'Mangaluru (Mangalore)', district: 'Dakshina Kannada', state: 'Karnataka', pincode: '575001', latitude: 12.9141, longitude: 74.8560, popular: true },
  { id: 'ka-hub-1', name: 'Hubballi-Dharwad', district: 'Dharwad', state: 'Karnataka', pincode: '580020', latitude: 15.3647, longitude: 75.1240 },
  { id: 'ka-blg-1', name: 'Belagavi (Belgaum)', district: 'Belagavi', state: 'Karnataka', pincode: '590001', latitude: 15.8497, longitude: 74.4977 },
  { id: 'ka-hsn-1', name: 'Hassan', district: 'Hassan', state: 'Karnataka', pincode: '573201', latitude: 13.0033, longitude: 76.1004 },
  { id: 'ka-tum-1', name: 'Tumakuru (Tumkur)', district: 'Tumakuru', state: 'Karnataka', pincode: '572101', latitude: 13.3379, longitude: 77.1173 },
  { id: 'ka-shm-1', name: 'Shivamogga (Shimoga)', district: 'Shivamogga', state: 'Karnataka', pincode: '577201', latitude: 13.9299, longitude: 75.5681 },
  { id: 'ka-dvg-1', name: 'Davanagere', district: 'Davanagere', state: 'Karnataka', pincode: '577001', latitude: 14.4644, longitude: 75.9218 },
  { id: 'ka-bell-1', name: 'Ballari (Bellary)', district: 'Ballari', state: 'Karnataka', pincode: '583101', latitude: 15.1394, longitude: 76.9214 },

  // Kerala - Major Hubs & Districts
  { id: 'kl-koc-1', name: 'Kochi (Cochin)', district: 'Ernakulam', state: 'Kerala', pincode: '682001', latitude: 9.9312, longitude: 76.2673, popular: true },
  { id: 'kl-tvm-1', name: 'Thiruvananthapuram (Trivandrum)', district: 'Thiruvananthapuram', state: 'Kerala', pincode: '695001', latitude: 8.5241, longitude: 76.9366, popular: true },
  { id: 'kl-kzk-1', name: 'Kozhikode (Calicut)', district: 'Kozhikode', state: 'Kerala', pincode: '673001', latitude: 11.2588, longitude: 75.7804, popular: true },
  { id: 'kl-plk-1', name: 'Palakkad', district: 'Palakkad', state: 'Kerala', pincode: '678001', latitude: 10.7867, longitude: 76.6548, popular: true },
  { id: 'kl-tsr-1', name: 'Thrissur', district: 'Thrissur', state: 'Kerala', pincode: '680001', latitude: 10.5276, longitude: 76.2144, popular: true },
  { id: 'kl-klm-1', name: 'Kollam (Quilon)', district: 'Kollam', state: 'Kerala', pincode: '691001', latitude: 8.8932, longitude: 76.6141 },
  { id: 'kl-kty-1', name: 'Kottayam', district: 'Kottayam', state: 'Kerala', pincode: '686001', latitude: 9.5916, longitude: 76.5222 },
  { id: 'kl-alp-1', name: 'Alappuzha (Alleppey)', district: 'Alappuzha', state: 'Kerala', pincode: '688001', latitude: 9.4981, longitude: 76.3388 },
  { id: 'kl-knr-1', name: 'Kannur', district: 'Kannur', state: 'Kerala', pincode: '670001', latitude: 11.8745, longitude: 75.3704 },
  { id: 'kl-wyn-1', name: 'Kalpetta (Wayanad)', district: 'Wayanad', state: 'Kerala', pincode: '673121', latitude: 11.6084, longitude: 76.0827 },
  { id: 'kl-mlp-1', name: 'Malappuram', district: 'Malappuram', state: 'Kerala', pincode: '676505', latitude: 11.0510, longitude: 76.0711 },
];

export function searchLocations(query: string): LocationEntry[] {
  if (!query || query.trim().length === 0) {
    return LOCATIONS_DATA.filter((l) => l.popular);
  }
  const clean = query.trim().toLowerCase();
  return LOCATIONS_DATA.filter(
    (l) =>
      l.name.toLowerCase().includes(clean) ||
      l.district.toLowerCase().includes(clean) ||
      l.pincode.includes(clean) ||
      l.state.toLowerCase().includes(clean)
  );
}

export function findLocationByPincodeOrName(text: string): LocationEntry | undefined {
  const clean = text.trim().toLowerCase();
  return LOCATIONS_DATA.find(
    (l) => l.pincode === clean || l.name.toLowerCase() === clean
  );
}
