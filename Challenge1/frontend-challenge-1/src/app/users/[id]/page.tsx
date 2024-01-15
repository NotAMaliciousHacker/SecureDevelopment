// pages/users/[id].tsx
'use client' 

// import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
  address: string;
  iban: string;
}

const UserProfile = ({ params }: { params: { id: number } }) => {
  // const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`http://localhost:7331/users/${params.id}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error:', error));
  }, [params.id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%)`}}>
      <h1>User Profile</h1>
      <br />
      <p>Name: {user.name}</p>
      <br />
      <p>Email: {user.email}</p>
      <br />
      <p>Address: {user.address}</p>
      <br />
      <p>IBAN: {user.iban}</p>
      </div>
  );
}

export default UserProfile;
