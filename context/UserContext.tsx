"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LocationData {
  lat: number | null;
  lng: number | null;
  address: string | null;
  city: string | null;
  state: string | null;
  constituency: string | null;
  electionType: string;
}

interface UserContextType {
  location: LocationData;
  language: string;
  role: string;
  setLanguage: (lang: string) => void;
  setRole: (role: string) => void;
  setLocation: (loc: LocationData) => void;
  updateLocation: () => Promise<void>;
  isLocating: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationData>({
    lat: null,
    lng: null,
    address: "Location Not Set",
    city: null,
    state: null,
    constituency: "Unknown",
    electionType: "Lok Sabha 2024",
  });
  const [language, setLanguage] = useState("English");
  const [role, setRole] = useState("Voter");
  const [isLocating, setIsLocating] = useState(false);

  const updateLocation = async () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, address: "Geolocation not supported" }));
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use OpenStreetMap Reverse Geocoding (Free, no key required for basic demo)
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          const city = data.address.city || data.address.town || data.address.village || data.address.suburb;
          const state = data.address.state;
          const address = data.display_name;

          setLocation({
            lat: latitude,
            lng: longitude,
            address: address,
            city: city,
            state: state,
            constituency: `${city} Central`, // Mock mapping logic for constituency
            electionType: "Lok Sabha 2024",
          });
        } catch (error) {
          console.error("Geocoding failed:", error);
          setLocation(prev => ({ ...prev, lat: latitude, lng: longitude, address: "Coordinates Detected (Geocoding failed)" }));
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        setLocation(prev => ({ ...prev, address: "Location access denied" }));
      }
    );
  };

  useEffect(() => {
    updateLocation();
  }, []);

  return (
    <UserContext.Provider value={{ location, language, role, setLanguage, setRole, setLocation, updateLocation, isLocating }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
