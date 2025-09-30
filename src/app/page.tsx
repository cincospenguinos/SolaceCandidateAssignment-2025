"use client";

import { useEffect, useRef, useState } from "react";

type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: string;
  phoneNumber: string;
};

export interface ApiClient {
  getAdvocates(): Advocate[];
};

class DefaultApiClient implements ApiClient {
  getAdvocates(): Promise<Advocate[]> {
    return fetch("/api/advocates")
      .then(response => response.json())
      .then(r => r.data);
  }
}

export default function Home({ apiClient = new DefaultApiClient() }) {
  const [advocates, setAdvocates] = useState([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    apiClient.getAdvocates().then((advocates) => {
      setAdvocates(advocates);
      setFilteredAdvocates(advocates);
    });
  }, []);

  const onChange = () => {
    const searchTerm = searchRef.current.value;

    const filteredAdvocates = advocates.filter((advocate) => {
      return [
        advocate.firstName,
        advocate.lastName,
        advocate.city,
        advocate.degree,
        ...advocate.specialties,
      ].map(f => f.toLowerCase())
      .some(f => f.includes(searchTerm.toLowerCase()));
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <label htmlFor="search-input">Search</label>
        <input
          id="search-input"
          style={{ border: "1px solid black" }}
          onChange={onChange}
          ref={searchRef}
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={`${advocate.lastName}-${advocate.firstName}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={`${advocate.lastName}-${s}`}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
